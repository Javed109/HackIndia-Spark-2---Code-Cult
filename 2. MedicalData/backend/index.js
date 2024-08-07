const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const contract = require('truffle-contract');
const MedicalDataJSON = require('./build/contracts/MedicalData.json');

const app = express();
app.use(bodyParser.json());

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

const MedicalData = contract(MedicalDataJSON);
MedicalData.setProvider(web3.currentProvider);

app.post('/upload', async (req, res) => {
  const { content, account } = req.body;
  const instance = await MedicalData.deployed();
  await instance.uploadData(content, { from: account });
  res.send('Data uploaded successfully');
});

app.post('/consent', async (req, res) => {
  const { index, consent, account } = req.body;
  const instance = await MedicalData.deployed();
  await instance.giveConsent(index, consent, { from: account });
  res.send('Consent updated successfully');
});

app.get('/data/:index', async (req, res) => {
  const { index } = req.params;
  const instance = await MedicalData.deployed();
  const data = await instance.getData(index);
  res.send(data);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
