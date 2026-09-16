import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../theme';
import {
  ALL_EXPERIENCE_LEVELS,
  ALL_JOB_TYPES,
  emptyFilters,
  hasActiveFilters,
  JobFilters,
} from '../filters';
import { ExperienceLevel, JobType } from '../types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
  availableLocations: string[];
  availableCompanies: string[];
  resultCount: number;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onFilterChange,
  availableLocations,
  availableCompanies,
  resultCount,
}) => {
  const toggleJobType = (type: JobType) => {
    const exists = filters.jobTypes.includes(type);
    const jobTypes = exists ? filters.jobTypes.filter((t) => t !== type) : [...filters.jobTypes, type];
    onFilterChange({ ...filters, jobTypes });
  };

  const toggleExperienceLevel = (level: ExperienceLevel) => {
    const exists = filters.experienceLevels.includes(level);
    const experienceLevels = exists
      ? filters.experienceLevels.filter((l) => l !== level)
      : [...filters.experienceLevels, level];
    onFilterChange({ ...filters, experienceLevels });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter Roles</Text>
            {hasActiveFilters(filters) && (
              <TouchableOpacity onPress={() => onFilterChange(emptyFilters)}>
                <Text style={styles.resetText}>Reset all</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={filters.location}
                onValueChange={(value: string) => onFilterChange({ ...filters, location: value })}
              >
                <Picker.Item label="All Locations & Remote" value="" />
                {availableLocations.map((loc) => (
                  <Picker.Item key={loc} label={loc} value={loc} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Company</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={filters.company}
                onValueChange={(value: string) => onFilterChange({ ...filters, company: value })}
              >
                <Picker.Item label="All Top Tech Companies" value="" />
                {availableCompanies.map((name) => (
                  <Picker.Item key={name} label={name} value={name} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Job Type</Text>
            <View style={styles.chipRow}>
              {ALL_JOB_TYPES.map((type) => {
                const active = filters.jobTypes.includes(type);
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleJobType(type)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{type}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Experience Level</Text>
            <View style={styles.chipRow}>
              {ALL_EXPERIENCE_LEVELS.map((level) => {
                const active = filters.experienceLevels.includes(level);
                return (
                  <TouchableOpacity
                    key={level}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleExperienceLevel(level)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{level}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
            <Text style={styles.applyButtonText}>Show {resultCount} results</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  resetText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  body: { paddingHorizontal: 20 },
  bodyContent: { paddingTop: 12, paddingBottom: 8 },
  label: { fontSize: 12, fontWeight: '700', color: colors.text, marginTop: 16, marginBottom: 6 },
  pickerWrap: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.background,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.text, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  applyButton: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
