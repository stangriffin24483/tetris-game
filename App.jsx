import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import TetrisGame from './TetrisGame';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <TetrisGame />
    </SafeAreaView>
  );
}
