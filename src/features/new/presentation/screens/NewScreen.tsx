import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { RouteProp } from '@react-navigation/native';

import type { TabParamList } from '../../../../navigation/types';

type NewScreenRouteProp = RouteProp<TabParamList, 'New'>;

type NewScreenProps = {
  route: NewScreenRouteProp;
};

export function NewScreen({ route }: NewScreenProps) {
  const label = route.params?.label ?? 'New';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  label: { fontSize: 28, fontWeight: '600', color: '#111' },
});
