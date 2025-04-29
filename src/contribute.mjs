import path from 'path';
import { ethers } from 'ethers';
import fs from 'fs'; // Assuming fs module is used to read file
import { create } from 'ipfs-http-client';
import crypto from 'crypto';
// Initialize IPFS (ensure you have the right IPFS instance setup)
const ipfs = create({ url: 'http://127.0.0.1:5001/api/v0' });
import { CID } from 'multiformats/cid';
// Contract details
const contractAddress = "0x780460b50301fEA5756173790558A174a2c4232E";
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
const wallet = new ethers.Wallet("98d0341abb1dcb0e7d0ae33e2e2f152a30a4d338157f6af64488bb7c0852c2c7", provider);
//const wallet = new ethers.Wallet("0xa92c8e3cead1e1080275c42723cb8c32b27233f87a14a2c30e72f0759b73d99c", provider);
//const wallet = new ethers.Wallet("0x6f82adc9086e8dda6b73fe828d345c87de456dec56f18b23c59f366c1d4d6bc0", provider);


import { createGarbageFolder, deleteGarbageFolder } from './garbageFolder.mjs';


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

// Directory for garbage folders
const storageBasePath = path.resolve('./storage');

const GB_TO_BYTES = 1_073_741_824;  // 1 GB in bytes

/**
 * Convert GB to bytes.
 * @param {number} storageSizeGB - The amount of storage in GB.
 * @returns {number} - The equivalent size in bytes.
 */
function convertGBToBytes(storageSizeGB) {
  return Math.round(storageSizeGB * GB_TO_BYTES);
}



/**
 * Contribute storage and create a garbage folder.
 * @param {number} storageSizeGB - The amount of storage to contribute in GB.
 */
async function contributeStorage(storageSizeGB) {
  try {
    const storageSizeInBytes = convertGBToBytes(storageSizeGB);

    // Step 1: Create a unique garbage folder/file
    await createGarbageFolder(storageBasePath, storageSizeGB);

    // Step 2: Interact with the smart contract to contribute storage
    const tx = await contract.contributeStorage(storageSizeInBytes);  // Pass bytes instead of GB
    console.log('Transaction hash:', tx.hash);
    await tx.wait();

    console.log(`Successfully contributed ${storageSizeGB} GB of storage.`);
  } catch (error) {
    console.error('Error contributing storage:', error);
  }
}



/**
 * Fetch available storage for a specific contributor.
 * @param {ethers.Contract} contract - The smart contract instance.
 * @param {string} contributorAddress - The contributor's wallet address.
 */
async function fetchAvailableStorage(contract, contributorAddress) {
  try {
    const availableStorageInBytes = await contract.getAvailableStorage(contributorAddress); // Fetch storage
    return availableStorageInBytes;
  } catch (error) {
    console.error(`Error fetching available storage for ${contributorAddress}:`, error);
    return BigInt(0);
  }
}


/**
* Find the contributor with the maximum available storage.
* @param {Array} contributors - Array of contributor addresses.
* @returns {Promise<string>} - Address of the contributor with the maximum available storage.
*/
async function findMaxStorageContributor(contributors) {
  let maxStorage = BigInt(0);
  let selectedContributor = null;

  for (const contributor of contributors) {
    // Pass the contributor's address instead of the wallet address
    const availableStorage = await fetchAvailableStorage(contract, contributor);

    // Convert BigInt to GB for logging
    const availableStorageInGB = Number(availableStorage) / GB_TO_BYTES;
    console.log(`Contributor ${contributor} has ${availableStorageInGB.toFixed(2)} GB available.`);

    // Keep the comparison in BigInt
    if (availableStorage > maxStorage) {
      maxStorage = availableStorage;
      selectedContributor = contributor;
    }
  }

  return selectedContributor;
}

/**
* Main function to execute the entire flow.
*/
const storageSizeGB = 1.2;

async function Contributemain() {
 
  try {
    const contributorAddress = await wallet.getAddress();
    console.log(`Contributor Address: ${contributorAddress}`);
    // Fetch contributors
    const contributors = await contract.getContributors();

    // Contribute storage
    await contributeStorage(storageSizeGB);

    const availableStorageInBytes = await fetchAvailableStorage(contract, contributorAddress);
  const availableSpaceInGB = Number(availableStorageInBytes) / (1024 ** 3);

  console.log(`Available storage for contributor: ${availableSpaceInGB.toFixed(2)} GB.`);

   } catch (error) {
     console.error('Error during the process:', error);
   }
}

Contributemain().catch(console.error);







