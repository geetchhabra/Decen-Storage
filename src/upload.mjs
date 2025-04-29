import path from 'path';
import { ethers } from 'ethers';
import fs from 'fs'; 
import { create } from 'ipfs-http-client';
import crypto from 'crypto';

import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Initialize IPFS (ensure you have the right IPFS instance setup)
const ipfs = create({ url: 'http://127.0.0.1:5001/api/v0' });
import { CID } from 'multiformats/cid';
// Contract details
const contractAddress = "Contract Address";
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

const wallet = new ethers.Wallet("Wallet Address", provider);
import { createGarbageFolder, deleteGarbageFolder} from './garbageFolder.mjs';


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

const GB_TO_BYTES = 1_073_741_824;  // 1 GB in bytes

/**
 * Convert GB to bytes.
 * @param {number} storageSizeGB - The amount of storage in GB.
 * @returns {number} - The equivalent size in bytes.
 */

/**
* Contribute storage and create a garbage folder.
* @param {number} storageSizeGB - The amount of storage to contribute in GB.
*/

function encryptFile(filePath, key) {
  const fileContent = fs.readFileSync(filePath);
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(fileContent);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const encryptedFilePath = `${filePath}.enc`;
  fs.writeFileSync(encryptedFilePath, Buffer.concat([iv, encrypted]));
  
  // Save the key and IV to a file (for demonstration purposes)
  fs.writeFileSync('key_iv.json', JSON.stringify({
    key: key.toString('hex'),
    iv: iv.toString('hex'),
  }));

  //console.log(`File encrypted and saved as ${encryptedFilePath}`);
  return encryptedFilePath;
}


async function pinFileLocally(hash) {
  const cid = CID.parse(hash); // Parse the hash to a CID
  const result = await ipfs.pin.add(cid);
  //console.log(`File pinned locally: ${result}`);
}



/**
* Upload a file to IPFS and store its metadata on the blockchain.
* @param {string} filePath - Path to the file to upload.
*/
// Upload a file to IPFS and update the garbage folder
async function uploadFile(filePath, selectedContributor, basePath) {
  try {
    const fileContent = fs.readFileSync(filePath);

    // Use a timeout in case the IPFS add operation hangs
    const { cid } = await ipfs.add(fileContent);

    console.log(`File uploaded to IPFS with hash: ${cid.toString()}`);

    // ✅ Store file metadata on the blockchain with contributor address
    const tx = await contract.storeFileHash(selectedContributor, cid.toString(), fileContent.length);
    console.log('File metadata stored on blockchain:', tx.hash);
    await tx.wait();

    // ✅ Fetch the available storage for the correct contributor
    const availableStorageInBytes = await fetchAvailableStorage(contract, selectedContributor);
    const availableSpaceInGB = Number(availableStorageInBytes) / (1024 ** 3);

    console.log(`Available storage for contributor: ${availableSpaceInGB.toFixed(2)} GB.`);

    // ✅ Ensure old garbage folder is deleted before creating a new one
    await deleteGarbageFolder(basePath);
    await createGarbageFolder(basePath, availableSpaceInGB);

    return cid.toString();
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
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
    const availableStorage = await fetchAvailableStorage(contract, contributor);

    const availableStorageInGB = Number(availableStorage) / GB_TO_BYTES;
    //console.log(`Contributor ${contributor} has ${availableStorageInGB.toFixed(2)} GB available.`);

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

const testFilePath = './test.txt';
const basePath = path.join(__dirname, '..', 'storage');
const encryptionKey = Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex');

async function Uploadmain() {
  try {
    // Fetch uploader address
    const uploaderAddress = await wallet.getAddress();
    console.log(`Uploader Address: ${uploaderAddress}`);

    // Fetch contributors
    const contributors = await contract.getContributors();

    // Find the best contributor
    const selectedContributor = await findMaxStorageContributor(contributors);

    if (selectedContributor) {
      console.log(`Selected Contributor: ${selectedContributor}`);

      // Encrypt the file before uploading
      const encryptedFilePath = encryptFile(testFilePath, encryptionKey);
      console.log('Encrypting file...');
      console.log(`File encrypted successfully and saved as: ${encryptedFilePath}`);

      // Upload the encrypted file to IPFS
      console.log('Uploading file to IPFS...');
      const ipfsHash = await uploadFile(encryptedFilePath, selectedContributor, basePath);
      console.log(`File uploaded successfully to IPFS!`);
      console.log(`IPFS Hash: ${ipfsHash}`);

      // Pin the file locally
      console.log("Pinning file locally on Contributor's device...");
      await pinFileLocally(ipfsHash);
      console.log(` File pinned successfully!`);
      console.log(`Pinned IPFS Hash: ${ipfsHash}`);

      console.log(' **File successfully uploaded, stored, and pinned!**');
    } else {
      console.log('No contributor found with sufficient storage.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


Uploadmain().catch(console.error);







