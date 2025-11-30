# Smart Contract Integration - Complete Documentation

## Overview

Your Simple Wallet application now includes **Smart Contract integration** with the `SimpleBank.sol` contract. This allows users to:

1. **Deposit ETH** into a smart contract (funds stored on-chain)
2. **Withdraw ETH** from the contract (retrieve previously deposited funds)
3. **Track balance** on the smart contract (separate from wallet balance)

## Architecture

### Frontend Components

#### 1. **app.js** - Core Logic
Located: `src/app.js`

**New Global Variables:**
```javascript
const SIMPLE_BANK_ADDRESS = ''; // TODO: Update with deployed address
let simpleBankContract = null;   // Contract instance
let simpleBankABI = null;        // Contract ABI
```

**New Functions:**
| Function | Purpose | Input | Returns |
|----------|---------|-------|---------|
| `loadSmartContractABI()` | Loads ABI from `src/abi/SimpleBank.json` | - | - |
| `initializeSmartContract()` | Creates contract instance | - | - |
| `getContractBalance()` | Fetches user's balance on contract | - | `{number}` ETH balance or `null` |
| `depositToContract(amount)` | Sends ETH to contract | `{string}` amount in ETH | `{string}` tx hash or `null` |
| `withdrawFromContract(amount)` | Withdraws ETH from contract | `{string}` amount in ETH | `{string}` tx hash or `null` |
| `updateContractUI()` | Updates contract status display | - | - |
| `refreshContractBalance()` | Fetches and displays contract balance | - | - |
| `handleDepositClick(event)` | Form submit handler for deposits | `{Event}` | - |
| `handleWithdrawClick(event)` | Form submit handler for withdrawals | `{Event}` | - |

#### 2. **HTML UI** - Contract Section
Located: `index.html` (lines ~113-170)

**New Section: "Smart Contract - Nạp/Rút ETH"**
- Contract Status display (✓ Đã cấu hình / ✗ Chưa cấu hình)
- Current contract balance display
- Contract address display
- Deposit form (amount input + button)
- Withdraw form (amount input + button)
- Error message areas for form validation

#### 3. **ABI File** - Contract Interface
Located: `src/abi/SimpleBank.json`

Provides the smart contract interface to ethers.js. Includes:
- Function definitions: `deposit()`, `withdraw()`, `getBalance()`, etc.
- Event definitions: `Deposit`, `Withdraw`, `BalanceQueried`
- State variable getters: `balances`, `totalBalance`, `userCount`

### Backend Smart Contract

#### SimpleBank.sol
Located: `contracts/SimpleBank.sol`

**Key Features:**
- **Deposit Function**: `deposit()` - deposits ETH, stores balance in mapping
- **Withdraw Function**: `withdraw(uint256 amount)` - withdraws funds, uses safe call pattern
- **Query Functions**: `getBalance()`, `getMyBalance()`, `getTotalBalance()`
- **Events**: Logs all deposits, withdrawals, and balance queries
- **Storage**: Per-address balance mapping, tracks total and user count

## Deployment Workflow

### Phase 1: Deploy Contract to Blockchain
**Tools**: Remix IDE + MetaMask

1. Go to https://remix.ethereum.org
2. Create file `SimpleBank.sol`
3. Copy code from `contracts/SimpleBank.sol`
4. Set Compiler to `0.8.0` or higher
5. Deploy to Sepolia testnet via MetaMask
6. **SAVE CONTRACT ADDRESS** (e.g., `0x1234...`)

See `DEPLOY_GUIDE.md` for detailed step-by-step instructions.

### Phase 2: Configure Frontend
**Files to Update**: `src/app.js`

1. Open `src/app.js`
2. Find line ~6: `const SIMPLE_BANK_ADDRESS = '';`
3. Replace with your deployed address:
   ```javascript
   const SIMPLE_BANK_ADDRESS = '0x<your-address-here>';
   ```
4. Save the file

### Phase 3: Verify Integration
**Files Involved**: `index.html`, `src/app.js`

1. Reload `index.html` in browser
2. Connect wallet (if not already connected)
3. Look for section: "Smart Contract - Nạp/Rút ETH"
4. Check status indicator:
   - ✓ "Đã cấu hình" (green) = Ready to use
   - ✗ "Chưa cấu hình" (red) = Address not set or ABI missing

## Data Flow

### Deposit Flow
```
User Input (amount)
    ↓
handleDepositClick() validates input
    ↓
Checks wallet balance (must have enough ETH)
    ↓
Creates contract instance with signer
    ↓
Calls contract.deposit({ value: amountWei })
    ↓
MetaMask popup (user approves)
    ↓
Transaction broadcast to Sepolia
    ↓
Wait for confirmation (tx.wait())
    ↓
Update UI: balance, history, status
    ↓
Save to LocalStorage history
```

### Withdrawal Flow
```
User Input (amount)
    ↓
handleWithdrawClick() validates input
    ↓
Checks contract balance (must have amount deposited)
    ↓
Creates contract instance with signer
    ↓
Calls contract.withdraw(amountWei)
    ↓
MetaMask popup (user approves)
    ↓
Transaction broadcast to Sepolia
    ↓
Wait for confirmation (tx.wait())
    ↓
Update UI: balance, history, status
    ↓
Save to LocalStorage history
```

## State Management

