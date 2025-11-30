# Component API Reference

Quick reference guide for all component methods and their signatures.

## UIComponent

```javascript
// Display colored status message
UIComponent.setStatus(state, elements, message, variant)
// variant: 'success' | 'error' | 'pending' | 'info'

// Toggle between dark and light mode
UIComponent.toggleTheme(state, elements)

// Generate QR code for wallet address
UIComponent.drawQrCode(value, elements)
// value: wallet address string

// Remove QR code from DOM
UIComponent.clearQrCode(elements)
```

## WalletComponent

```javascript
// Initialize wallet provider (call in init())
await WalletComponent.init(state, elements)

// Wait for MetaMask to be injected
WalletComponent.waitForEthereum()

// Handle multiple EVM wallet providers
WalletComponent.resolveInjectedProvider()

// Request account access
await WalletComponent.connectWallet(state, elements)

// Process account info (internal)
await WalletComponent.handleAccount(address, state, elements)

// Get and display balance
await WalletComponent.fetchBalance(state, elements)

// Display balance in USD
WalletComponent.updateBalanceFiat(state, elements)

// Auto-connect + setup event listeners
await WalletComponent.autoConnectIfAuthorized(state, elements)

// Clear UI on disconnect
WalletComponent.resetUI(state, elements)

// Reset analytics displays
WalletComponent.resetAnalytics(state, elements)

// Copy address to clipboard
await WalletComponent.copyAddress(state, elements)
```

## MarketComponent

```javascript
// Fetch ETH/USD price from CoinGecko
await MarketComponent.fetchEthPrice(state, elements)

// Get network name and update gas data
await MarketComponent.refreshNetworkInfo(state, elements)

// Fetch gas prices from provider
await MarketComponent.updateGasData(state, elements)

// Display gas fee in panels
MarketComponent.updateGasPanels(state, elements)

// Convert gas fee to USD
MarketComponent.updateGasUsd(state, elements)
```

## TransactionComponent

```javascript
// Load history from localStorage
TransactionComponent.hydrateHistory(state, elements)

// Save history to localStorage
TransactionComponent.persistHistory(state, elements)

// Validate form inputs
TransactionComponent.validateForm(recipient, amount, state)
// Returns: null if valid, error message string if invalid

// Send ETH transaction
await TransactionComponent.sendTransaction(state, elements, event)

// Update tx status and hash display
TransactionComponent.updateTxInfo(state, elements, status, hash)

// Calculate total cost including gas
TransactionComponent.updateTotalCost(state, elements)

// Add transaction to history
TransactionComponent.pushHistory(state, elements, entry)
// entry: { hash, to, amount, status }

// Render history list in UI
TransactionComponent.renderHistory(state, elements)

// Clear all history
TransactionComponent.clearHistory(state, elements, event)

// Export history as JSON file
TransactionComponent.downloadHistoryFile(state, elements, event)
```

## SmartContractComponent

```javascript
// Load contract ABI from JSON file
await SmartContractComponent.loadSmartContractABI(state, elements, contractAddress)

// Create contract instance
SmartContractComponent.initializeSmartContract(state, elements, contractAddress)

// Get balance from contract
await SmartContractComponent.getContractBalance(state, elements)
// Returns: balance in ETH (number) or null

// Send ETH to contract deposit
await SmartContractComponent.depositToContract(state, elements, amount)
// Returns: tx hash or null

// Withdraw from contract
await SmartContractComponent.withdrawFromContract(state, elements, amount)
// Returns: tx hash or null

// Update UI based on contract status
SmartContractComponent.updateContractUI(state, elements, contractAddress)

// Fetch and display contract balance
await SmartContractComponent.refreshContractBalance(state, elements)

// Handle deposit form submission
await SmartContractComponent.handleDepositClick(state, elements, event)

// Handle withdraw form submission
await SmartContractComponent.handleWithdrawClick(state, elements, event)
```

## Usage Pattern

All component methods follow this pattern:

```javascript
// Import state and elements
const state = { provider, signer, account, ... };
const elements = { connectBtn, walletAddress, ... };

// Call component method
ComponentName.methodName(state, elements, ...args);

// Example:
await WalletComponent.fetchBalance(state, elements);
UIComponent.setStatus(state, elements, 'Connected!', 'success');
```

## Common Workflows

### Connect Wallet

```javascript
await WalletComponent.connectWallet(state, elements);
// Internally calls handleAccount() which:
// - Sets state.account
// - Displays address
// - Fetches balance
// - Loads contract UI
```

### Send Transaction

```javascript
const event = submitEvent;
await TransactionComponent.sendTransaction(state, elements, event);
// Internally:
// - Validates form
// - Sends via MetaMask
// - Updates UI
// - Adds to history
```

### Get Prices and Gas

```javascript
await MarketComponent.fetchEthPrice(state, elements);
await MarketComponent.refreshNetworkInfo(state, elements);
// Updates:
// - state.ethPriceUSD
// - state.gasPriceWei
// - state.feeEstimateEth
```

### Deposit to Contract

```javascript
await SmartContractComponent.depositToContract(state, elements, '0.1');
// Internally:
// - Validates amount
// - Sends ETH to contract
// - Updates balance
// - Adds to history
```

---

**Quick Tip**: Always check that state.account is set before calling methods that require a connected wallet!
