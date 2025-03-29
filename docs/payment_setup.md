# Payment and Currency Exchange Setup Guide

## Overview

This guide covers the implementation of payment processing and currency exchange functionality for the P2P Escrow system, handling INR to USDT conversions and secure transactions.

## Prerequisites

1. **Exchange API Access**
   - Register for a cryptocurrency exchange API
   - Obtain API key and secret
   - Enable required permissions

## Implementation Steps

### 1. Configure Exchange API

1. **Update Environment Variables**
   ```
   EXCHANGE_API_KEY=your_exchange_api_key
   EXCHANGE_API_SECRET=your_exchange_api_secret
   EXCHANGE_API_URL=https://api.exchange.com
   ```

2. **Create Exchange Service**
   ```javascript
   // services/exchangeService.js
   const axios = require('axios');
   const crypto = require('crypto');

   class ExchangeService {
     constructor() {
       this.apiKey = process.env.EXCHANGE_API_KEY;
       this.apiSecret = process.env.EXCHANGE_API_SECRET;
       this.apiUrl = process.env.EXCHANGE_API_URL;
     }

     async getExchangeRate() {
       const response = await axios.get(`${this.apiUrl}/v1/ticker/inr-usdt`);
       return response.data.rate;
     }

     async convertINRtoUSDT(inrAmount) {
       const rate = await this.getExchangeRate();
       return inrAmount / rate;
     }

     async convertUSDTtoINR(usdtAmount) {
       const rate = await this.getExchangeRate();
       return usdtAmount * rate;
     }
   }

   module.exports = new ExchangeService();
   ```

### 2. Implement Payment Processing

1. **Create Payment Service**
   ```javascript
   // services/paymentService.js
   const exchangeService = require('./exchangeService');
   const web3 = require('../utils/web3');

   class PaymentService {
     async processPayment(order, inrAmount) {
       try {
         // Convert INR to USDT
         const usdtAmount = await exchangeService.convertINRtoUSDT(inrAmount);

         // Update order with USDT amount
         order.usdtAmount = usdtAmount;
         await order.save();

         // Return payment details
         return {
           inrAmount,
           usdtAmount,
           exchangeRate: inrAmount / usdtAmount
         };
       } catch (error) {
         throw new Error(`Payment processing failed: ${error.message}`);
       }
     }

     async releasePayment(order) {
       try {
         // Convert USDT back to INR
         const inrAmount = await exchangeService.convertUSDTtoINR(order.usdtAmount);

         // Process blockchain transaction
         await web3.contract.methods.completeOrder(order.blockchainOrderId)
           .send({ from: process.env.ADMIN_WALLET_ADDRESS });

         // Update order status
         order.status = 'completed';
         order.completedAt = new Date();
         await order.save();

         return {
           inrAmount,
           usdtAmount: order.usdtAmount,
           exchangeRate: inrAmount / order.usdtAmount
         };
       } catch (error) {
         throw new Error(`Payment release failed: ${error.message}`);
       }
     }
   }

   module.exports = new PaymentService();
   ```

### 3. Update Order Controller

1. **Integrate Payment Processing**
   ```javascript
   // controllers/orderController.js
   const paymentService = require('../services/paymentService');

   const fundOrder = async (req, res) => {
     try {
       const { orderId, inrAmount } = req.body;
       const order = await Order.findById(orderId);

       // Process payment
       const payment = await paymentService.processPayment(order, inrAmount);

       res.json({
         success: true,
         payment,
         order: order._id
       });
     } catch (error) {
       res.status(400).json({ message: error.message });
     }
   };
   ```

### 4. Security Measures

1. **Implement Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');

   const exchangeRateLimit = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });

   app.use('/api/exchange', exchangeRateLimit);
   ```

2. **Add Request Validation**
   ```javascript
   const validatePayment = (req, res, next) => {
     const { inrAmount } = req.body;
     if (!inrAmount || inrAmount <= 0) {
       return res.status(400).json({ message: 'Invalid payment amount' });
     }
     next();
   };
   ```

## Testing

### 1. Unit Tests
```javascript
// tests/payment.test.js
describe('Payment Service', () => {
  it('should convert INR to USDT correctly', async () => {
    const inrAmount = 10000;
    const payment = await paymentService.processPayment(mockOrder, inrAmount);
    expect(payment.usdtAmount).toBeGreaterThan(0);
  });
});
```

### 2. Integration Tests
```javascript
describe('Payment Flow', () => {
  it('should complete full payment cycle', async () => {
    // Create order
    const order = await createTestOrder();

    // Fund order
    await fundOrder(order.id, 10000);

    // Complete order
    const result = await completeOrder(order.id);
    expect(result.status).toBe('completed');
  });
});
```

## Error Handling

1. **Handle Exchange API Errors**
   - Implement retry mechanism
   - Log failed requests
   - Notify admin on critical failures

2. **Handle Blockchain Errors**
   - Monitor gas prices
   - Implement transaction retry
   - Handle network congestion

## Monitoring

1. **Exchange Rate Monitoring**
   - Track rate fluctuations
   - Set up alerts for significant changes
   - Log all conversions

2. **Transaction Monitoring**
   - Track success/failure rates
   - Monitor processing times
   - Alert on unusual patterns

## Troubleshooting

### Common Issues

1. **Exchange API Issues**
   - Check API credentials
   - Verify rate limits
   - Monitor API status

2. **Payment Processing Failures**
   - Check exchange rate validity
   - Verify blockchain network status
   - Check gas prices and wallet balance

### Support

- Exchange API Documentation
- Blockchain Network Status
- System Logs and Monitoring Dashboard