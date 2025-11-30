// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SimpleBank
 * @dev Một smart contract đơn giản cho phép người dùng nạp (deposit) và rút (withdraw) ETH
 * Lưu số dư riêng cho mỗi địa chỉ và phát hành Events để theo dõi lịch sử
 */

contract SimpleBank {
    // Lưu số dư ETH của mỗi địa chỉ
    mapping(address => uint256) public balances;

    // Tổng số dư trong contract
    uint256 public totalBalance;

    // Số lượng người dùng
    uint256 public userCount;

    // Lưu danh sách các địa chỉ đã từng sử dụng (không bắt buộc, để tham khảo)
    address[] public users;

    // Events để theo dõi hoạt động
    event Deposit(address indexed user, uint256 amount, uint256 newBalance);
    event Withdraw(address indexed user, uint256 amount, uint256 newBalance);
    event BalanceQueried(address indexed user, uint256 balance);

    /**
     * @dev Cho phép người dùng nạp ETH vào contract
     * Yêu cầu: msg.value > 0
     */
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");

        // Nếu là người dùng mới, thêm vào danh sách
        if (balances[msg.sender] == 0) {
            users.push(msg.sender);
            userCount++;
        }

        // Cập nhật số dư
        balances[msg.sender] += msg.value;
        totalBalance += msg.value;

        emit Deposit(msg.sender, msg.value, balances[msg.sender]);
    }

    /**
     * @dev Cho phép người dùng rút ETH từ contract
     * @param amount Số tiền ETH muốn rút (tính bằng wei)
     */
    function withdraw(uint256 amount) public {
        require(amount > 0, "Withdraw amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // Cập nhật số dư trước khi gửi ETH (để tránh reentrancy attack)
        balances[msg.sender] -= amount;
        totalBalance -= amount;

        // Gửi ETH về cho người dùng
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");

        emit Withdraw(msg.sender, amount, balances[msg.sender]);
    }

    /**
     * @dev Lấy số dư ETH của một địa chỉ
     * @param account Địa chỉ cần kiểm tra
     * @return Số dư ETH (tính bằng wei)
     */
    function getBalance(address account) public returns (uint256) {
        emit BalanceQueried(account, balances[account]);
        return balances[account];
    }

    /**
     * @dev Lấy số dư của người gọi hàm
     * @return Số dư ETH (tính bằng wei)
     */
    function getMyBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    /**
     * @dev Lấy tổng số dư trong contract (dành cho monitoring)
     * @return Tổng số dư ETH trong contract
     */
    function getTotalBalance() public view returns (uint256) {
        return totalBalance;
    }

    /**
     * @dev Fallback function cho phép gửi ETH trực tiếp vào contract
     * Nếu không có data, sẽ được coi là deposit
     */
    receive() external payable {
        deposit();
    }
}
