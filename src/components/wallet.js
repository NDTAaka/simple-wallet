// ============================================
// WALLET COMPONENT - MetaMask Connection & Balance
// ============================================

const WalletComponent = {
  // Initialize wallet
  async init(state, elements) {
    await this.waitForEthereum();
    const injected = this.resolveInjectedProvider();
    
    if (!injected) {
      UIComponent.setStatus('Vui lòng cài MetaMask', 'error');
      elements.connectBtn.disabled = true;
      return false;
    }
    
    state.rawProvider = injected;
    state.provider = new ethers.BrowserProvider(injected);
    return true;
  },

  // Wait for ethereum injection
  waitForEthereum() {
    const ETH_INJECTION_TIMEOUT = 4_000;
    if (window.ethereum) return Promise.resolve(window.ethereum);
    
    return new Promise((resolve) => {
      window.addEventListener(
        'ethereum#initialized',
        () => resolve(window.ethereum),
        { once: true }
      );
      setTimeout(() => resolve(window.ethereum), ETH_INJECTION_TIMEOUT);
    });
  },

  // Resolve injected provider (handle multiple wallets)
  resolveInjectedProvider() {
    const { ethereum } = window;
    if (!ethereum) return null;
    
    if (ethereum.providers?.length) {
      const metaMaskProvider = ethereum.providers.find((prov) => prov.isMetaMask);
      return metaMaskProvider ?? ethereum.providers[0];
    }
    return ethereum;
  },

  // Connect wallet
  async connectWallet(state, elements) {
    if (!state.provider) {
      UIComponent.setStatus('MetaMask chưa khả dụng', 'error');
      return;
    }
    
    try {
      const accounts = await state.provider.send('eth_requestAccounts', []);
      if (accounts && accounts.length) {
        await this.handleAccount(accounts[0], state, elements);
      }
    } catch (error) {
      console.error(error);
      UIComponent.setStatus('Người dùng từ chối kết nối', 'error');
    }
  },

  // Handle account info
  async handleAccount(address, state, elements) {
    try {
      state.account = ethers.getAddress(address);
    } catch (error) {
      UIComponent.setStatus('Địa chỉ ví không hợp lệ', 'error');
      return;
    }

    state.signer = await state.provider.getSigner();
    elements.walletStatus.textContent = 'Đã kết nối';
    elements.walletAddress.textContent = state.account;
    elements.copyBtn.disabled = false;
    elements.refreshBtn.disabled = false;
    elements.sendBtn.disabled = false;
    elements.clearHistory.disabled = state.history.length === 0;
    
    UIComponent.drawQrCode(state.account, elements);
    await this.fetchBalance(state, elements);
    
    try {
      await MarketComponent.refreshNetworkInfo(state, elements);
    } catch (err) {
      console.debug('Network info not available');
    }
    
    // Initialize smart contract UI
    SmartContractComponent.updateContractUI(state, elements);
    await SmartContractComponent.refreshContractBalance(state, elements);
    
    UIComponent.setStatus('Ví đã kết nối', 'success');
  },

  // Fetch and display balance
  async fetchBalance(state, elements) {
    if (!state.account || !state.provider) return;
    
    try {
      const balanceWei = await state.provider.getBalance(state.account);
      state.balanceEth = Number(ethers.formatEther(balanceWei));
      elements.walletBalance.textContent = `${state.balanceEth.toFixed(4)} ETH`;
      this.updateBalanceFiat(state, elements);
    } catch (error) {
      console.error('Balance fetch error:', error);
      UIComponent.setStatus('Không thể lấy số dư', 'error');
    }
  },

  // Update balance in fiat (USD)
  updateBalanceFiat(state, elements) {
    if (!state.ethPriceUSD || !state.account) {
      elements.balanceFiat.textContent = '$—';
      return;
    }
    const fiatValue = state.balanceEth * state.ethPriceUSD;
    elements.balanceFiat.textContent = `$${fiatValue.toFixed(2)}`;
  },

  // Auto-connect if previously authorized
  async autoConnectIfAuthorized(state, elements) {
    try {
      const accounts = await Promise.race([
        state.provider.listAccounts(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
      ]);
      if (accounts && accounts.length) {
        await this.handleAccount(accounts[0].address, state, elements);
      }
    } catch (error) {
      console.debug('Autoconnect skipped');
    }

    const providerForEvents = state.rawProvider || window.ethereum;
    if (!providerForEvents) return;

    if (typeof providerForEvents.on === 'function') {
      providerForEvents.on('accountsChanged', (accountsChanged) => {
        try {
          const newAccount = accountsChanged?.[0];
          if (!newAccount) {
            this.resetUI(state, elements);
            return;
          }
          this.handleAccount(newAccount, state, elements);
        } catch (err) {
          console.error('Error in accountsChanged:', err);
        }
      });

      providerForEvents.on('chainChanged', () => {
        try {
          this.fetchBalance(state, elements).catch(err => console.error('Balance refresh error:', err));
          MarketComponent.refreshNetworkInfo(state, elements).catch(err => console.error('Network refresh error:', err));
        } catch (err) {
          console.error('Error in chainChanged:', err);
        }
      });
    }
  },

  // Reset UI when disconnected
  resetUI(state, elements) {
    state.account = null;
    state.signer = null;
    elements.walletStatus.textContent = 'Chưa kết nối';
    elements.walletAddress.textContent = '—';
    elements.walletBalance.textContent = '0.0000 ETH';
    elements.copyBtn.disabled = true;
    elements.refreshBtn.disabled = true;
    elements.sendBtn.disabled = true;
    elements.clearHistory.disabled = state.history.length === 0;
    elements.txStatus.textContent = 'Chưa có giao dịch';
    elements.txHash.textContent = '—';
    elements.txHash.removeAttribute('href');
    UIComponent.clearQrCode(elements);
    this.resetAnalytics(state, elements);
  },

  // Reset analytics display
  resetAnalytics(state, elements) {
    state.balanceEth = 0;
    state.gasPriceWei = null;
    state.feeEstimateEth = null;
    elements.balanceFiat.textContent = '$—';
    elements.txFee.textContent = '—';
    elements.txFeeFiat.textContent = '—';
    elements.formTxFee.textContent = '—';
    elements.totalCost.textContent = '—';
  },

  // Copy address to clipboard
  async copyAddress(state, elements) {
    if (!state.account) return;
    try {
      await navigator.clipboard.writeText(state.account);
      elements.copyBtn.textContent = 'Copied';
      setTimeout(() => {
        elements.copyBtn.textContent = 'Copy';
      }, 1500);
    } catch (error) {
      console.error('Không thể copy', error);
    }
  },
};
