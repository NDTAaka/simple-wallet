// ============================================
// SMART CONTRACT COMPONENT - Deposit/Withdraw
// ============================================

const SmartContractComponent = {
  SIMPLE_BANK_ADDRESS: '0x09fB30F20278Af73960014666A6Fa814dCbb199f', // ✅ Production: Sepolia Testnet
  simpleBankContract: null,
  simpleBankABI: null,

  // Load contract ABI from file
  async loadSmartContractABI(state, elements, contractAddress) {
    // ABI is now embedded directly in the component to avoid fetch issues
    this.simpleBankABI = [
      {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"balance","type":"uint256"}],"name":"BalanceQueried","type":"event"},
      {"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},
      {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"Deposit","type":"event"},
      {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},
      {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"Withdraw","type":"event"},
      {"stateMutability":"payable","type":"receive"},
      {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"getMyBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"getTotalBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"totalBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"userCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"users","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
    ];
    console.debug('Smart contract ABI loaded successfully (embedded)');
  },

  // Initialize contract instance
  async initializeSmartContract(state, elements, contractAddress) {
    if (contractAddress) {
      this.SIMPLE_BANK_ADDRESS = contractAddress;
    }
    
    console.debug('Initializing contract with:');
    console.debug('- Address:', this.SIMPLE_BANK_ADDRESS);
    console.debug('- ABI loaded:', !!this.simpleBankABI);
    console.debug('- Provider ready:', !!state.provider);
    
    if (!this.SIMPLE_BANK_ADDRESS || !this.simpleBankABI) {
      console.debug('Smart contract not configured - address or ABI missing');
      if (elements) this.updateContractUI(state, elements);
      return;
    }
    
    try {
      this.simpleBankContract = new ethers.Contract(
        this.SIMPLE_BANK_ADDRESS,
        this.simpleBankABI,
        state.provider
      );
      console.debug('✅ Smart contract initialized:', this.SIMPLE_BANK_ADDRESS);
      if (elements) this.updateContractUI(state, elements);
    } catch (error) {
      console.error('❌ Failed to initialize smart contract:', error);
      if (elements) this.updateContractUI(state, elements);
    }
  },

  // Get user's contract balance
  async getContractBalance(state) {
    if (!this.simpleBankContract || !state.account) {
      console.debug('Contract or account not available');
      return null;
    }
    try {
      // If signer is available, use contract with signer for better compatibility
      let contract = this.simpleBankContract;
      if (state.signer) {
        console.debug('Using contract with signer for getBalance');
        contract = this.simpleBankContract.connect(state.signer);
      }
      
      const balanceWei = await contract.getBalance(state.account);
      return Number(ethers.formatEther(balanceWei));
    } catch (error) {
      console.error('Error fetching contract balance:', error);
      return null;
    }
  },

  // Deposit ETH to contract
  async depositToContract(amount, state, elements) {
    if (!this.simpleBankContract || !state.signer) {
      UIComponent.setStatus('Smart contract not configured', 'error');
      return null;
    }
    
    try {
      const valueWei = ethers.parseEther(amount);
      const contractWithSigner = this.simpleBankContract.connect(state.signer);
      
      UIComponent.setStatus('Sending deposit to contract...', 'pending');
      const tx = await contractWithSigner.deposit({ value: valueWei });
      
      TransactionComponent.updateTxInfo('Waiting for confirmation', tx.hash, elements);
      await tx.wait();
      
      TransactionComponent.updateTxInfo('Deposit successful', tx.hash, elements);
      await WalletComponent.fetchBalance(state, elements);
      TransactionComponent.pushHistory({ 
        hash: tx.hash, 
        to: this.SIMPLE_BANK_ADDRESS, 
        amount, 
        status: 'Deposit thành công',
        type: 'deposit'
      }, state);
      UIComponent.setStatus('Deposit to contract successful', 'success');
      return tx.hash;
    } catch (error) {
      console.error('Deposit error:', error);
      const reason = error?.info?.error?.message || error?.shortMessage || 'Deposit failed.';
      UIComponent.setStatus(reason, 'error');
      TransactionComponent.updateTxInfo('Deposit failed', null, elements);
      return null;
    }
  },

  // Withdraw ETH from contract
  async withdrawFromContract(amount, state, elements) {
    if (!this.simpleBankContract || !state.signer) {
      UIComponent.setStatus('Smart contract not configured', 'error');
      return null;
    }
    
    try {
      const valueWei = ethers.parseEther(amount);
      const contractWithSigner = this.simpleBankContract.connect(state.signer);
      
      UIComponent.setStatus('Processing withdrawal from contract...', 'pending');
      const tx = await contractWithSigner.withdraw(valueWei);
      
      TransactionComponent.updateTxInfo('Waiting for confirmation', tx.hash, elements);
      await tx.wait();
      
      TransactionComponent.updateTxInfo('Withdrawal successful', tx.hash, elements);
      await WalletComponent.fetchBalance(state, elements);
      TransactionComponent.pushHistory({ 
        hash: tx.hash, 
        to: state.account, 
        amount, 
        status: 'Rút tiền thành công',
        type: 'withdraw'
      }, state);
      UIComponent.setStatus('Withdrawal from contract successful', 'success');
      return tx.hash;
    } catch (error) {
      console.error('Withdrawal error:', error);
      const reason = error?.info?.error?.message || error?.shortMessage || 'Withdrawal failed.';
      UIComponent.setStatus(reason, 'error');
      TransactionComponent.updateTxInfo('Withdrawal failed', null, elements);
      return null;
    }
  },

  // Update contract UI status
  updateContractUI(state, elements) {
    if (this.SIMPLE_BANK_ADDRESS && this.simpleBankContract) {
      elements.contractStatus.textContent = '✓ Đã cấu hình';
      elements.contractStatus.className = 'text-xs text-emerald-400';
      elements.contractAddress.textContent = this.SIMPLE_BANK_ADDRESS;
      elements.contractWarning.textContent = '';
      elements.depositBtn.disabled = false;
      elements.withdrawBtn.disabled = false;
      elements.refreshContractBalance.disabled = false;
    } else {
      elements.contractStatus.textContent = '✗ Chưa cấu hình';
      elements.contractStatus.className = 'text-xs text-rose-400';
      elements.contractAddress.textContent = '—';
      elements.contractWarning.textContent = '⚠️ Vui lòng cập nhật SIMPLE_BANK_ADDRESS trong config';
      elements.depositBtn.disabled = true;
      elements.withdrawBtn.disabled = true;
      elements.refreshContractBalance.disabled = true;
    }
  },

  // Refresh contract balance display
  async refreshContractBalance(state, elements) {
    if (!state.account) {
      console.debug('No account connected');
      return;
    }
    if (!this.simpleBankContract) {
      console.debug('Contract not initialized');
      return;
    }
    try {
      console.debug('Fetching contract balance for account:', state.account);
      const balanceWei = await this.getContractBalance(state);
      console.debug('Contract balance result:', balanceWei);
      if (balanceWei !== null) {
        elements.contractBalance.textContent = `${balanceWei.toFixed(4)} ETH`;
      } else {
        elements.contractBalance.textContent = '—';
      }
    } catch (error) {
      console.error('Contract balance error:', error);
      elements.contractBalance.textContent = '—';
    }
  },

  // Handle deposit form submission
  async handleDepositClick(event, state, elements) {
    event.preventDefault();
    const amount = elements.depositAmount.value.trim();
    
    if (!amount || Number(amount) <= 0) {
      elements.depositError.textContent = 'Vui lòng nhập số ETH lớn hơn 0';
      return;
    }
    
    try {
      const valueWei = ethers.parseEther(amount);
      const balanceWei = await state.provider.getBalance(state.account);
      if (balanceWei < valueWei) {
        elements.depositError.textContent = 'Số dư ví không đủ';
        return;
      }

      elements.depositError.textContent = '';
      elements.depositBtn.disabled = true;
      elements.depositBtn.textContent = 'Đang gửi...';
      
      const hash = await this.depositToContract(amount, state, elements);
      if (hash) {
        elements.depositAmount.value = '';
        await this.refreshContractBalance(state, elements);
      }
    } catch (error) {
      console.error('Deposit form error:', error);
      elements.depositError.textContent = 'Lỗi: ' + (error?.message || 'Không xác định');
    } finally {
      elements.depositBtn.disabled = false;
      elements.depositBtn.textContent = 'Deposit';
    }
  },

  // Handle withdraw form submission
  async handleWithdrawClick(event, state, elements) {
    event.preventDefault();
    const amount = elements.withdrawAmount.value.trim();
    
    if (!amount || Number(amount) <= 0) {
      elements.withdrawError.textContent = 'Vui lòng nhập số ETH lớn hơn 0';
      return;
    }
    
    try {
      const contractBalance = await this.getContractBalance(state);
      if (contractBalance === null || contractBalance < Number(amount)) {
        elements.withdrawError.textContent = 'Số dư trong contract không đủ';
        return;
      }

      elements.withdrawError.textContent = '';
      elements.withdrawBtn.disabled = true;
      elements.withdrawBtn.textContent = 'Đang xử lý...';
      
      const hash = await this.withdrawFromContract(amount, state, elements);
      if (hash) {
        elements.withdrawAmount.value = '';
        await this.refreshContractBalance(state, elements);
      }
    } catch (error) {
      console.error('Withdraw form error:', error);
      elements.withdrawError.textContent = 'Lỗi: ' + (error?.message || 'Không xác định');
    } finally {
      elements.withdrawBtn.disabled = false;
      elements.withdrawBtn.textContent = 'Withdraw';
    }
  },
};
