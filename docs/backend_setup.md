# Backend Development Guide

## Prerequisites

1. **Node.js and npm**
   - Node.js LTS version installed
   - npm (comes with Node.js)

## Project Setup

### 1. Initialize Backend
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### 2. Environment Configuration
1. Create `.env` file:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/escrow-p2p
   JWT_SECRET=your_secure_secret_key
   BLOCKCHAIN_PROVIDER=http://localhost:7545
   CONTRACT_ADDRESS=your_deployed_contract_address
   ```

## Implementation Steps

### 1. Database Models

1. **User Model (models/User.js)**
   ```javascript
   const mongoose = require('mongoose');
   const bcrypt = require('bcryptjs');

   const userSchema = mongoose.Schema({
     name: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true },
     role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
     walletAddress: { type: String, default: '' },
     bankDetails: {
       accountNumber: String,
       bankName: String,
       ifscCode: String
     }
   });

   userSchema.pre('save', async function(next) {
     if (!this.isModified('password')) return next();
     this.password = await bcrypt.hash(this.password, 10);
   });

   module.exports = mongoose.model('User', userSchema);
   ```

2. **Order Model (models/Order.js)**
   ```javascript
   const mongoose = require('mongoose');

   const orderSchema = mongoose.Schema({
     buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     amount: { type: Number, required: true },
     status: {
       type: String,
       enum: ['created', 'funded', 'inProgress', 'completed', 'disputed', 'refunded'],
       default: 'created'
     },
     blockchainOrderId: { type: Number },
     details: { type: String },
     createdAt: { type: Date, default: Date.now },
     completedAt: { type: Date }
   });

   module.exports = mongoose.model('Order', orderSchema);
   ```

### 2. Authentication Middleware

1. **JWT Authentication (middleware/authMiddleware.js)**
   ```javascript
   const jwt = require('jsonwebtoken');
   const User = require('../models/User');

   const protect = async (req, res, next) => {
     try {
       const token = req.headers.authorization?.split(' ')[1];
       if (!token) return res.status(401).json({ message: 'Not authorized' });

       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = await User.findById(decoded.id).select('-password');
       next();
     } catch (error) {
       res.status(401).json({ message: 'Token invalid' });
     }
   };

   module.exports = { protect };
   ```

### 3. API Routes

1. **User Routes (routes/userRoutes.js)**
   ```javascript
   const express = require('express');
   const { protect } = require('../middleware/authMiddleware');
   const {
     registerUser,
     loginUser,
     getUserProfile
   } = require('../controllers/userController');

   const router = express.Router();

   router.post('/', registerUser);
   router.post('/login', loginUser);
   router.get('/profile', protect, getUserProfile);

   module.exports = router;
   ```

2. **Order Routes (routes/orderRoutes.js)**
   ```javascript
   const express = require('express');
   const { protect } = require('../middleware/authMiddleware');
   const {
     createOrder,
     getOrders,
     getOrderById,
     updateOrderStatus
   } = require('../controllers/orderController');

   const router = express.Router();

   router.post('/', protect, createOrder);
   router.get('/', protect, getOrders);
   router.get('/:id', protect, getOrderById);
   router.put('/:id/status', protect, updateOrderStatus);

   module.exports = router;
   ```

### 4. Blockchain Integration

1. **Contract ABI Setup (utils/contractABI.js)**
   ```javascript
   const contractABI = require('../contracts/build/contracts/EscrowContract.json');
   module.exports = contractABI.abi;
   ```

2. **Web3 Setup (utils/web3.js)**
   ```javascript
   const Web3 = require('web3');
   const contractABI = require('./contractABI');

   const web3 = new Web3(process.env.BLOCKCHAIN_PROVIDER);
   const contract = new web3.eth.Contract(
     contractABI,
     process.env.CONTRACT_ADDRESS
   );

   module.exports = { web3, contract };
   ```

## Testing

### 1. API Testing
1. Install testing dependencies:
   ```bash
   npm install --save-dev jest supertest
   ```

2. Run tests:
   ```bash
   npm test
   ```

## Deployment

### 1. Production Setup
1. Update environment variables for production
2. Configure MongoDB Atlas connection
3. Set up proper error logging

### 2. Security Measures
1. Implement rate limiting
2. Set up CORS properly
3. Use helmet for security headers
4. Validate all inputs
5. Implement proper error handling

## Best Practices

1. **Code Organization**
   - Follow MVC pattern
   - Keep controllers thin
   - Use service layer for business logic

2. **Error Handling**
   - Create custom error classes
   - Implement global error handler
   - Log errors properly

3. **Performance**
   - Implement caching
   - Optimize database queries
   - Use proper indexes

## Troubleshooting

### Common Issues

1. **Database Connection**
   - Check MongoDB connection string
   - Verify network connectivity
   - Check database user permissions

2. **Authentication**
   - Verify JWT secret
   - Check token expiration
   - Validate user credentials

3. **Blockchain Integration**
   - Check Web3 provider connection
   - Verify contract address
   - Monitor gas prices

### Getting Help

- Express Documentation: https://expressjs.com/
- Mongoose Documentation: https://mongoosejs.com/
- Web3.js Documentation: https://web3js.readthedocs.io/