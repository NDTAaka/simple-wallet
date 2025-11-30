# Setup Checklist - Simple Wallet with Smart Contract

## ✅ Frontend Setup (Complete)

- [x] `index.html` - UI with wallet, send ETH, and smart contract sections
- [x] `src/app.js` - Core logic with contract integration functions
- [x] `styles.css` - Custom glassmorphism styling
- [x] `src/abi/SimpleBank.json` - Contract ABI ready to use

## 🔄 Smart Contract Setup (TODO)

### Step 1: Deploy Contract
- [ ] Open `DEPLOY_GUIDE.md` for detailed Remix IDE instructions
- [ ] Deploy `contracts/SimpleBank.sol` to **Sepolia testnet**
- [ ] Copy contract address from Remix deployment confirmation
- [ ] Example address: `0x1234567890abcdef...` (your deployed address will be different)

### Step 2: Update App Configuration
- [ ] Open `src/app.js` (line ~6)
- [ ] Find: `const SIMPLE_BANK_ADDRESS = '';`
- [ ] Replace empty string with your deployed contract address
- [ ] **IMPORTANT**: Keep the hex format with `0x` prefix, e.g., `const SIMPLE_BANK_ADDRESS = '0x1234567890abcdef...';`
- [ ] Save the file

### Step 3: Verify Integration
- [ ] Open `index.html` in your browser
- [ ] Connect wallet (MetaMask should still be on Sepolia)
- [ ] Look for section: "Smart Contract - Nạp/Rút ETH"
- [ ] If status shows "✓ Đã cấu hình" → Contract is successfully configured
- [ ] If status shows "✗ Chưa cấu hình" → Re-check the contract address in `app.js`

## 🧪 Testing

### Test Deposit
1. Ensure you have testnet ETH in wallet
2. Click on "Nạp ETH vào contract" section
3. Enter amount (e.g., `0.01`)
4. Click "Deposit"
5. Confirm transaction in MetaMask
6. Check contract balance updates

### Test Withdraw
1. Ensure you have balance in the contract (from previous deposit)
2. Click on "Rút ETH từ contract" section
3. Enter amount to withdraw
4. Click "Withdraw"
5. Confirm transaction in MetaMask
6. Verify ETH returns to your wallet

### Verify on Etherscan
- Click tx hash link in "Tx hash" field
- Should open transaction on [Sepolia Etherscan](https://sepolia.etherscan.io)
- For contract interactions, you can also view contract on Etherscan using your contract address

## 📋 Quick Reference

| Item | Location | Purpose |
|------|----------|---------|
| Contract Address to Update | `src/app.js` line ~6 | Enable smart contract features |
| ABI File | `src/abi/SimpleBank.json` | Already prepared, no action needed |
| Contract Source | `contracts/SimpleBank.sol` | Deploy this to Sepolia |
| Deployment Guide | `DEPLOY_GUIDE.md` | Follow for Remix IDE steps |
| Frontend UI | `index.html` | Automatically loads contract ABI |

## ⚠️ Troubleshooting

### "✗ Chưa cấu hình" appears after updating address
- [ ] Verify address format: should start with `0x` and be 42 characters total
- [ ] Reload page (Ctrl+R or Cmd+R)
- [ ] Check browser console (F12) for any error messages
- [ ] Ensure MetaMask is still connected to Sepolia

### Deposit/Withdraw buttons are disabled
- [ ] Contract address not set correctly in `app.js`
- [ ] ABI file not loading - check `src/abi/SimpleBank.json` exists
- [ ] Check browser console for errors (F12 → Console tab)

### "Insufficient balance" error on deposit
- [ ] Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com)
- [ ] Wait for transaction to confirm
- [ ] Try smaller amount

### Transaction fails after "Waiting for confirmation"
- [ ] Check tx hash on [Sepolia Etherscan](https://sepolia.etherscan.io)
- [ ] Look for revert reason in "Internal Txns" tab
- [ ] Common: insufficient balance in contract for withdrawal

## 📞 Support Resources

- **Remix IDE**: https://remix.ethereum.org
- **Sepolia Faucet**: https://sepoliafaucet.com
- **Etherscan**: https://sepolia.etherscan.io
- **ethers.js Docs**: https://docs.ethers.org
- **Solidity Docs**: https://docs.soliditylang.org

---

**Status**: Waiting for contract deployment to Sepolia testnet
**Next Action**: Follow DEPLOY_GUIDE.md to deploy SimpleBank.sol
