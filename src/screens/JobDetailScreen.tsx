import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useJob } from '../context/JobContext';
import type { RootStackParamList } from '../navigation/types';
import { useAppTheme } from '../context/ThemeContext';
import { ThemeColors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'JobDetail'>;

export const JobDetailScreen: React.FC<Props> = ({ route }) => {
  const { jobId } = route.params;
  const { getJobById, isJobSaved, toggleSaveJob, currentUser } = useJob();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const job = getJobById(jobId);

  if (!job) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Job not found.</Text>
      </View>
    );
  }

  const saved = isJobSaved(job.id);

  const handleApply = async () => {
    // Always opens the real company's own application page in the
    // device's browser - HireStack never hosts or collects applications.
    const canOpen = await Linking.canOpenURL(job.applicationUrl);
    if (canOpen) {
      Linking.openURL(job.applicationUrl);
    } else {
      Alert.alert('Unable to open link', 'This job\'s application link could not be opened.');
    }
  };

  const handleSave = () => {
    if (!currentUser) {
      Alert.alert('Sign in required', 'Sign in to save jobs to your dashboard.');
      return;
    }
    toggleSaveJob(job.id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.company}>{job.companyName}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{job.location}</Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaText}>{job.jobType}</Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaText}>{job.experienceLevel}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply Now ↗</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{saved ? '★ Saved' : '☆ Save'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.applyHint}>
        You'll be taken to {job.companyName}'s official site to apply.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Role Overview</Text>
        <Text style={styles.bodyText}>{job.description}</Text>
      </View>

      {job.responsibilities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Responsibilities</Text>
          {job.responsibilities.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {job.requirements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Requirements</Text>
          {job.requirements.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {job.qualifications && job.qualifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Qualifications</Text>
          {job.qualifications.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: colors.textMuted, fontSize: 14 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  company: { fontSize: 14, fontWeight: '600', color: colors.primary, marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, flexWrap: 'wrap' },
  metaText: { fontSize: 12, color: colors.textMuted },
  metaDot: { fontSize: 12, color: colors.textMuted, marginHorizontal: 6 },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  applyButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  saveButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  saveButtonText: { color: colors.text, fontWeight: '600', fontSize: 14 },
  applyHint: { fontSize: 11, color: colors.textMuted, marginTop: 8 },
  section: {
    marginTop: 20,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8, textTransform: 'uppercase' },
  bodyText: { fontSize: 13, color: colors.text, lineHeight: 20 },
  bulletRow: { flexDirection: 'row', marginBottom: 6 },
  bullet: { color: colors.primary, marginRight: 8, fontSize: 13 },
  bulletText: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 19 },
});
