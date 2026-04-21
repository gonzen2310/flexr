import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const HEADER_ACTION_SIZE = 28;


export function NewScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity activeOpacity={0.8} style={styles.headerBackButton}>
            <Ionicons name="arrow-back-circle" size={HEADER_ACTION_SIZE} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Routine</Text>
          <TouchableOpacity activeOpacity={0.8} style={styles.headerSaveButton}>
            <Text style={styles.headerSave}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.routineCard}>
          <Text style={styles.routineCardLabel}>ROUTINE NAME</Text>
          <TextInput
            defaultValue="Quick abs"
            placeholder="Routine name"
            placeholderTextColor="#9B9B9B"
            style={styles.routineInput}
          />
        </View>

        <Text style={styles.sectionLabel}>CIRCUIT STRUCTURE</Text>
        <View style={styles.card}>
          <View style={styles.structureRow}>
            <Text style={styles.structureLabel}>Rounds</Text>
            <View style={styles.structureValueWrap}>
              <Text style={styles.operator}>-</Text>
              <Text style={styles.structureValue}>1</Text>
              <TouchableOpacity activeOpacity={0.8} style={styles.plusBtn}>
                <Text style={styles.plusText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.structureRow}>
            <Text style={styles.structureLabel}>Rest between rounds</Text>
            <View style={styles.structureValueWrap}>
              <Text style={styles.operator}>-</Text>
              <Text style={styles.structureValue}>20s</Text>
              <TouchableOpacity activeOpacity={0.8} style={styles.plusBtn}>
                <Text style={styles.plusText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>EXERCISES</Text>
        <View style={styles.exerciseArtWrap}>
          <View style={styles.exerciseArt}>
            <Text style={styles.exerciseArtText}>Exercise Preview</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add Excercise</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.85} style={styles.startBtn}>
          <Text style={styles.startBtnText}>START</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.85} style={styles.saveRoutineBtn}>
          <Text style={styles.saveRoutineBtnText}>SAVE ROUTINE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 160,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  headerBackButton: {
    width: 90,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerAction: {
    fontSize: 16,
    color: '#222',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#171717',
  },
  headerSaveButton: {
    width: 90,
    alignItems: 'flex-end',
  },
  headerSave: {
    fontSize: 24,
    fontWeight: '600',
    color: '#7363FF',
  },
  sectionLabel: {
    fontSize: 29,
    fontWeight: '700',
    color: '#9A9A9A',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: '#E7E7E7',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 22,
  },
  routineCard: {
    backgroundColor: '#E7E7E7',
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    marginBottom: 24,
  },
  routineCardLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#8F8F8F',
    letterSpacing: 0.3,
    marginBottom: -26,
  },
  routineInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#121212',
    lineHeight: 56,
    paddingVertical: 0,
  },
  structureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  structureLabel: {
    fontSize: 36,
    color: '#212121',
  },
  structureValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  operator: {
    fontSize: 36,
    color: '#232323',
  },
  structureValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#161616',
    minWidth: 50,
    textAlign: 'right',
  },
  plusBtn: {
    backgroundColor: '#8F82EA',
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: -2,
  },
  separator: {
    height: 1,
    backgroundColor: '#D3D3D3',
  },
  exerciseArtWrap: {
    borderWidth: 2,
    borderColor: '#2692E8',
    marginBottom: 20,
  },
  exerciseArt: {
    backgroundColor: '#F0F0F0',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseArtText: {
    color: '#7E7E7E',
    fontSize: 18,
    fontWeight: '500',
  },
  addBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#B6B6B6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    marginBottom: 12,
    backgroundColor: '#F8F8F8',
  },
  addBtnText: {
    fontSize: 34,
    color: '#1E1E1E',
  },
  startBtn: {
    borderRadius: 16,
    backgroundColor: '#9386EC',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    marginBottom: 8,
  },
  startBtnText: {
    fontSize: 31,
    color: '#FFF',
    fontWeight: '500',
  },
  saveRoutineBtn: {
    borderRadius: 16,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
  },
  saveRoutineBtnText: {
    fontSize: 31,
    color: '#FFF',
    fontWeight: '500',
  },
});
