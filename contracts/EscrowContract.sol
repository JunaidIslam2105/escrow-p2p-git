// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EscrowContract {
    enum OrderStatus { Created, Funded, InProgress, Completed, Disputed, Refunded }
    
    struct Order {
        uint256 id;
        address buyer;
        address seller;
        uint256 amount;
        string details;
        OrderStatus status;
        uint256 createdAt;
        uint256 completedAt;
    }
    
    mapping(uint256 => Order) public orders;
    uint256 public orderCounter;
    
    event OrderCreated(uint256 orderId, address buyer, address seller, uint256 amount);
    event OrderFunded(uint256 orderId, uint256 amount);
    event OrderInProgress(uint256 orderId);
    event OrderCompleted(uint256 orderId);
    event OrderDisputed(uint256 orderId);
    event OrderRefunded(uint256 orderId);
    
    constructor() {
        orderCounter = 0;
    }
    
    function createOrder(address _seller, string memory _details) external returns (uint256) {
        orderCounter++;
        
        orders[orderCounter] = Order({
            id: orderCounter,
            buyer: msg.sender,
            seller: _seller,
            amount: 0,
            details: _details,
            status: OrderStatus.Created,
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        emit OrderCreated(orderCounter, msg.sender, _seller, 0);
        
        return orderCounter;
    }
    
    function fundOrder(uint256 _orderId) external payable {
        require(orders[_orderId].id == _orderId, "Order does not exist");
        require(orders[_orderId].buyer == msg.sender, "Only buyer can fund the order");
        require(orders[_orderId].status == OrderStatus.Created, "Order is not in Created status");
        require(msg.value > 0, "Amount must be greater than 0");
        
        orders[_orderId].amount = msg.value;
        orders[_orderId].status = OrderStatus.Funded;
        
        emit OrderFunded(_orderId, msg.value);
    }
    
    function startOrder(uint256 _orderId) external {
        require(orders[_orderId].id == _orderId, "Order does not exist");
        require(orders[_orderId].seller == msg.sender, "Only seller can start the order");
        require(orders[_orderId].status == OrderStatus.Funded, "Order is not in Funded status");
        
        orders[_orderId].status = OrderStatus.InProgress;
        
        emit OrderInProgress(_orderId);
    }
    
    function completeOrder(uint256 _orderId) external {
        require(orders[_orderId].id == _orderId, "Order does not exist");
        require(orders[_orderId].buyer == msg.sender, "Only buyer can complete the order");
        require(orders[_orderId].status == OrderStatus.InProgress, "Order is not in InProgress status");
        
        orders[_orderId].status = OrderStatus.Completed;
        orders[_orderId].completedAt = block.timestamp;
        
        // Transfer funds to seller
        payable(orders[_orderId].seller).transfer(orders[_orderId].amount);
        
        emit OrderCompleted(_orderId);
    }
    
    function disputeOrder(uint256 _orderId) external {
        require(orders[_orderId].id == _orderId, "Order does not exist");
        require(orders[_orderId].buyer == msg.sender || orders[_orderId].seller == msg.sender, "Only buyer or seller can dispute the order");
        require(orders[_orderId].status == OrderStatus.InProgress, "Order is not in InProgress status");
        
        orders[_orderId].status = OrderStatus.Disputed;
        
        emit OrderDisputed(_orderId);
    }
    
    function refundOrder(uint256 _orderId) external {
        require(orders[_orderId].id == _orderId, "Order does not exist");
        require(orders[_orderId].seller == msg.sender, "Only seller can refund the order");
        require(orders[_orderId].status == OrderStatus.Disputed || orders[_orderId].status == OrderStatus.InProgress, "Order is not in Disputed or InProgress status");
        
        orders[_orderId].status = OrderStatus.Refunded;
        
        // Transfer funds back to buyer
        payable(orders[_orderId].buyer).transfer(orders[_orderId].amount);
        
        emit OrderRefunded(_orderId);
    }
    
    function getOrder(uint256 _orderId) external view returns (Order memory) {
        require(orders[_orderId].id == _orderId, "Order does not exist");
        return orders[_orderId];
    }
}