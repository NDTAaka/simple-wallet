// ============================================================================
// GLOBAL STATE AND ELEMENTS
// ============================================================================

const elements = {
  connectBtn: document.getElementById('connectBtn'),
  walletStatus: document.getElementById('walletStatus'),
  walletAddress: document.getElementById('walletAddress'),
  copyBtn: document.getElementById('copyBtn'),
  modeToggle: document.getElementById('modeToggle'),
  refreshBtn: document.getElementById('refreshBtn'),
  walletBalance: document.getElementById('walletBalance'),
  ethPrice: document.getElementById('ethPrice'),
  balanceFiat: document.getElementById('balanceFiat'),
  priceUpdatedAt: document.getElementById('priceUpdatedAt'),
  networkName: document.getElementById('networkName'),
  gasBase: document.getElementById('gasBase'),
  txFee: document.getElementById('txFee'),
  txFeeFiat: document.getElementById('txFeeFiat'),
  transferForm: document.getElementById('transferForm'),
  recipient: document.getElementById('recipient'),
  amount: document.getElementById('amount'),
  formTxFee: document.getElementById('formTxFee'),
  totalCost: document.getElementById('totalCost'),
  sendBtn: document.getElementById('sendBtn'),
  formError: document.getElementById('formError'),
  txStatus: document.getElementById('txStatus'),
  txHash: document.getElementById('txHash'),
  historyList: document.getElementById('historyList'),
  clearHistory: document.getElementById('clearHistory'),
  downloadHistory: document.getElementById('downloadHistory'),
  qrCanvas: document.getElementById('qrCanvas'),
  contractStatus: document.getElementById('contractStatus'),
  contractAddress: document.getElementById('contractAddress'),
  contractBalance: document.getElementById('contractBalance'),
  contractWarning: document.getElementById('contractWarning'),
  refreshContractBalance: document.getElementById('refreshContractBalance'),
  depositAmount: document.getElementById('depositAmount'),
  depositBtn: document.getElementById('depositBtn'),
  depositError: document.getElementById('depositError'),
  withdrawAmount: document.getElementById('withdrawAmount'),
  withdrawBtn: document.getElementById('withdrawBtn'),
  withdrawError: document.getElementById('withdrawError'),
};

const state = {
  provider: null,
  rawProvider: null,
  signer: null,
  account: null,
  qr: null,
  history: [],
  darkMode: true,
  ethPriceUSD: 2500, // Fallback price for testing
  balanceEth: 0,
  gasPriceWei: null,
  feeEstimateEth: null,
  simpleBankContract: null,
  simpleBankABI: null,
};

const SIMPLE_BANK_ADDRESS = '0x09fB30F20278Af73960014666A6Fa814dCbb199f';
const HISTORY_KEY = 'simple-wallet-history';
const PRICE_REFRESH_MS = 60_000;

// Store elements globally for components
window.appElements = elements;

// ============================================================================
// INITIALIZATION & EVENT WIRING
// ============================================================================

async function init() {
  // Initialize components with state and elements
  TransactionComponent.hydrateHistory(state, elements);
  TransactionComponent.renderHistory(state, elements);
  
  UIComponent.toggleTheme(state, elements);
  
  // Initialize market data with fallback
  if (state.ethPriceUSD) {
    elements.ethPrice.textContent = `$${state.ethPriceUSD.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  
  MarketComponent.fetchEthPrice(state, elements);
  setInterval(() => MarketComponent.fetchEthPrice(state, elements), PRICE_REFRESH_MS);
  
  await WalletComponent.init(state, elements);
  
  // Load smart contract ABI first, THEN initialize contract
  await SmartContractComponent.loadSmartContractABI(state, elements, SIMPLE_BANK_ADDRESS);
  await SmartContractComponent.initializeSmartContract(state, elements, SIMPLE_BANK_ADDRESS);
  
  // Setup event listeners
  wireEvents();
  
  // Refresh network info and auto-connect
  MarketComponent.refreshNetworkInfo(state, elements);
  WalletComponent.autoConnectIfAuthorized(state, elements);
}

function wireEvents() {
  elements.connectBtn.addEventListener('click', () => WalletComponent.connectWallet(state, elements));
  elements.refreshBtn.addEventListener('click', () => WalletComponent.fetchBalance(state, elements));
  elements.copyBtn.addEventListener('click', () => WalletComponent.copyAddress(state, elements));
  elements.modeToggle.addEventListener('click', () => UIComponent.toggleTheme(state, elements));
  elements.transferForm.addEventListener('submit', (e) => TransactionComponent.sendTransaction(e, state, elements));
  elements.clearHistory.addEventListener('click', (e) => {
    e.preventDefault();
    TransactionComponent.clearHistory(state, elements);
  });
  elements.amount.addEventListener('input', () => TransactionComponent.updateTotalCost(state, elements));
  elements.downloadHistory?.addEventListener('click', (e) => {
    e.preventDefault();
    TransactionComponent.downloadHistoryFile(state, elements);
  });
  elements.refreshContractBalance?.addEventListener('click', () => SmartContractComponent.refreshContractBalance(state, elements));
  elements.depositBtn?.addEventListener('click', (e) => SmartContractComponent.handleDepositClick(state, elements, e));
  elements.withdrawBtn?.addEventListener('click', (e) => SmartContractComponent.handleWithdrawClick(state, elements, e));
}

// ============================================================================
// START APPLICATION
// ============================================================================

init();
