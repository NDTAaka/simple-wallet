// ============================================
// UI COMPONENT - Status, Theme, QR Code
// ============================================

const UIComponent = {
  // Set status message with color
  setStatus(message, variant = 'info') {
    const elements = window.appElements;
    if (!elements || !elements.walletStatus) return;
    
    const palette = {
      success: 'text-emerald-300',
      error: 'text-rose-400',
      pending: 'text-amber-300',
      info: 'text-slate-300',
    };
    elements.walletStatus.className = `text-lg font-semibold ${palette[variant] || palette.info}`;
    elements.walletStatus.textContent = message;
  },

  // Toggle dark/light mode
  toggleTheme(state, elements) {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle('bg-white', !state.darkMode);
    document.body.classList.toggle('text-slate-900', !state.darkMode);
    document.body.classList.toggle('text-slate-100', state.darkMode);
    elements.modeToggle.textContent = state.darkMode ? 'Dark' : 'Light';
  },

  // Draw QR code
  drawQrCode(value, elements) {
    this.clearQrCode(elements);
    if (!window.QRCode || !value) return;
    try {
      const qr = new QRCode(elements.qrCanvas, {
        text: value,
        width: 132,
        height: 132,
        colorDark: '#0ea5e9',
        colorLight: 'transparent',
        correctLevel: QRCode.CorrectLevel.H,
      });
      return qr;
    } catch (error) {
      console.error('QR code error:', error);
    }
  },

  // Clear QR code
  clearQrCode(elements) {
    if (elements.qrCanvas) {
      elements.qrCanvas.innerHTML = '';
    }
  },
};
