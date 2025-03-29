const Order = require('../models/Order');
const User = require('../models/User');
const { ethers } = require('ethers');
const axios = require('axios');
const contractABI = require('../utils/contractABI');

// Initialize blockchain provider and contract
let provider, wallet, contract;
let isBlockchainEnabled = false;

const initBlockchain = () => {
  if (!process.env.BLOCKCHAIN_PROVIDER || !process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
    console.warn('Missing required environment variables for blockchain interaction');
    console.warn('Please set BLOCKCHAIN_PROVIDER, PRIVATE_KEY, and CONTRACT_ADDRESS in .env file');
    return false;
  }

  try {
    provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_PROVIDER);
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);
    isBlockchainEnabled = true;
    return true;
  } catch (error) {
    console.error('Error initializing blockchain connection:', error);
    return false;
  }
};

initBlockchain();

/**
 * Get exchange rate from INR to USDT
 * @returns {Number} - Exchange rate
 */
const getExchangeRate = async () => {
  try {
    // For prototype, we'll use a fixed exchange rate
    // In production, this would call an actual exchange API
    return 0.012; // 1 INR = 0.012 USDT (example rate)
  } catch (error) {
    console.error('Error getting exchange rate:', error);
    throw new Error('Failed to get exchange rate');
  }
};

/**
 * Create a new order
 * @route POST /api/orders
 * @access Private
 */
const createOrder = async (req, res) => {
  try {
    const { sellerId, details, inrAmount } = req.body;
    
    if (!sellerId || !details || !inrAmount) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Get seller
    const seller = await User.findById(sellerId);
    
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }
    
    // Get exchange rate
    const exchangeRate = await getExchangeRate();
    const usdtAmount = inrAmount * exchangeRate;
    
    let orderId;
    if (isBlockchainEnabled) {
      try {
        // Create order on blockchain
        const tx = await contract.createOrder(seller.walletAddress, details);
        const receipt = await tx.wait();
        
        // Get order ID from event
        const event = receipt.events.find(e => e.event === 'OrderCreated');
        orderId = event.args.orderId.toNumber();
      } catch (error) {
        console.error('Blockchain error in createOrder:', error);
        return res.status(500).json({ message: 'Blockchain operation failed' });
      }
    } else {
      // Generate a local order ID if blockchain is not enabled
      orderId = Date.now();
    }
    
    // Create order in database
    const order = await Order.create({
      orderId,
      buyer: req.user._id,
      seller: sellerId,
      amount: 0, // Will be updated when funded
      details,
      status: 'created',
      blockchainTxHash: isBlockchainEnabled ? receipt.transactionHash : null,
      inrAmount,
      usdtAmount,
      exchangeRate
    });
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Fund an order
 * @route PUT /api/orders/:id/fund
 * @access Private
 */
const fundOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (order.status !== 'created') {
      return res.status(400).json({ message: 'Order cannot be funded' });
    }
    
    // In a real system, this would handle the payment gateway integration
    // For prototype, we'll simulate the payment
    
    // Update blockchain
    const tx = await contract.fundOrder(order.orderId, {
      value: ethers.utils.parseEther(order.usdtAmount.toString())
    });
    const receipt = await tx.wait();
    
    // Update order in database
    order.status = 'funded';
    order.amount = order.usdtAmount;
    order.blockchainTxHash = receipt.transactionHash;
    
    await order.save();
    
    res.json(order);
  } catch (error) {
    console.error('Error in fundOrder:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Start an order (seller accepts)
 * @route PUT /api/orders/:id/start
 * @access Private
 */
const startOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (order.status !== 'funded') {
      return res.status(400).json({ message: 'Order cannot be started' });
    }
    
    // Update blockchain
    const tx = await contract.startOrder(order.orderId);
    const receipt = await tx.wait();
    
    // Update order in database
    order.status = 'inProgress';
    order.blockchainTxHash = receipt.transactionHash;
    
    await order.save();
    
    res.json(order);
  } catch (error) {
    console.error('Error in startOrder:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Complete an order
 * @route PUT /api/orders/:id/complete
 * @access Private
 */
const completeOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (order.status !== 'inProgress') {
      return res.status(400).json({ message: 'Order cannot be completed' });
    }
    
    // Update blockchain
    const tx = await contract.completeOrder(order.orderId);
    const receipt = await tx.wait();
    
    // Update order in database
    order.status = 'completed';
    order.completedAt = Date.now();
    order.blockchainTxHash = receipt.transactionHash;
    
    await order.save();
    
    res.json(order);
  } catch (error) {
    console.error('Error in completeOrder:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Dispute an order
 * @route PUT /api/orders/:id/dispute
 * @access Private
 */
const disputeOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.buyer.toString() !== req.user._id.toString() && order.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (order.status !== 'inProgress') {
      return res.status(400).json({ message: 'Order cannot be disputed' });
    }
    
    // Update blockchain
    const tx = await contract.disputeOrder(order.orderId);
    const receipt = await tx.wait();
    
    // Update order in database
    order.status = 'disputed';
    order.blockchainTxHash = receipt.transactionHash;
    
    await order.save();
    
    res.json(order);
  } catch (error) {
    console.error('Error in disputeOrder:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Refund an order
 * @route PUT /api/orders/:id/refund
 * @access Private
 */
const refundOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (order.status !== 'disputed' && order.status !== 'inProgress') {
      return res.status(400).json({ message: 'Order cannot be refunded' });
    }
    
    // Update blockchain
    const tx = await contract.refundOrder(order.orderId);
    const receipt = await tx.wait();
    
    // Update order in database
    order.status = 'refunded';
    order.blockchainTxHash = receipt.transactionHash;
    
    await order.save();
    
    res.json(order);
  } catch (error) {
    console.error('Error in refundOrder:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all orders
 * @route GET /api/orders
 * @access Private
 */
const getOrders = async (req, res) => {
  try {
    let orders;
    
    if (req.user.role === 'admin') {
      // Admin can see all orders
      orders = await Order.find({}).populate('buyer', 'name email').populate('seller', 'name email');
    } else if (req.user.role === 'buyer') {
      // Buyer can see their orders
      orders = await Order.find({ buyer: req.user._id }).populate('seller', 'name email');
    } else {
      // Seller can see their orders
      orders = await Order.find({ seller: req.user._id }).populate('buyer', 'name email');
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Error in getOrders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get order by ID
 * @route GET /api/orders/:id
 * @access Private
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id })
      .populate('buyer', 'name email walletAddress')
      .populate('seller', 'name email walletAddress bankDetails');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && 
        order.buyer._id.toString() !== req.user._id.toString() && 
        order.seller._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error in getOrderById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update order status
 * @route PUT /api/orders/:id/status
 * @access Private
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ orderId: req.params.id });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    order.status = status;
    await order.save();
    
    res.json(order);
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  fundOrder,
  startOrder,
  completeOrder,
  disputeOrder,
  refundOrder,
  getOrders,
  getOrderById,
  getMyOrders: getOrders,
  getSellerOrders: getOrders,
  updateOrderStatus
};