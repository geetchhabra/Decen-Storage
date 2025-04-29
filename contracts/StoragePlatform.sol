// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StoragePlatform is ERC20, Ownable {
    struct User {
        uint256 contributedStorage; // Total storage contributed in GB
        uint256 usedStorage;        // Storage currently used in GB
        uint256 rewardBalance;      // Reward balance in tokens
    }

    struct File {
        string fileHash;    // File hash (e.g., IPFS CID)
        uint256 fileSize;   // File size in bytes
        address uploader;   // Address of the uploader
    }

    address[] public contributors;

    mapping(address => User) public users;               // User storage data
    mapping(bytes32 => File) public files;               // File metadata
    mapping(address => bytes32[]) public userFiles;      // Files stored on a contributor's storage
    mapping(address => bytes32[]) public uploadedFiles;  // Files uploaded by a user

    uint256 public rewardRate;
    uint256 public totalContributedStorage;
    uint256 public totalUsedStorage;
    uint256 public maxFileSize = 100 * 1024 * 1024;

    event StorageContributed(address indexed user, uint256 amount, uint256 reward);
    event FileUploaded(address indexed uploader, bytes32 fileId, uint256 fileSize);

    constructor(uint256 initialSupply, uint256 _rewardRate) ERC20("StorageToken", "STT") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
        rewardRate = _rewardRate;
    }

    function contributeStorage(uint256 storageAmount) external {
        require(storageAmount > 0, "Storage amount must be greater than zero");

        uint256 reward = storageAmount * rewardRate;
        _mint(msg.sender, reward);

        if (users[msg.sender].contributedStorage == 0) {
            contributors.push(msg.sender);
        }

        users[msg.sender].contributedStorage += storageAmount;
        users[msg.sender].rewardBalance += reward;
        totalContributedStorage += storageAmount;

        emit StorageContributed(msg.sender, storageAmount, reward);
    }

    function storeFileHash(address contributor, string memory ipfsHash, uint256 fileSize) external {
        require(fileSize > 0, "File size must be greater than zero");
        require(fileSize <= maxFileSize, "File size exceeds the maximum allowed size");
        require(
            users[contributor].usedStorage + fileSize <= users[contributor].contributedStorage,
            "Insufficient available storage"
        );

        bytes32 fileId = keccak256(abi.encodePacked(ipfsHash, contributor, block.timestamp));
        files[fileId] = File(ipfsHash, fileSize, msg.sender);

        // Track files stored on contributor's storage
        userFiles[contributor].push(fileId);

        // Track files uploaded by uploader
        uploadedFiles[msg.sender].push(fileId);

        users[contributor].usedStorage += fileSize;
        totalUsedStorage += fileSize;

        emit FileUploaded(msg.sender, fileId, fileSize);
    }

    function getAvailableStorage(address user) external view returns (uint256) {
        return users[user].contributedStorage - users[user].usedStorage;
    }

    function getUserFiles(address user) external view returns (bytes32[] memory) {
        return userFiles[user];
    }

    function getUploadedFiles(address uploader) external view returns (bytes32[] memory) {
        return uploadedFiles[uploader];
    }

    function getFileDetails(bytes32 fileId) external view returns (string memory fileHash, uint256 fileSize, address uploader) {
        File memory file = files[fileId];
        return (file.fileHash, file.fileSize, file.uploader);
    }

    function getContributors() public view returns (address[] memory) {
        return contributors;
    }

    function rewardAllContributors() external onlyOwner {
        for (uint256 i = 0; i < contributors.length; i++) {
            address contributor = contributors[i];
            uint256 reward = users[contributor].contributedStorage * rewardRate;
            _mint(contributor, reward);
        }
    }
}
