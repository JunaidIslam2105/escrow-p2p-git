# Frontend Development Guide

## Prerequisites

1. **Node.js and npm**
   - Node.js LTS version installed
   - npm (comes with Node.js)

## Project Setup

### 1. Initialize React Project
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### 2. Configure Environment
1. Create `.env` file in frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_BLOCKCHAIN_PROVIDER=http://localhost:7545
   REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address
   ```

## Implementation Steps

### 1. User Authentication

1. **Login Component**
   - Email/password form
   - JWT token storage
   - Protected route setup

2. **Registration Component**
   - User details form
   - Role selection (buyer/seller)
   - Wallet address integration

### 2. Order Management

1. **Create Order**
   - Order details form
   - Seller selection
   - Amount specification

2. **Order List**
   - Filter by status
   - Sort by date
   - Pagination

3. **Order Details**
   - Status tracking
   - Action buttons based on role
   - Transaction history

### 3. Wallet Integration

1. **Connect Wallet**
   - MetaMask integration
   - Account balance display
   - Network verification

2. **Transaction Management**
   - Fund order
   - Release payment
   - Handle refunds

### 4. User Dashboard

1. **Profile Management**
   - Update user details
   - View transaction history
   - Manage wallet connections

2. **Statistics Display**
   - Order statistics
   - Transaction volume
   - Success rate

## Testing

### 1. Component Testing
```bash
npm test
```

### 2. End-to-End Testing
1. Start backend server
2. Start Ganache
3. Deploy contracts
4. Run frontend tests:
   ```bash
   npm run test:e2e
   ```

## Deployment

### 1. Build Production Version
```bash
npm run build
```

### 2. Serve Production Build
```bash
serve -s build
```

## Best Practices

1. **State Management**
   - Use Redux for global state
   - Implement proper error handling
   - Maintain loading states

2. **Security**
   - Validate all inputs
   - Secure token storage
   - Implement rate limiting

3. **Performance**
   - Lazy load components
   - Optimize images
   - Minimize bundle size

## Troubleshooting

### Common Issues

1. **API Connection**
   - Check API URL in .env
   - Verify CORS settings
   - Check network connectivity

2. **Blockchain Integration**
   - Verify MetaMask connection
   - Check network settings
   - Confirm contract addresses

3. **Build Issues**
   - Clear npm cache
   - Update dependencies
   - Check for conflicting packages

### Getting Help

- React Documentation: https://reactjs.org/docs
- Web3.js Documentation: https://web3js.readthedocs.io/
- MetaMask Documentation: https://docs.metamask.io/
- Redux Documentation: https://redux.js.org/