# Deployment Guide - Simple Wallet

## Project Overview

**Type**: Static Web Application (HTML/CSS/JavaScript)
**Stack**: Vanilla JavaScript + ethers.js v6 + Tailwind CSS
**Network**: Ethereum Sepolia Testnet
**No Build Process Required**: All files are ready to deploy as-is

---

## Pre-Deployment Checklist

### ✅ Code Verification

- [x] All JavaScript syntax is valid (no TypeScript compilation needed)
- [x] All HTML IDs match JavaScript references
- [x] Smart contract address is configured: `0x09fB30F20278Af73960014666A6Fa814dCbb199f`
- [x] CoinGecko API integration for ETH price
- [x] MetaMask/window.ethereum integration
- [x] All CSS files properly linked
- [x] All JavaScript modules load with `defer` attribute

### ✅ Environment Setup

- [x] `.gitignore` created
- [x] README.md documentation complete
- [x] DEPLOY_GUIDE.md created
- [x] Testing guides provided
- [x] No sensitive keys in code (MetaMask uses window.ethereum)

### ✅ Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Requires MetaMask or compatible Web3 provider

---

## Deployment Options

### Option 1: GitHub Pages (Recommended - Free)

**Advantages**: Free hosting, automatic SSL, GitHub integration
**Time**: 5-10 minutes

#### Steps:

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Simple Wallet"
   git remote add origin https://github.com/YOUR_USERNAME/simple-wallet.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select `main` branch as source
   - Save
   - Wait 1-2 minutes for deployment
   - Your site: `https://YOUR_USERNAME.github.io/simple-wallet/`

3. **Update Base URL (if needed)**
   - If deploying to subdirectory, update paths in HTML/CSS

**Live Example URL**: `https://username.github.io/simple-wallet/`

---

### Option 2: Netlify (Free)

**Advantages**: Easy drag-and-drop, excellent performance, auto-preview
**Time**: 2-3 minutes

#### Steps:

1. **Create Netlify Account**
   - Visit netlify.com
   - Sign up with GitHub/Google

2. **Deploy via Git**
   - Push code to GitHub (as above)
   - In Netlify, click "New site from Git"
   - Select GitHub repository
   - Build settings:
     - Build command: (leave empty - no build needed)
     - Publish directory: (leave empty - deploy root)
   - Deploy

3. **Alternative: Drag & Drop**
   - In Netlify dashboard, drag `c:\Blockchainv2` folder
   - Auto-deploys
   - Get instant live URL

**Live Example URL**: `https://simple-wallet-xyz.netlify.app`

---

### Option 3: Vercel (Free)

**Advantages**: Optimal performance, serverless functions support, CLI deployment
**Time**: 2-3 minutes

#### Steps:

1. **Create Vercel Account**
   - Visit vercel.com
   - Sign up with GitHub/Google

2. **Deploy from Git**
   - Click "Import Project"
   - Select GitHub repository
   - Root directory: (leave empty)
   - Build command: (leave empty)
   - Output directory: (leave empty)
   - Deploy

**Live Example URL**: `https://simple-wallet-xyz.vercel.app`

---

### Option 4: Self-Hosted (Advanced)

**Requirements**: Linux VPS, Nginx/Apache, domain name
**Time**: 15-30 minutes

#### Example: Nginx Setup

```bash
# 1. SSH to server
ssh user@your-domain.com

# 2. Install Nginx
sudo apt update
sudo apt install nginx

# 3. Clone repository
cd /var/www
git clone https://github.com/YOUR_USERNAME/simple-wallet.git
cd simple-wallet

# 4. Configure Nginx
sudo nano /etc/nginx/sites-available/simple-wallet

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/simple-wallet;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}

# 5. Enable site
sudo ln -s /etc/nginx/sites-available/simple-wallet /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 6. Setup SSL (Let's Encrypt - FREE)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

**Live Example URL**: `https://your-domain.com`

---

## Deployment Verification Checklist

After deploying to any platform, verify these items:

### ✅ Basic Functionality

- [ ] Page loads without errors
- [ ] All text is visible and readable
- [ ] Layout is responsive (mobile, tablet, desktop)
- [ ] Dark/Light mode toggle works
- [ ] All buttons are clickable

### ✅ MetaMask Integration

- [ ] "Connect Wallet" button works
- [ ] MetaMask popup appears
- [ ] Wallet connects successfully
- [ ] Wallet address displays
- [ ] "Copy" button copies address

### ✅ Market Data

- [ ] ETH price displays from CoinGecko
- [ ] Price updates every 60 seconds
- [ ] Fiat value calculates correctly
- [ ] Gas price displays (if connected to Sepolia)

### ✅ Network Features

- [ ] Network name shows (Sepolia)
- [ ] Gas price displays
- [ ] Transaction fee estimates show

### ✅ Transactions

- [ ] Send ETH form displays
- [ ] Form validation works (empty fields, invalid addresses)
- [ ] Amount input accepts decimals
- [ ] Total cost calculates correctly
- [ ] Send button works (opens MetaMask)

### ✅ Smart Contract (if configured)

- [ ] Contract section displays
- [ ] Contract address shows correctly
- [ ] Deposit form works
- [ ] Withdraw form works
- [ ] Balance refreshes

### ✅ History & Export

- [ ] Transaction history saves locally
- [ ] History persists after page reload
- [ ] Export JSON button works
- [ ] Clear history button works

### ✅ Browser Console

- [ ] No critical JavaScript errors
- [ ] No 404 errors for resources
- [ ] No CORS errors
- [ ] No security warnings

