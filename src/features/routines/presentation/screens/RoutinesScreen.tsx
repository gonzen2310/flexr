import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function RoutinesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Routines</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  label: { fontSize: 28, fontWeight: '600', color: '#111' },
});
