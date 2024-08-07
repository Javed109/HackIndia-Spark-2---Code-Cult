const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const contract = require('@truffle/contract');
const MedicalDataJSON = require('./build/contracts/MedicalData.json');

const app = express();
app.use(bodyParser.json());

// Connect to the local Ethereum blockchain
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

// Setup the contract
const MedicalData = contract(MedicalDataJSON);
MedicalData.setProvider(web3.currentProvider);

// Upload medical data
app.post('/upload', async (req, res) => {
  const { content, account } = req.body;
  try {
    const instance = await MedicalData.deployed();
    await instance.uploadData(content, { from: account });
    res.send('Data uploaded successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update consent
app.post('/consent', async (req, res) => {
  const { index, consent, account } = req.body;
  try {
    const instance = await MedicalData.deployed();
    await instance.updateConsent(index, consent, { from: account });
    res.send('Consent updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get data record
app.get('/data/:index', async (req, res) => {
  const { index } = req.params;
  try {
    const instance = await MedicalData.deployed();
    const data = await instance.getData(index);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get total number of data records
app.get('/dataCount', async (req, res) => {
  try {
    const instance = await MedicalData.deployed();
    const count = await instance.getDataCount();
    res.send({ count });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