### Global State (in app.js)
```javascript
const state = {
  // Existing
  provider: BrowserProvider,
  signer: Signer,
  account: '0x...',
  balanceEth: 0.5,
  
  // Smart contract state managed via functions
  // (no additional state variables needed)
};
```

### Contract Instance
```javascript
simpleBankContract = new ethers.Contract(
  SIMPLE_BANK_ADDRESS,
  simpleBankABI,
  state.provider
);
```

## Error Handling

### Validation Errors
- Amount must be > 0
- Insufficient wallet balance (for deposits)
- Insufficient contract balance (for withdrawals)
- Invalid contract address
- ABI file missing

### Transaction Errors
- User rejects MetaMask popup
- Network timeout
- Contract revert (e.g., "Insufficient balance")
- RPC errors

**Error Display**: Both deposit and withdraw forms have `<p id="depositError">` and `<p id="withdrawError">` elements that display user-friendly error messages.

## Testing Checklist

### Unit Tests
- [ ] `loadSmartContractABI()` loads ABI correctly
- [ ] `initializeSmartContract()` creates contract instance
- [ ] `getContractBalance()` returns correct balance
- [ ] `updateContractUI()` shows correct status

### Integration Tests
- [ ] Deposit transaction confirmed on Etherscan
- [ ] Contract balance increases after deposit
- [ ] Wallet balance decreases by amount + gas
- [ ] Withdrawal transaction confirmed on Etherscan
- [ ] Contract balance decreases after withdrawal
- [ ] Wallet balance increases after withdrawal
- [ ] History logs both deposit and withdraw transactions

### User Experience Tests
- [ ] "Smart Contract" section appears when wallet connected
- [ ] Error messages display for invalid inputs
- [ ] Loading states show during transaction
- [ ] Success messages display after confirmation
- [ ] QR code and address buttons still work
- [ ] Dark/Light mode toggle works
- [ ] History export includes contract transactions

## Security Considerations

### Frontend Security
- ✓ Input validation (amounts, addresses)
- ✓ No sensitive data stored (private keys)
- ✓ Signer comes from MetaMask (not embedded)
- ✓ Contract interaction via ethers.js (audited library)

### Smart Contract Security
- ✓ Reentrancy-safe (uses call with checks)
- ✓ Balance checks before withdrawal
- ✓ User mapping prevents cross-account transfers
- ✓ Events logged for all transactions

### Runtime Security
- ✓ MetaMask sandboxed and user-controlled
- ✓ Contract address immutable (no upgrades)
- ✓ Testnet only (no real funds at risk)

## Configuration Reference

### Required Configuration
```javascript
// src/app.js, line ~6
const SIMPLE_BANK_ADDRESS = '0x...'; // 42 character hex address
```

### Optional Configuration
```javascript
// Modify timeout values if needed (milliseconds)
const ETH_INJECTION_TIMEOUT = 4_000;
const PRICE_REFRESH_MS = 60_000;
```

## Troubleshooting

### Contract not appearing in UI
**Symptoms**: "✗ Chưa cấu hình" status
**Solutions**:
- Verify `SIMPLE_BANK_ADDRESS` is set in `app.js`
- Check address format: `0x` + 40 hex characters
- Ensure `src/abi/SimpleBank.json` exists
- Open browser DevTools (F12) → Console for errors

### Deposit/Withdraw fails
**Symptoms**: Transaction hangs or reverts
**Solutions**:
- Check wallet has ETH (including gas)
- Ensure you're on Sepolia testnet
- Check contract has been deployed to Sepolia
- View tx hash on Etherscan for revert reason

### Balance doesn't update
**Symptoms**: Contract balance shows "—"
**Solutions**:
- Click "Refresh" button under contract balance
- Check RPC connection (visible in network info)
- Ensure contract exists at configured address
- Wait for transaction confirmation

## Advanced Topics

### Extending the Contract
To add features like:
- Transfer between users
- Interest calculation
- Multiple token support
- Access control (owner only)

Modify `contracts/SimpleBank.sol` and redeploy.

### Alternative Deployment Methods
- **Hardhat**: Local development + testing
- **Truffle**: Legacy but stable
- **Foundry**: Rust-based, faster
- **Tenderly**: Simulation + debugging

### Mainnet Deployment (Future)
1. Get real ETH for gas
2. Deploy to mainnet RPC endpoint
3. Update frontend to use mainnet addresses
4. Consider security audit before using real funds

## File Summary

| File | Purpose | Status |
|------|---------|--------|
| `index.html` | UI with contract forms | ✅ Complete |
| `src/app.js` | Contract logic | ✅ Complete |
| `src/abi/SimpleBank.json` | Contract ABI | ✅ Complete |
| `contracts/SimpleBank.sol` | Smart contract source | ✅ Complete |
| `DEPLOY_GUIDE.md` | Deployment instructions | ✅ Complete |
| `SETUP_CHECKLIST.md` | Configuration checklist | ✅ Complete |
| `README.md` | Project documentation | ✅ Updated |

## Next Steps

1. **Deploy Contract** → Follow `DEPLOY_GUIDE.md`
2. **Update Address** → Set `SIMPLE_BANK_ADDRESS` in `app.js`
3. **Test Deposit** → Send ETH to contract
4. **Test Withdraw** → Get ETH back
5. **Verify History** → Check transaction logs

---

**Last Updated**: Smart Contract Integration Complete
**Contract Network**: Sepolia Testnet (11155111)
**Ready for**: User testing and deployment
