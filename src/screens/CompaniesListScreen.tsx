import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useJob } from '../context/JobContext';
import type { RootStackParamList, TabParamList } from '../navigation/types';
import { useAppTheme } from '../context/ThemeContext';
import { ThemeColors } from '../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Companies'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const CompaniesListScreen: React.FC<Props> = ({ navigation }) => {
  const { companies, jobs, loading, loadError, retryLoad } = useJob();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const openJobCount = useMemo(() => {
    const counts = new Map<string, number>();
    jobs.forEach((job) => {
      counts.set(job.companyId, (counts.get(job.companyId) || 0) + 1);
    });
    return counts;
  }, [jobs]);

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
        <Text style={styles.loadingText}>Loading companies...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={companies}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <Text style={styles.headerSubtitle}>
          Browse company overviews and explore all active roles with direct external application links.
        </Text>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('CompanyDetail', { companyId: item.id })}
        >
          <Text style={styles.companyName}>{item.name}</Text>
          <Text style={styles.headquarters}>{item.headquarters}</Text>
          <Text style={styles.jobCount}>
            {openJobCount.get(item.id) || 0} open {openJobCount.get(item.id) === 1 ? 'role' : 'roles'}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
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
  listContent: { padding: 16 },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  companyName: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  headquarters: { fontSize: 12, color: colors.textMuted, marginBottom: 6 },
  jobCount: { fontSize: 12, color: colors.primary, fontWeight: '600' },
});
