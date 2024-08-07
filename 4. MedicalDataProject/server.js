const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Web3 = require('web3');

// Load environment variables
dotenv.config();

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  ethereumAddress: String
});

const medicalDataSchema = new mongoose.Schema({
  owner: String,
  content: String,
  consent: Boolean
});

const User = mongoose.model('User', userSchema);
const MedicalData = mongoose.model('MedicalData', medicalDataSchema);

// Web3 setup
const web3 = new Web3('https://ropsten.infura.io/v3/YOUR_INFURA_PROJECT_ID');

// Middleware for checking JWT
const authenticate = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};

// User registration
app.post('/register', async (req, res) => {
  const { username, password, ethereumAddress } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let user = new User({ username, password: hashedPassword, ethereumAddress });
  user = await user.save();
  res.send(user);
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send('Invalid username or password.');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid username or password.');

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.send({ token });
});

// Upload medical data
app.post('/upload', authenticate, async (req, res) => {
  const { content } = req.body;
  const newData = new MedicalData({
    owner: req.user._id,
    content,
    consent: false
  });
  await newData.save();
  res.send('Data uploaded successfully');
});

// Update consent
app.post('/consent', authenticate, async (req, res) => {
  const { id, consent } = req.body;
  await MedicalData.findByIdAndUpdate(id, { consent });
  res.send('Consent updated successfully');
});

// Get medical data
app.get('/data/:id', authenticate, async (req, res) => {
  const data = await MedicalData.findById(req.params.id);
  res.send(data);
});

// Get all medical data
app.get('/data', authenticate, async (req, res) => {
  const data = await MedicalData.find({ owner: req.user._id });
  res.send(data);
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

