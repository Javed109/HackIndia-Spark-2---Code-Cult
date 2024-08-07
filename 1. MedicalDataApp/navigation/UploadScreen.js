import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { ethers } from 'ethers';
import MedicalData from '../contracts/MedicalData.json';

const UploadScreen = () => {
  const [data, setData] = useState('');

  const handleUpload = async () => {
    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545');
    const signer = provider.getSigner();
    const contract = new ethers.Contract(MedicalData.networks['5777'].address, MedicalData.abi, signer);
    await contract.uploadData(data);
    console.log('Data uploaded:', data);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Upload Medical Data</Text>
      <TextInput
        placeholder="Enter medical data"
        value={data}
        onChangeText={setData}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, width: '80%' }}
      />
      <Button title="Upload" onPress={handleUpload} />
    </View>
  );
};

export default UploadScreen;
