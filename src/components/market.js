// ============================================
// MARKET COMPONENT - ETH Price & Gas Info
// ============================================

const MarketComponent = {
  PRICE_REFRESH_MS: 60_000,

  // Fetch ETH price from CoinGecko
  async fetchEthPrice(state, elements) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const price = data?.ethereum?.usd;
      if (!price) throw new Error('Không có giá trị usd');
      
      state.ethPriceUSD = Number(price);
      elements.ethPrice.textContent = `$${state.ethPriceUSD.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      elements.priceUpdatedAt.textContent = new Date().toLocaleTimeString();
      
      WalletComponent.updateBalanceFiat(state, elements);
      this.updateGasUsd(state, elements);
    } catch (error) {
      console.debug('Không thể lấy giá ETH (normal for offline)');
      elements.ethPrice.textContent = '$—';
      elements.priceUpdatedAt.textContent = 'Không có kết nối';
    }
  },

  // Refresh network info
  async refreshNetworkInfo(state, elements) {
    if (!state.provider) return;
    
    try {
      const network = await Promise.race([
        state.provider.getNetwork(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
      ]);
      elements.networkName.textContent = `${network.name} (Chain ${network.chainId})`;
    } catch (error) {
      console.debug('Network info unavailable');
      elements.networkName.textContent = '—';
    }
    
    try {
      await this.updateGasData(state, elements);
    } catch (error) {
      console.debug('Gas data unavailable');
    }
  },

  // Update gas price data
  async updateGasData(state, elements) {
    if (!state.provider) return;
    
    try {
      const feeData = await Promise.race([
        state.provider.getFeeData(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
      ]);
      
      const gasPriceWei = feeData?.gasPrice ?? feeData?.maxFeePerGas;
      if (!gasPriceWei) {
        elements.gasBase.textContent = '—';
        state.gasPriceWei = null;
        state.feeEstimateEth = null;
        this.updateGasPanels(state, elements);
        return;
      }
      
      state.gasPriceWei = gasPriceWei;
      const gasPriceGwei = Number(ethers.formatUnits(gasPriceWei, 'gwei'));
      elements.gasBase.textContent = `${gasPriceGwei.toFixed(2)} gwei`;
      state.feeEstimateEth = Number(ethers.formatEther(gasPriceWei * 21_000n));
      this.updateGasPanels(state, elements);
    } catch (error) {
      console.debug('Gas price unavailable (testnet may not support EIP-1559)');
      elements.gasBase.textContent = '—';
      state.gasPriceWei = null;
      state.feeEstimateEth = null;
      this.updateGasPanels(state, elements);
    }
  },

  // Update gas display panels
  updateGasPanels(state, elements) {
    if (state.feeEstimateEth !== null) {
      const feeText = `${state.feeEstimateEth.toFixed(6)} ETH`;
      elements.txFee.textContent = feeText;
      elements.formTxFee.textContent = feeText;
    } else {
      elements.txFee.textContent = '—';
      elements.formTxFee.textContent = '—';
    }
    this.updateGasUsd(state, elements);
    TransactionComponent.updateTotalCost(state, elements);
  },

  // Update gas fee in USD
  updateGasUsd(state, elements) {
    if (state.ethPriceUSD && state.feeEstimateEth !== null) {
      const usd = state.feeEstimateEth * state.ethPriceUSD;
      elements.txFeeFiat.textContent = `$${usd.toFixed(2)}`;
    } else {
      elements.txFeeFiat.textContent = '—';
    }
  },
};
