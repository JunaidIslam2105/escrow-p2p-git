# Local Blockchain Setup Guide

## Prerequisites

1. **Node.js and npm**
   - Install Node.js LTS version from https://nodejs.org
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

## Ganache Setup

### 1. Install Ganache
1. Download Ganache from https://trufflesuite.com/ganache
2. Run the installer
3. Launch Ganache
4. Create a new Workspace:
   - Click "New Workspace"
   - Name it "escrow-p2p"
   - Under "Server" tab, note the RPC Server address (default: HTTP://127.0.0.1:7545)
   - Save workspace

### 2. Configure Network Settings
1. Note down important details:
   - Network ID: 5777 (default)
   - RPC Server: HTTP://127.0.0.1:7545
   - Available test accounts and their private keys

## Smart Contract Development Environment

### 1. Install Truffle
```bash
npm install -g truffle
```

### 2. Configure Truffle
1. Create truffle-config.js in the project root:
```javascript
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    }
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};
```

## Deploy Smart Contract

### 1. Compile Contract
```bash
truffle compile
```

### 2. Create Migration Script
1. Create `migrations/1_deploy_escrow.js`:
```javascript
const EscrowContract = artifacts.require("EscrowContract");

module.exports = function(deployer) {
  deployer.deploy(EscrowContract);
};
```

### 3. Deploy Contract
```bash
truffle migrate --network development
```

### 4. Verify Deployment
1. Note the contract address from migration output
2. Update `.env` file with contract address:
```
CONTRACT_ADDRESS=your_deployed_contract_address
BLOCKCHAIN_PROVIDER=http://127.0.0.1:7545
```

## Testing Smart Contract

### 1. Create Test File
1. Create `test/EscrowContract.test.js`:
```javascript
const EscrowContract = artifacts.require("EscrowContract");

contract("EscrowContract", accounts => {
  let escrowContract;
  const buyer = accounts[1];
  const seller = accounts[2];

  beforeEach(async () => {
    escrowContract = await EscrowContract.new();
  });

  it("should create a new order", async () => {
    const result = await escrowContract.createOrder(seller, "Test Order", { from: buyer });
    assert.equal(result.logs[0].event, "OrderCreated");
  });
});
```

### 2. Run Tests
```bash
truffle test
```

## Troubleshooting

### Common Issues

1. **Ganache Connection**
   - Verify Ganache is running
   - Check if the port (7545) is available
   - Confirm network ID matches

2. **Contract Deployment**
   - Ensure sufficient test ETH in deployment account
   - Check compiler version compatibility
   - Verify migration scripts

3. **Contract Interaction**
   - Confirm ABI is correctly imported
   - Verify contract address is correct
   - Check account has sufficient gas

### Getting Help

- Truffle Documentation: https://trufflesuite.com/docs/truffle/
- Ganache Documentation: https://trufflesuite.com/docs/ganache/
- Solidity Documentation: https://docs.soliditylang.org/
- Web3.js Documentation: https://web3js.readthedocs.io/