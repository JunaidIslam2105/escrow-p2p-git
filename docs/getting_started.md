# Getting Started Guide

## Initial Setup

### Step 1: Install Required Software
1. **Node.js and npm**
   - Download and install Node.js LTS from https://nodejs.org
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **MongoDB**
   - Download MongoDB Community Server
   - Install and start MongoDB service
   - Install MongoDB Compass (GUI tool)

3. **Development Tools**
   - Install Truffle and Ganache:
     ```bash
     npm install -g truffle
     ```
   - Download and install Ganache from https://trufflesuite.com/ganache

### Step 2: Clone and Setup Project
1. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   Create `.env` file in backend directory:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/escrow-p2p
   JWT_SECRET=your_secure_secret_key
   BLOCKCHAIN_PROVIDER=http://localhost:7545
   CONTRACT_ADDRESS=your_deployed_contract_address
   EXCHANGE_API_KEY=your_exchange_api_key
   EXCHANGE_API_SECRET=your_exchange_api_secret
   ```

### Step 3: Database Setup
1. Start MongoDB service
2. Open MongoDB Compass
3. Connect to `mongodb://localhost:27017`
4. Create database `escrow-p2p`
5. Create collections: `users` and `orders`

### Step 4: Smart Contract Deployment
1. **Start Local Blockchain**
   - Open Ganache
   - Create new workspace
   - Note down RPC Server URL (usually http://127.0.0.1:7545)

2. **Deploy Contract**
   ```bash
   cd contracts
   truffle compile
   truffle migrate --network development
   ```
   - Note down deployed contract address
   - Update CONTRACT_ADDRESS in `.env`

### Step 5: Frontend Setup
1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Frontend Environment**
   Create `.env` file in frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_BLOCKCHAIN_PROVIDER=http://localhost:7545
   REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address
   ```

## Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```

## Testing the Setup

1. **Create Test Accounts**
   - Register a buyer account
   - Register a seller account
   - Connect MetaMask to local network

2. **Test Basic Flow**
   - Create an order
   - Fund the order
   - Complete the transaction

## Common Issues and Solutions

1. **MongoDB Connection Error**
   - Verify MongoDB service is running
   - Check MONGO_URI in .env
   - Ensure database and collections exist

2. **Smart Contract Deployment Issues**
   - Confirm Ganache is running
   - Check network configuration in truffle-config.js
   - Ensure sufficient test ETH in deployment account

3. **Frontend Connection Issues**
   - Verify backend server is running
   - Check REACT_APP_API_URL in frontend .env
   - Confirm CONTRACT_ADDRESS is correct

## Next Steps

1. Review detailed documentation in `/docs` folder
2. Explore the smart contract functionality
3. Test the payment processing system
4. Implement additional security measures