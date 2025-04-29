import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import fs from 'fs';
import { Buffer } from 'buffer';
import { createDecipheriv } from 'crypto';  


// Initialize IPFS (ensure you have the right IPFS instance setup)
const ipfs = create({ url: 'http://127.0.0.1:5001/api/v0' });
// Contract details
const contractAddress = "0x780460b50301fEA5756173790558A174a2c4232E";
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
//const wallet = new ethers.Wallet("98d0341abb1dcb0e7d0ae33e2e2f152a30a4d338157f6af64488bb7c0852c2c7", provider);
//const wallet = new ethers.Wallet("0xa92c8e3cead1e1080275c42723cb8c32b27233f87a14a2c30e72f0759b73d99c", provider);
const wallet = new ethers.Wallet("0x6f82adc9086e8dda6b73fe828d345c87de456dec56f18b23c59f366c1d4d6bc0", provider);


// Smart contract ABI and address
const contractABI = [{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "initialSupply",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "_rewardRate",
      "type": "uint256"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "allowance",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "needed",
      "type": "uint256"
    }
  ],
  "name": "ERC20InsufficientAllowance",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "sender",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "balance",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "needed",
      "type": "uint256"
    }
  ],
  "name": "ERC20InsufficientBalance",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "approver",
      "type": "address"
    }
  ],
  "name": "ERC20InvalidApprover",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "receiver",
      "type": "address"
    }
  ],
  "name": "ERC20InvalidReceiver",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "sender",
      "type": "address"
    }
  ],
  "name": "ERC20InvalidSender",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    }
  ],
  "name": "ERC20InvalidSpender",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    }
  ],
  "name": "OwnableInvalidOwner",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  "name": "OwnableUnauthorizedAccount",
  "type": "error"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "spender",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }
  ],
  "name": "Approval",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "uploader",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "bytes32",
      "name": "fileId",
      "type": "bytes32"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "fileSize",
      "type": "uint256"
    }
  ],
  "name": "FileUploaded",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "previousOwner",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }
  ],
  "name": "OwnershipTransferred",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "user",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "reward",
      "type": "uint256"
    }
  ],
  "name": "StorageContributed",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }
  ],
  "name": "Transfer",
  "type": "event"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    }
  ],
  "name": "allowance",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }
  ],
  "name": "approve",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  "name": "balanceOf",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "contributors",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "decimals",
  "outputs": [
    {
      "internalType": "uint8",
      "name": "",
      "type": "uint8"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ],
  "name": "files",
  "outputs": [
    {
      "internalType": "string",
      "name": "fileHash",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "fileSize",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "uploader",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "maxFileSize",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "name",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "owner",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "rewardRate",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "symbol",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "totalContributedStorage",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "totalSupply",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "totalUsedStorage",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }
  ],
  "name": "transfer",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }
  ],
  "name": "transferFrom",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }
  ],
  "name": "transferOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "uploadedFiles",
  "outputs": [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "userFiles",
  "outputs": [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "name": "users",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "contributedStorage",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "usedStorage",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "rewardBalance",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "storageAmount",
      "type": "uint256"
    }
  ],
  "name": "contributeStorage",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "contributor",
      "type": "address"
    },
    {
      "internalType": "string",
      "name": "ipfsHash",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "fileSize",
      "type": "uint256"
    }
  ],
  "name": "storeFileHash",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "user",
      "type": "address"
    }
  ],
  "name": "getAvailableStorage",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "user",
      "type": "address"
    }
  ],
  "name": "getUserFiles",
  "outputs": [
    {
      "internalType": "bytes32[]",
      "name": "",
      "type": "bytes32[]"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "uploader",
      "type": "address"
    }
  ],
  "name": "getUploadedFiles",
  "outputs": [
    {
      "internalType": "bytes32[]",
      "name": "",
      "type": "bytes32[]"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "bytes32",
      "name": "fileId",
      "type": "bytes32"
    }
  ],
  "name": "getFileDetails",
  "outputs": [
    {
      "internalType": "string",
      "name": "fileHash",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "fileSize",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "uploader",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "getContributors",
  "outputs": [
    {
      "internalType": "address[]",
      "name": "",
      "type": "address[]"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "rewardAllContributors",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}];
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function getFileDetailsInTable(userAddress) {
  try {
    console.log(`Files uploaded by user ${userAddress}:`);
    const fileIds = await contract.getUploadedFiles(userAddress);

    if (fileIds.length === 0) {
      console.log('No files found for this user.');
      return;
    }

    const files = [];

    for (const fileId of fileIds) {
      const details = await contract.getFileDetails(fileId);
      files.push({
        'File ID': fileId,
        'IPFS Hash': details.fileHash,
        'File Size (bytes)': details.fileSize,
      });
    }

    console.table(files);

    // Prompt user to select a file
    const selectedFile = files[0];  // Replace with dynamic user input
    console.log(`\nUser selected file with File ID: ${selectedFile['File ID']}`);
    console.log(`IPFS Hash: ${selectedFile['IPFS Hash']}`);

    // Retrieve and decrypt the selected file
    await retrieveAndDecryptFile(selectedFile['IPFS Hash']);
  } catch (error) {
    console.error('Error fetching file details:', error);
  }
}




// Function to retrieve and decrypt a file
async function retrieveAndDecryptFile(ipfsHash) {
  try {
      const { key, iv } = JSON.parse(fs.readFileSync('key_iv.json'));
      const encryptionKey = Buffer.from(key, 'hex');
      const initializationVector = Buffer.from(iv, 'hex');

      const fileStream = ipfs.cat(ipfsHash);
      let fileContent = Buffer.alloc(0);

      for await (const chunk of fileStream) {
          fileContent = Buffer.concat([fileContent, chunk]);
      }

      const encryptedContent = fileContent.slice(16);
      const decipher = createDecipheriv('aes-256-cbc', encryptionKey, initializationVector);
      let decrypted = decipher.update(encryptedContent);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      const decryptedFilePath = 'retrieved-decrypted-file.txt';
      fs.writeFileSync(decryptedFilePath, decrypted);
      console.log(`Decrypted file saved as ${decryptedFilePath}`);
  } catch (error) {
      console.error('Error retrieving or decrypting file:', error);
  }
}

// Example usage
const userAddress = '0xCa820EAfFaBdDEc4Cd30ff3391A69a01F415685c';  // Replace with the actual user address
getFileDetailsInTable(userAddress);