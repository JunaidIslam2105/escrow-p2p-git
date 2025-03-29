const express = require('express');
const router = express.Router();
const { protect, seller } = require('../middleware/authMiddleware');
const { 
  createOrder,
  getOrderById,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
  fundOrder,
  startOrder,
  completeOrder,
  disputeOrder,
  refundOrder
} = require('../controllers/orderController');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', protect, createOrder);

// @route   GET /api/orders
// @desc    Get logged in user's orders
// @access  Private
router.get('/', protect, getMyOrders);

// @route   GET /api/orders/seller
// @desc    Get seller's orders
// @access  Private/Seller
router.get('/seller', protect, seller, getSellerOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, getOrderById);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/:id/status', protect, updateOrderStatus);

// @route   PUT /api/orders/:id/fund
// @desc    Fund an order
// @access  Private
router.put('/:id/fund', protect, fundOrder);

// @route   PUT /api/orders/:id/start
// @desc    Start an order
// @access  Private/Seller
router.put('/:id/start', protect, seller, startOrder);

// @route   PUT /api/orders/:id/complete
// @desc    Complete an order
// @access  Private
router.put('/:id/complete', protect, completeOrder);

// @route   PUT /api/orders/:id/dispute
// @desc    Dispute an order
// @access  Private
router.put('/:id/dispute', protect, disputeOrder);

// @route   PUT /api/orders/:id/refund
// @desc    Refund an order
// @access  Private/Seller
router.put('/:id/refund', protect, seller, refundOrder);

module.exports = router;