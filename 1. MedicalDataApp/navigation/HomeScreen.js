import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Welcome to Medical Data Management</Text>
    <Button
      title="Upload Medical Data"
      onPress={() => navigation.navigate('Upload')}
    />
    <Button
      title="Manage Consent"
      onPress={() => navigation.navigate('Consent')}
    />
  </View>
);

export default HomeScreen;
