// ============================================
// TRANSACTION COMPONENT - Send ETH & History
// ============================================

const TransactionComponent = {
  HISTORY_KEY: 'simple-wallet-history',

  // Initialize history from storage
  hydrateHistory(state, elements) {
    try {
      const raw = localStorage.getItem(this.HISTORY_KEY);
      state.history = raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('Không thể đọc lịch sử', error);
      state.history = [];
    }
  },

  // Save history to storage
  persistHistory(state) {
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(state.history));
  },

  // Validate transaction form
  validateForm(recipient, amount, state) {
    if (!state.account) return 'Vui lòng kết nối ví trước.';
    if (!recipient) return 'Vui lòng nhập địa chỉ nhận.';
    if (!ethers.isAddress(recipient)) return 'Địa chỉ nhận không hợp lệ.';
    if (!amount || Number(amount) <= 0) return 'Số ETH phải lớn hơn 0.';
    return null;
  },

  // Send ETH transaction
  async sendTransaction(event, state, elements) {
    event.preventDefault();
    const recipient = elements.recipient.value.trim();
    const amount = elements.amount.value.trim();

    const errorMsg = this.validateForm(recipient, amount, state);
    if (errorMsg) {
      elements.formError.textContent = errorMsg;
      return;
    }

    try {
      const valueWei = ethers.parseEther(amount);
      const balanceWei = await state.provider.getBalance(state.account);
      if (balanceWei < valueWei) {
        elements.formError.textContent = 'Số dư không đủ.';
        return;
      }

      elements.formError.textContent = '';
      elements.sendBtn.disabled = true;
      elements.sendBtn.textContent = 'Sending...';
      UIComponent.setStatus('Đang gửi giao dịch...', 'pending');

      const tx = await state.signer.sendTransaction({
        to: recipient,
        value: valueWei,
      });

      this.updateTxInfo('Đang chờ xác nhận', tx.hash, elements);
      await tx.wait();

      this.updateTxInfo('Giao dịch thành công', tx.hash, elements);
      await WalletComponent.fetchBalance(state, elements);
      this.pushHistory({ hash: tx.hash, to: recipient, amount, status: 'Thành công' }, state, elements);
      elements.transferForm.reset();
      this.updateTotalCost(state, elements);
    } catch (error) {
      console.error('Transaction error:', error);
      const reason = error?.info?.error?.message || error?.shortMessage || 'Giao dịch bị hủy.';
      UIComponent.setStatus(reason, 'error');
      this.updateTxInfo('Giao dịch thất bại', null, elements);
    } finally {
      elements.sendBtn.disabled = false;
      elements.sendBtn.textContent = 'Send ETH';
    }
  },

  // Update transaction info display
  updateTxInfo(status, hash, elements) {
    elements.txStatus.textContent = status;
    if (hash) {
      elements.txHash.textContent = hash;
      elements.txHash.href = `https://sepolia.etherscan.io/tx/${hash}`;
    } else {
      elements.txHash.textContent = '—';
      elements.txHash.removeAttribute('href');
    }
  },

  // Update total cost calculation
  updateTotalCost(state, elements) {
    const amountValue = Number(elements.amount.value) || 0;
    if (state.feeEstimateEth === null) {
      elements.totalCost.textContent = '—';
      return;
    }
    const total = amountValue > 0 ? amountValue + state.feeEstimateEth : null;
    elements.totalCost.textContent = total ? `${total.toFixed(6)} ETH` : '—';
  },

  // Add entry to history
  pushHistory(entry, state, elements) {
    const enriched = {
      time: new Date().toLocaleString(),
      ...entry,
    };
    state.history = [enriched, ...state.history].slice(0, 10);
    this.persistHistory(state);
    this.renderHistory(state, elements);
  },

  // Render history list
  renderHistory(state, elements) {
    const historyList = elements.historyList;
    const clearBtn = elements.clearHistory;
    const downloadBtn = elements.downloadHistory;
    
    historyList.innerHTML = '';
    if (!state.history.length) {
      historyList.innerHTML = '<li class="text-slate-400">Chưa có giao dịch được lưu.</li>';
      if (clearBtn) clearBtn.disabled = true;
      if (downloadBtn) downloadBtn.disabled = true;
      return;
    }

    state.history.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'border border-slate-600/50 rounded-xl p-3';
      li.innerHTML = `
        <p class="text-xs text-slate-400">${item.time}</p>
        <p class="font-semibold">${item.amount} ETH ➜ ${item.to.slice(0, 10)}...</p>
        <p class="text-xs text-cyan-300 break-all">${item.hash}</p>
        <p class="text-xs text-emerald-300">${item.status}</p>
      `;
      historyList.appendChild(li);
    });
    
    if (clearBtn) clearBtn.disabled = false;
    if (downloadBtn) downloadBtn.disabled = false;
  },

  // Clear history
  clearHistory(state, elements) {
    state.history = [];
    this.persistHistory(state);
    this.renderHistory(state, elements);
  },

  // Download history as JSON
  downloadHistoryFile(state, elements) {
    if (!state.history.length) return;
    const blob = new Blob([JSON.stringify(state.history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `simple-wallet-history-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
