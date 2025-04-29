import { create } from 'ipfs-http-client';

const ipfs = create({ url: 'http://127.0.0.1:5001/api/v0' });

async function uploadFile(file) {
    const added = await ipfs.add(file);
    console.log('File uploaded to IPFS with CID:', added.cid.toString());
    return added.cid.toString();
}

const file = Buffer.from("Hello, this is a test file.");
uploadFile(file).then(cid => {
    console.log("File CID:", cid);
});
