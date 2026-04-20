import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { enableScreens } from 'react-native-screens';
import { Providers } from './providers';
import { RootNavigator } from '../navigation/RootNavigator';

enableScreens(false);

export default function App() {
  return (
    <Providers>
      <StatusBar style="dark" />
      <RootNavigator />
    </Providers>
  );
}
