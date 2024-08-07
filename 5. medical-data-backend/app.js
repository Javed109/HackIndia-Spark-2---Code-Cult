const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const contractABI = require('./MedicalDataABI.json');
const contractAddress = 'YOUR_CONTRACT_ADDRESS';

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/medicalData', { useNewUrlParser: true, useUnifiedTopology: true });

const recordSchema = new mongoose.Schema({
  recordId: String,
  owner: String,
  dataHash: String,
  timestamp: Number
});

const Record = mongoose.model('Record', recordSchema);

const provider = new HDWalletProvider('YOUR_MNEMONIC', 'https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID');
const web3 = new Web3(provider);
const contract = new web3.eth.Contract(contractABI, contractAddress);

app.post('/upload', async (req, res) => {
  try {
    const { owner, data } = req.body;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    const recordId = crypto.randomBytes(16).toString('hex');

    const accounts = await web3.eth.getAccounts();
    await contract.methods.addRecord(recordId, hash).send({ from: accounts[0] });

    const newRecord = new Record({ recordId, owner, dataHash: hash, timestamp: Date.now() });
    await newRecord.save();

    res.status(200).send('Data uploaded and stored on blockchain');
  } catch (error) {
    res.status(500).send('Error uploading data');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
