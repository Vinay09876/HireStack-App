import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useJob } from '../context/JobContext';
import type { RootStackParamList, TabParamList } from '../navigation/types';
import { colors } from '../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'JobsList'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const JobsListScreen: React.FC<Props> = ({ navigation }) => {
  const { jobs, loading, loadError, retryLoad } = useJob();
  const [query, setQuery] = useState('');

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.companyName.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
    );
  }, [jobs, query]);

  if (loadError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{loadError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryLoad}>
          <Text style={styles.retryButtonText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title, company, or location"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <Text style={styles.resultCount}>{filteredJobs.length} jobs found</Text>

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
          >
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.companyName}>{item.companyName}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{item.location}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{item.jobType}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{item.experienceLevel}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: colors.textMuted, fontSize: 14 },
  errorText: { color: colors.danger, fontSize: 14, marginBottom: 16, textAlign: 'center' },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  searchBar: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultCount: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontSize: 12,
    color: colors.textMuted,
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  jobTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  companyName: { fontSize: 13, color: colors.primary, fontWeight: '600', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  metaText: { fontSize: 12, color: colors.textMuted },
  metaDot: { fontSize: 12, color: colors.textMuted, marginHorizontal: 6 },
});
