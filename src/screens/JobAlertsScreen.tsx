import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { ThemeColors } from '../theme';

export const JobAlertsScreen: React.FC = () => {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>🔔</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>✨ Coming Soon</Text>
      </View>
      <Text style={styles.title}>Job Alerts are still being built</Text>
      <Text style={styles.body}>
        We're working on this feature right now. Once it's ready, you'll be able to set your role, skills, and
        experience here and get an email whenever a matching job is posted. Check back soon!
      </Text>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconText: { fontSize: 24 },
  badge: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
});
