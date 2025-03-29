# Peer-to-Peer Escrow Management System

This project implements a secure escrow system for agricultural bulk orders between buyers and farmers, utilizing blockchain technology for transparency and security.

## Workflow Overview

1. **Order Placement**: Buyers place bulk orders to farmers through the platform
2. **Fund Transfer to Escrow**: Buyers transfer INR funds to the escrow account
3. **Conversion to USDT**: The system converts INR to USDT and places it on the blockchain
4. **Contract Execution**: Farmers fulfill the order as per contract terms
5. **Verification**: System/validators verify the contract fulfillment
6. **Fund Release**: Upon verification, USDT is converted back to INR
7. **Payment to Farmers**: INR is transferred to farmers' accounts

## Project Structure

```
├── contracts/            # Smart contracts for the escrow system
├── backend/             # Backend API and business logic
│   ├── models/          # Data models
│   ├── services/        # Business logic services
│   ├── controllers/     # API controllers
│   └── utils/           # Utility functions
├── frontend/            # User interface
├── blockchain/          # Blockchain integration components
│   ├── wallet/          # Wallet management
│   └── exchange/        # Cryptocurrency exchange integration
└── docs/                # Documentation
```

## Technology Stack

- **Blockchain**: Ethereum/Solidity for smart contracts
- **Backend**: Node.js with Express
- **Database**: MongoDB for data persistence
- **Frontend**: React.js for user interface
- **Authentication**: JWT for secure authentication
- **Cryptocurrency**: USDT integration

## Development Roadmap

1. **Phase 1**: Core escrow smart contract development
2. **Phase 2**: Backend API and blockchain integration
3. **Phase 3**: Frontend development
4. **Phase 4**: Testing and security audits
5. **Phase 5**: Deployment and monitoring