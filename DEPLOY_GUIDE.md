# Hướng dẫn Deploy Smart Contract SimpleBank lên Sepolia Testnet

## Bước 1: Chuẩn bị
Bạn sẽ cần:
- **Remix IDE** (https://remix.ethereum.org) - IDE online miễn phí để viết & deploy Solidity
- **MetaMask** - đã cài và có sẵn ETH Sepolia testnet
- File `SimpleBank.sol` từ thư mục `contracts/`

## Bước 2: Deploy trên Remix IDE

### 2.1 Mở Remix IDE
1. Truy cập https://remix.ethereum.org
2. Tạo file mới: `File → New File` → đặt tên `SimpleBank.sol`
3. Copy toàn bộ code từ file `contracts/SimpleBank.sol` vào

### 2.2 Compile Smart Contract
1. Click vào tab **"Solidity Compiler"** (biểu tượng hình tam giác)
2. Chọn compiler version: `0.8.0` hoặc cao hơn
3. Click **"Compile SimpleBank.sol"**
4. Nếu thấy dấu tích xanh = compile thành công ✅

### 2.3 Deploy Contract
1. Click tab **"Deploy & Run Transactions"** (biểu tượng hình rocket)
2. Trong dropdown **"Environment"**, chọn **"Injected Provider - MetaMask"**
3. MetaMask sẽ popup yêu cầu cho phép kết nối → chọn **"Connect"**
4. Kiểm tra trong Remix: **"Account"** hiển thị địa chỉ ví của bạn
5. Kiểm tra **"Network"** hiển thị **"Sepolia (11155111)"**
6. Click nút **"Deploy"** (màu xanh) cạnh "SimpleBank"
7. MetaMask sẽ popup giao dịch deploy → kiểm tra gas fee rồi click **"Confirm"**
8. Chờ ~30 giây để transaction confirm

### 2.4 Copy Contract Address
Sau khi deploy thành công:
1. Trong Remix, dưới tab "Deployed Contracts", bạn sẽ thấy instance của SimpleBank
2. Click vào biểu tượng **"Copy"** (cạnh địa chỉ contract)
3. **Lưu địa chỉ này** - cần dùng trong app để gọi contract

**Ví dụ địa chỉ contract:**
```
0x1234567890123456789012345678901234567890
```

## Bước 3: Lấy ABI (Application Binary Interface)

Để app JavaScript có thể gọi smart contract, cần lấy ABI:

1. Trong Remix, click tab **"Solidity Compiler"**
2. Click biểu tượng **"Copy ABI"** (nằm dưới nút Compile)
3. Dán ABI vào file `src/abi/SimpleBank.json` (mình sẽ chuẩn bị sẵn)

**ABI sẽ trông như thế này:**
```json
[
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  ...
]
```

## Bước 4: Cập nhật Contract Address trong App

Sau khi có contract address:
1. Mở file `src/app.js`
2. Tìm dòng: `const SIMPLE_BANK_ADDRESS = '...';`
3. Thay bằng địa chỉ contract của bạn:
```javascript
const SIMPLE_BANK_ADDRESS = '0x1234567890123456789012345678901234567890';
```

## Bước 5: Test trên App

1. Refresh trang app
2. Connect MetaMask (chọn Sepolia)
3. Scroll tới phần **"Nạp/Rút từ Smart Contract"**
4. Nhập số ETH muốn nạp → Click **"Deposit"**
5. Xác nhận trên MetaMask
6. Chờ ~30 giây, số dư on-chain sẽ cập nhật
7. Test rút: nhập số ETH → Click **"Withdraw"**

## Troubleshooting

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-----------|---------|
| "Injected Provider not found" | MetaMask chưa kết nối | Mở MetaMask, chọn Sepolia |
| "Insufficient balance" | Không đủ gas | Lấy thêm ETH từ faucet |
| Contract không hiển thị | Chưa deploy | Quay lại Bước 2.3 |
| "call failed" khi Withdraw | Số dư không đủ | Kiểm tra lại số dư |

## Ghi chú

- ✅ Tất cả transaction miễn phí trên testnet
- ✅ Nếu muốn deploy lại, chỉ cần làm lại từ Bước 2.3 (sẽ có địa chỉ mới)
- ✅ Events sẽ được ghi trên blockchain - có thể xem trên Etherscan Sepolia