---

## Performance Optimization

### Before Deployment

1. **Minify JavaScript** (Optional)
   - Use terser or similar tool
   - Not required for small project

2. **Optimize Images** (Optional)
   - No images in current version
   - If added, use WebP format

3. **Enable Compression** (Server-side)
   - Most platforms auto-enable gzip
   - Nginx: `gzip on;` in config

### Post-Deployment

1. **Set Cache Headers**
   - Static assets: 1 year
   - HTML: no-cache or 24 hours
   - GitHub Pages/Netlify/Vercel: auto-configured

2. **Enable HTTPS**
   - Required for MetaMask (protocol must be https://)
   - All platforms listed support HTTPS
   - GitHub Pages/Netlify/Vercel: automatic SSL

---

## Post-Deployment Tasks

### 1. Update Smart Contract Address (If Not Configured)

If you deploy a new SmartBank contract:

1. Deploy contract to Sepolia testnet
2. Copy contract address
3. Update in `src/components/smartContract.js`:
   ```javascript
   SIMPLE_BANK_ADDRESS: '0x[NEW_ADDRESS]',
   ```
4. Redeploy application

### 2. Setup Domain (Optional)

For custom domain on Netlify/Vercel:

- Purchase domain from Namecheap, GoDaddy, etc.
- Point DNS to platform nameservers
- Configure in platform settings
- Wait 24-48 hours for DNS propagation

### 3. Monitor Deployment

- Check browser console for errors
- Monitor MetaMask connection status
- Test with real testnet ETH
- Watch for API failures (CoinGecko)

### 4. Set Up Analytics (Optional)

Add Google Analytics or Vercel Analytics:

```html
<!-- Add to <head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## Troubleshooting Common Issues

### Issue: "MetaMask not available"
**Solution**: Ensure HTTPS protocol (not HTTP)
- MetaMask blocks HTTP websites
- All recommended platforms use HTTPS by default

### Issue: "CoinGecko API timeout"
**Solution**: Fallback price in code handles this
- Price falls back to $2500
- Will update when API responds
- Can add backup API source

### Issue: "Contract address not found"
**Solution**: 
1. Check address is valid hex format
2. Verify contract deployed to Sepolia
3. Check on Etherscan: https://sepolia.etherscan.io/

### Issue: "CORS error from API"
**Solution**: 
- Use CoinGecko (no authentication needed)
- Some APIs require CORS proxy
- Fallback values handle failures gracefully

### Issue: "Page shows blank/white"
**Solution**:
1. Check browser console (F12) for errors
2. Verify all script files load (Network tab)
3. Check CSS file loads correctly
4. Clear cache (Ctrl+Shift+R)

---

## Production Checklist

Before going live with real funds:

- [ ] Test on Sepolia testnet thoroughly
- [ ] Get testnet ETH from faucet
- [ ] Test all features (connect, send, contract interaction)
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify MetaMask integration works
- [ ] Check all links (Etherscan, CoinGecko)
- [ ] Review security considerations
- [ ] Setup monitoring/error tracking

---

## Security Considerations

### ✅ Current Security Measures

- No private keys stored anywhere
- All transactions require MetaMask approval
- Uses official ethers.js library
- No server-side code (can't be hacked at API level)
- All interactions signed by user's wallet

### ⚠️ User Responsibilities

1. **Keep MetaMask Seed Safe**
   - Never share 12/24 word recovery phrase
   - Never enter it on any website (including this one)

2. **Verify URLs**
   - Always check browser URL matches official site
   - Be aware of phishing attacks
   - Bookmark the official site

3. **Check Transactions**
   - Always verify transaction details in MetaMask
   - Check recipient address matches
   - Check amount is correct
   - Check gas price is reasonable

### ⚠️ Testnet-Only Features

- Smart contract is on testnet only
- Contract address: `0x09fB30F20278Af73960014666A6Fa814dCbb199f`
- Only works with Sepolia testnet
- Transactions use testnet ETH (no real value)

---

## Maintenance & Updates

### Regular Tasks

- Monitor for ethers.js updates (security patches)
- Check Tailwind CSS updates
- Update qrcodejs if needed
- Periodically test MetaMask integration

### How to Update

1. Pull latest code
2. Test locally
3. Commit changes
4. Push to repository
5. Deployment platforms auto-redeploy

### Version History

- **v1.0** (Current)
  - Component-based architecture
  - Smart contract integration
  - Market data display
  - Transaction history

---

## Support & Resources

- **ethers.js Docs**: https://docs.ethers.org/
- **MetaMask Docs**: https://docs.metamask.io/
- **Sepolia Testnet Faucet**: https://sepoliafaucet.com
- **Sepolia Explorer**: https://sepolia.etherscan.io
- **CoinGecko API**: https://www.coingecko.com/api

---

## Summary

| Platform | Setup Time | Cost | Performance | Recommendation |
|----------|-----------|------|-------------|-----------------|
| GitHub Pages | 10 min | Free | Good | ⭐⭐⭐ Recommended |
| Netlify | 5 min | Free | Excellent | ⭐⭐⭐ Recommended |
| Vercel | 5 min | Free | Excellent | ⭐⭐⭐ Recommended |
| Self-Hosted | 30 min | $5-10/mo | Excellent | ⭐⭐ If experienced |

**Recommendation**: Start with **Netlify** or **GitHub Pages** for fastest deployment.

---

**Deployment Guide Complete!** 🚀

Choose your platform above and follow the steps. All platforms are free and production-ready.
