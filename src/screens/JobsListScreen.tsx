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
import { emptyFilters, hasActiveFilters, JobFilters } from '../filters';
import { FilterModal } from '../components/FilterModal';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'JobsList'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const JobsListScreen: React.FC<Props> = ({ navigation }) => {
  const { jobs, loading, loadError, retryLoad } = useJob();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<JobFilters>(emptyFilters);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const availableLocations = useMemo(() => {
    const locs = Array.from(new Set(jobs.map((j) => j.location.split('(')[0].trim())));
    return locs.sort();
  }, [jobs]);

  const availableCompanies = useMemo(() => {
    const names = Array.from(new Set(jobs.map((j) => j.companyName)));
    return names.sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (q) {
        const matches =
          job.title.toLowerCase().includes(q) ||
          job.companyName.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      if (filters.company && job.companyName.toLowerCase() !== filters.company.toLowerCase()) {
        return false;
      }

      if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(job.jobType)) {
        return false;
      }

      if (filters.experienceLevels.length > 0 && !filters.experienceLevels.includes(job.experienceLevel)) {
        return false;
      }

      return true;
    });
  }, [jobs, query, filters]);

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

      <View style={styles.summaryRow}>
        <Text style={styles.resultCount}>{filteredJobs.length} jobs found</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Text style={styles.filterButtonText}>
            Filters{hasActiveFilters(filters) ? ' •' : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {filteredJobs.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No matching jobs found</Text>
          <Text style={styles.emptyText}>Try broadening your search or resetting filters.</Text>
          {hasActiveFilters(filters) && (
            <TouchableOpacity style={styles.retryButton} onPress={() => setFilters(emptyFilters)}>
              <Text style={styles.retryButtonText}>Reset all filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
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
      )}

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onFilterChange={setFilters}
        availableLocations={availableLocations}
        availableCompanies={availableCompanies}
        resultCount={filteredJobs.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: colors.textMuted, fontSize: 14 },
  errorText: { color: colors.danger, fontSize: 14, marginBottom: 16, textAlign: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 6 },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginBottom: 16 },
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
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultCount: { fontSize: 12, color: colors.textMuted },
  filterButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
  },
  filterButtonText: { fontSize: 12, fontWeight: '700', color: colors.primary },
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
