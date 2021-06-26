import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/homeScreen';
import ViewObjects from './screens/viewObjects';




export default function App() {

  const Stack = createStackNavigator();
  
  return (
    <SafeAreaProvider style={{backgroundColor: "#F9FAFB"}}> 
      <NavigationContainer style={{backgroundColor: "#F9FAFB"}}>
      <StatusBar hidden={true} />
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ViewObjects" component={ViewObjects} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
