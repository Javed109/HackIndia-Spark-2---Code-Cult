import React, { useState } from 'react';
import { View, Text, Button, Switch } from 'react-native';
import { ethers } from 'ethers';
import MedicalData from '../contracts/MedicalData.json';

const ConsentScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleSaveConsent = async () => {
    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545');
    const signer = provider.getSigner();
    const contract = new ethers.Contract(MedicalData.networks['5777'].address, MedicalData.abi, signer);
    await contract.giveConsent(0, isEnabled); // Assume index 0 for simplicity
    console.log('Consent saved:', isEnabled);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Manage Consent</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <Button title="Save Consent" onPress={handleSaveConsent} />
    </View>
  );
};

export default ConsentScreen;
