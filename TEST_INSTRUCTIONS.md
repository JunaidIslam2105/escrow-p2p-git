# P2P Escrow System Testing Instructions

This document provides comprehensive instructions for testing the P2P Escrow System. Follow these steps to set up the testing environment and verify the functionality of the entire system.

## Prerequisites

Before starting the testing process, ensure you have the following installed:

- Node.js (LTS version) and npm
- Ganache (local blockchain environment)
- Truffle (smart contract development framework)
- MongoDB (for backend database) or PostgreSQL (depending on your configuration)
- MetaMask browser extension (for wallet interaction)

## Phase 1: Setting Up the Testing Environment

### 1. Local Blockchain Setup (Ganache)

1. Download and install Ganache from https://trufflesuite.com/ganache
2. Launch Ganache and create a new workspace:
   ```
   - Click "New Workspace"
   - Name it "escrow-p2p"
   - Under "Server" tab, note the RPC Server address (default: HTTP://127.0.0.1:7545)
   - Save workspace
   ```
3. Note down important details:
   - Network ID: 5777 (default)
   - Available test accounts and their private keys
   - Admin account private key (for backend operations)
4. Test blockchain connection:
   - Verify that Ganache is running and accessible
   - Test the fallback mechanism by temporarily stopping Ganache
   - Verify that the system falls back to local order ID generation

### 2. Smart Contract Deployment

1. Open a terminal and navigate to the project root directory:
   ```bash
   cd path/to/escrow-P2P
   ```

2. Install Truffle globally if not already installed:
   ```bash
   npm install -g truffle
   ```

3. Compile the smart contract:
   ```bash
   truffle compile
   ```

4. Deploy the contract to the local Ganache network:
   ```bash
   truffle migrate --network development
   ```

5. Note down the deployed contract address from the migration output. You'll need this for configuring the backend.

### 3. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following configuration:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/escrow-p2p
   JWT_SECRET=your_secure_secret_key_for_testing
   BLOCKCHAIN_PROVIDER=http://localhost:7545
   CONTRACT_ADDRESS=your_deployed_contract_address
   PRIVATE_KEY=your_admin_wallet_private_key
   EXCHANGE_API_KEY=your_exchange_api_key
   EXCHANGE_API_SECRET=your_exchange_api_secret
   EXCHANGE_API_URL=https://api.exchange.com
   ```
   Replace the following:
   - `your_deployed_contract_address` with the address noted in step 2.5
   - `your_admin_wallet_private_key` with the private key of the admin wallet from Ganache
   - `your_exchange_api_key` and related values with your exchange API credentials

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server should start on port 5000.

### 4. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following configuration:
   ```
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_BLOCKCHAIN_PROVIDER=http://localhost:7545
   REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address
   ```
   Replace `your_deployed_contract_address` with the address noted in step 2.5.

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend should be accessible at http://localhost:5173 (or the port specified in the console output).

## Phase 2: Testing the System

### 1. MetaMask Configuration

1. Install MetaMask browser extension if not already installed
2. Configure MetaMask to connect to your local Ganache network:
   ```
   - Click on the network dropdown in MetaMask
   - Select "Add Network"
   - Network Name: Ganache Local
   - New RPC URL: http://localhost:7545 (or your Ganache RPC URL)
   - Chain ID: 5777
   - Currency Symbol: ETH
   - Save
   ```
3. Import at least two Ganache accounts into MetaMask using their private keys:
   - One account for the buyer
   - One account for the seller

### 2. User Registration and Authentication

1. Open the frontend application in your browser
2. Register two user accounts:
   - Buyer account (select role as "buyer")
   - Seller account (select role as "seller")
3. Connect each account with the corresponding MetaMask wallet address
4. Verify that you can log in with both accounts

### 3. Order Creation and Funding (Buyer Flow)

1. Log in with the buyer account
2. Create a new order:
   - Select the seller from the available sellers
   - Enter order details
   - Specify the amount in INR
   - Submit the order
3. Verify that:
   - The order appears in the buyer's dashboard with "Created" status
   - The INR amount is correctly converted to USDT using the current exchange rate
   - The blockchain transaction hash is recorded
4. Fund the order:
   - Click on the "Fund" button for the created order
   - Confirm the USDT amount in MetaMask matches the converted amount
   - Confirm the transaction in MetaMask
   - Wait for the transaction to be mined
5. Verify that:
   - The order status changes to "Funded"
   - The blockchain transaction is successful
   - The correct USDT amount is locked in the smart contract

### 4. Order Processing (Seller Flow)

1. Log out from the buyer account and log in with the seller account
2. Verify that the funded order appears in the seller's dashboard
3. Start the order processing:
   - Click on the "Start" button for the funded order
   - Confirm the transaction in MetaMask
   - Wait for the transaction to be mined
4. Verify that the order status changes to "In Progress"

### 5. Order Completion (Buyer Flow)

1. Log out from the seller account and log in with the buyer account
2. Verify that the order status is "In Progress"
3. Complete the order:
   - Click on the "Complete" button for the in-progress order
   - Confirm the transaction in MetaMask
   - Wait for the transaction to be mined
4. Verify that the order status changes to "Completed"
5. Verify that the funds have been transferred to the seller's wallet

### 6. Testing Dispute Resolution

1. Create and fund a new order as the buyer
2. Start the order as the seller
3. Raise a dispute:
   - As either the buyer or seller, click on the "Dispute" button
   - Confirm the transaction in MetaMask
   - Wait for the transaction to be mined
4. Verify that the order status changes to "Disputed"
5. Process a refund:
   - As the seller, click on the "Refund" button
   - Confirm the transaction in MetaMask
   - Wait for the transaction to be mined
6. Verify that the order status changes to "Refunded"
7. Verify that the funds have been returned to the buyer's wallet

## Phase 3: Advanced Testing Scenarios

### 1. Error Handling and Currency Exchange

1. Try to fund an order with insufficient USDT balance
2. Try to start an order that is not funded
3. Try to complete an order that is not in progress
4. Try to dispute a completed order
5. Verify currency conversion edge cases:
   - Test with very small INR amounts (check minimum limits)
   - Test with large INR amounts (check maximum limits)
   - Verify exchange rate updates are reflected correctly
6. Test blockchain-specific scenarios:
   - Attempt transactions when blockchain connection is disabled
   - Verify fallback to local order ID generation
   - Test handling of failed blockchain transactions
7. Verify that appropriate error messages are displayed for all scenarios

### 2. Security Testing

1. Try to fund an order as the seller
2. Try to start an order as the buyer
3. Try to refund an order as the buyer
4. Verify that these operations are rejected with appropriate error messages

### 3. Concurrent Orders

1. Create multiple orders between different buyer-seller pairs
2. Process these orders concurrently
3. Verify that each order's state is maintained correctly

## Troubleshooting

### Common Issues

1. **MetaMask Transaction Errors**
   - Ensure you have sufficient ETH in your account
   - Reset your MetaMask account if transactions are stuck

2. **Contract Deployment Issues**
   - Verify Ganache is running and accessible
   - Check truffle-config.js for correct network settings

3. **Backend Connection Issues**
   - Verify MongoDB/PostgreSQL is running
   - Check .env configuration for correct database URI

4. **Frontend-Backend Integration**
   - Verify API URL in frontend .env file
   - Check browser console for CORS errors

### Resetting the Test Environment

If you need to reset the testing environment:

1. Restart Ganache workspace
2. Redeploy the smart contract
3. Update the contract address in both backend and frontend .env files
4. Restart both backend and frontend servers