import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useJob } from '../context/JobContext';
import type { RootStackParamList } from '../navigation/types';
import { useAppTheme } from '../context/ThemeContext';
import { ThemeColors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CompanyDetail'>;

export const CompanyDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { companyId } = route.params;
  const { getCompanyById, getJobsByCompany } = useJob();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const company = getCompanyById(companyId);
  const openJobs = getJobsByCompany(companyId);

  if (!company) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Company not found.</Text>
      </View>
    );
  }

  const handleOpenWebsite = async () => {
    const canOpen = await Linking.canOpenURL(company.websiteUrl);
    if (canOpen) {
      Linking.openURL(company.websiteUrl);
    } else {
      Alert.alert('Unable to open link', "This company's website could not be opened.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.name}>{company.name}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{company.headquarters}</Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaText}>{company.employees} employees</Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaText}>Founded {company.founded}</Text>
      </View>

      <TouchableOpacity style={styles.websiteButton} onPress={handleOpenWebsite}>
        <Text style={styles.websiteButtonText}>Official Careers Portal ↗</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About {company.name}</Text>
        <Text style={styles.bodyText}>{company.about}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Open Positions ({openJobs.length})
        </Text>
        {openJobs.length > 0 ? (
          openJobs.map((job, index) => (
            <TouchableOpacity
              key={job.id}
              style={[styles.jobCard, index === 0 && styles.jobCardFirst]}
              onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
            >
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={styles.jobMetaRow}>
                <Text style={styles.jobMetaText}>{job.location}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.jobMetaText}>{job.jobType}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.bodyText}>No currently open jobs listed for {company.name}. Check back soon!</Text>
        )}
      </View>
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: colors.textMuted, fontSize: 14 },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, flexWrap: 'wrap' },
  metaText: { fontSize: 12, color: colors.textMuted },
  metaDot: { fontSize: 12, color: colors.textMuted, marginHorizontal: 6 },
  websiteButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  websiteButtonText: { color: colors.text, fontWeight: '700', fontSize: 14 },
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
  jobCard: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  jobCardFirst: {
    borderTopWidth: 0,
    paddingTop: 4,
  },
  jobTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 4 },
  jobMetaRow: { flexDirection: 'row', alignItems: 'center' },
  jobMetaText: { fontSize: 12, color: colors.textMuted },
});
