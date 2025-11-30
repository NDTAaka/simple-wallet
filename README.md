# Simple Wallet (Mini Ví Tiền Điện Tử)

Ứng dụng web tối giản giúp kết nối MetaMask, xem số dư ETH theo thời gian thực, gửi giao dịch trên testnet (Sepolia) và tương tác với smart contract để nạp/rút tiền. Dự án sử dụng HTML/CSS/JavaScript thuần, Tailwind CSS CDN, ethers.js và smart contract Solidity.

## Tính năng chính

### Ví Địa chỉ
- Kết nối/đổi ví MetaMask, hiển thị địa chỉ, sao chép và tạo QR code.
- Lấy số dư ETH, cập nhật sau mỗi giao dịch và cho phép làm mới thủ công.
- Theo dõi giá ETH từ CoinGecko, quy đổi số dư sang USD theo thời gian thực.

### Giao dịch ETH
- Bảng gas price/gas fee ước tính cho giao dịch kèm tổng chi phí dự kiến.
- Form gửi ETH với kiểm tra hợp lệ địa chỉ, số dư, trạng thái tiến trình và liên kết Etherscan.

### Smart Contract (SimpleBank)
- **Nạp ETH vào contract**: Gửi ETH đến contract, smart contract lưu trữ số dư riêng cho từng địa chỉ.
- **Rút ETH từ contract**: Rút số ETH đã nạp từ contract, cập nhật số dư trên chuỗi.
- **Theo dõi số dư contract**: Xem số dư của bạn trên contract và làm mới theo thời gian thực.

### Lịch sử & Xuất dữ liệu
- Lưu lịch sử giao dịch cục bộ (LocalStorage) gồm: chuyển ETH, nạp vào contract, rút từ contract.
- Cho phép xuất ra file JSON để lưu trữ.
- Giao diện đẹp, hỗ trợ Dark/Light mode, thông báo lỗi thân thiện.

## Yêu cầu

- Trình duyệt đã cài MetaMask.
- Ví MetaMask đang ở testnet Sepolia (hoặc testnet tương thích).
- ETH testnet để thử nghiệm (có thể lấy từ faucet Sepolia).
- Kết nối mạng Internet để lấy dữ liệu giá ETH/fee (CoinGecko + RPC).

## Cách chạy

1. Mở file `index.html` trực tiếp bằng trình duyệt (double-click hoặc dùng Live Server).
2. Nhấn **Connect Wallet** để cấp quyền cho ứng dụng.
3. **Để dùng Smart Contract** (nạp/rút ETH):
   - Triển khai contract `contracts/SimpleBank.sol` lên Sepolia testnet (xem `DEPLOY_GUIDE.md`).
   - Sao chép địa chỉ contract và cập nhật giá trị `SIMPLE_BANK_ADDRESS` trong `src/app.js`.
   - Làm mới trang, bạn sẽ thấy phần "Smart Contract - Nạp/Rút ETH" kích hoạt.
4. Dùng các nút **Refresh Balance** và **Send ETH** để thao tác giao dịch thông thường.
5. Dùng **Deposit/Withdraw** để tương tác với smart contract.
6. Theo dõi bảng thị trường, gas fee và dùng nút **Tải JSON** nếu muốn lưu lịch sử cục bộ xuống máy.

> Lưu ý: Giao dịch testnet có thể mất vài chục giây để được xác nhận. Liên kết Etherscan trong phần kết quả giúp bạn kiểm tra tiến trình.

## Cấu trúc Dự án

```
c:\Blockchainv2\
├── index.html          # Giao diện chính
├── styles.css          # CSS tùy chỉnh
├── README.md           # Tài liệu này
├── DEPLOY_GUIDE.md     # Hướng dẫn deploy smart contract
├── src/
│   ├── app.js          # Lôgic ứng dụng (MetaMask, transactions, contract)
│   └── abi/
│       └── SimpleBank.json  # ABI của smart contract
└── contracts/
    └── SimpleBank.sol   # Mã nguồn smart contract
```

## Hướng dẫn Deploy Smart Contract

Xem file `DEPLOY_GUIDE.md` để các bước chi tiết triển khai `SimpleBank.sol` lên Sepolia testnet bằng Remix IDE.

Sau khi deploy:
1. Sao chép địa chỉ contract từ Remix.
2. Cập nhật `SIMPLE_BANK_ADDRESS` trong `src/app.js` (dòng khoảng 6).
3. Làm mới trang - UI sẽ tự động kích hoạt.
