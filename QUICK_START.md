# 🚀 Quick Start Guide - Smart Contract Integration

## What You Have

A complete Simple Wallet with smart contract support ready to deploy!

## What You Need to Do

### Step 1: Deploy Smart Contract (10 minutes)
→ Open `DEPLOY_GUIDE.md` and follow the Remix IDE instructions

### Step 2: Update One Line of Code (30 seconds)
→ Edit `src/app.js` line ~6:
```javascript
const SIMPLE_BANK_ADDRESS = '0x<YOUR_DEPLOYED_ADDRESS>';
```

### Step 3: Test It (5 minutes)
→ Open `index.html` and try Deposit/Withdraw

## Files at a Glance

| File | What It Does | Your Action |
|------|-------------|-------------|
| `contracts/SimpleBank.sol` | The smart contract code | Copy to Remix IDE → Deploy |
| `src/app.js` | Frontend logic | Update line 6 with contract address |
| `index.html` | UI with deposit/withdraw forms | No changes needed |
| `src/abi/SimpleBank.json` | Contract interface | Already prepared ✓ |
| `DEPLOY_GUIDE.md` | How to deploy | Follow these steps |
| `SETUP_CHECKLIST.md` | Configuration guide | Reference during setup |

## The Flowchart

```
START: Open DEPLOY_GUIDE.md
  ↓
Deploy SimpleBank.sol to Sepolia in Remix IDE
  ↓ Copy deployed address
Get contract address (e.g., 0x1234...)
  ↓
Edit src/app.js line 6
  ↓ Paste address here
const SIMPLE_BANK_ADDRESS = '0x1234...';
  ↓
Open index.html in browser
  ↓
Connect MetaMask wallet
  ↓
See "Smart Contract - Nạp/Rút ETH" section
  ↓
Status shows ✓ Đã cấu hình?
  ↓ YES              ↓ NO
  ↓                 Check Setup Checklist
Try Deposit        Troubleshooting section
  ↓
Approve MetaMask
  ↓
Watch contract balance update!
  ↓
SUCCESS ✨
```

## Three Easy Sections

### Section 1: Deploy
**File**: `DEPLOY_GUIDE.md`
**Time**: 10-15 minutes
**What you'll get**: Contract address (copy this)

### Section 2: Configure  
**File**: `src/app.js` line 6
**Time**: 30 seconds
**What you'll paste**: The contract address from Section 1

### Section 3: Test
**File**: `index.html`
**Time**: 5 minutes per test
**What you'll do**: Deposit ETH → Withdraw ETH → Check history

## Key Files to Remember

- **When deploying**: Use `contracts/SimpleBank.sol`
- **When configuring**: Edit `src/app.js`
- **When testing**: Open `index.html`
- **When stuck**: Read `SETUP_CHECKLIST.md` → Troubleshooting

## How to Know It's Working

| Check | Status | What to Look For |
|-------|--------|-----------------|
| Contract Deployed | ✓ | Address shows on Remix (42 chars starting with 0x) |
| Address Updated | ✓ | Line 6 of `src/app.js` has your address |
| UI Shows Contract | ✓ | "Smart Contract - Nạp/Rút ETH" section visible |
| Status Indicator | ✓ | Shows "✓ Đã cấu hình" (green) |
| Deposit Works | ✓ | Balance increases, tx appears on Etherscan |
| Withdraw Works | ✓ | Balance decreases, wallet ETH increases |

## Most Important Points

1. **Contract Address Format**: Must start with `0x` and be 42 characters total
   - ✓ `0x1234567890abcdef1234567890abcdef12345678`
   - ✗ `1234567890abcdef1234567890abcdef12345678` (missing 0x)
   - ✗ `0x1234...` (too short)

2. **Network**: Must be on Sepolia testnet
   - Check MetaMask: top-right shows "Sepolia"
   - Contract deployed to Sepolia (not Ethereum, not another network)

3. **Test ETH**: Need ETH in wallet for gas
   - Get from: https://sepoliafaucet.com

4. **File Location**: Update the exact line
   - File: `src/app.js`
   - Line: ~6 (where SIMPLE_BANK_ADDRESS is)
   - Search: "const SIMPLE_BANK_ADDRESS"

## Troubleshooting Quick Links

**Problem**: "✗ Chưa cấu hình" shows in UI
→ See `SETUP_CHECKLIST.md` section "Troubleshooting"

**Problem**: Can't deploy smart contract
→ See `DEPLOY_GUIDE.md` section "Common Issues"

**Problem**: Transaction fails
→ See `SETUP_CHECKLIST.md` section "Transaction fails after 'Waiting for confirmation'"

## File Tree for Reference

```
c:\Blockchainv2\
├── contracts/SimpleBank.sol           ← Deploy this
├── src/app.js                         ← Update line 6
├── src/abi/SimpleBank.json            ← Already ready
├── index.html                         ← Open in browser
├── DEPLOY_GUIDE.md                    ← Follow this first
├── SETUP_CHECKLIST.md                 ← Reference during setup
├── SMART_CONTRACT_INTEGRATION.md      ← For details
├── INTEGRATION_COMPLETE.md            ← For overview
└── README.md                          ← Project info
```

## Time Estimates

| Task | Time | Effort |
|------|------|--------|
| Read this guide | 2 min | 🟢 Very Easy |
| Deploy contract | 10 min | 🟡 Easy |
| Update app.js | 30 sec | 🟢 Very Easy |
| Test deposit | 3 min | 🟢 Very Easy |
| Test withdraw | 3 min | 🟢 Very Easy |
| **Total** | **~20 min** | **🟢 Easy** |

## Next Action

**→ Open `DEPLOY_GUIDE.md` right now and start deploying!**

---

**Questions?** Check `SETUP_CHECKLIST.md` → Troubleshooting
**Need details?** Check `SMART_CONTRACT_INTEGRATION.md`
**Ready to test?** Keep `SETUP_CHECKLIST.md` handy for testing steps
