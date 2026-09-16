import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useJob } from '../context/JobContext';
import type { RootStackParamList, TabParamList } from '../navigation/types';
import { useAppTheme } from '../context/ThemeContext';
import { ThemeColors } from '../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Saved'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const SavedJobsScreen: React.FC<Props> = ({ navigation }) => {
  const { getSavedJobs, currentUser } = useJob();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  if (!currentUser) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>Sign in to save jobs</Text>
        <Text style={styles.emptyText}>Create an account to bookmark jobs and find them here later.</Text>
      </View>
    );
  }

  const savedJobs = getSavedJobs();

  if (savedJobs.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>No saved jobs yet</Text>
        <Text style={styles.emptyText}>Tap the star on any job to save it here.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={savedJobs}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
        >
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.companyName}>{item.companyName}</Text>
          <Text style={styles.metaText}>{item.location}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 6 },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  listContent: { padding: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  jobTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  companyName: { fontSize: 13, color: colors.primary, fontWeight: '600', marginBottom: 4 },
  metaText: { fontSize: 12, color: colors.textMuted },
});
