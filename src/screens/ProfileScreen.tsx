import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useJob } from '../context/JobContext';
import { colors } from '../theme';

export const ProfileScreen: React.FC = () => {
  const { currentUser, userProfile, signIn, signUp, logout } = useJob();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>{currentUser.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{currentUser.name}</Text>
        <Text style={styles.email}>{currentUser.email}</Text>
        {userProfile.title ? <Text style={styles.title}>{userProfile.title}</Text> : null}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password.trim() || (mode === 'signup' && !name.trim())) {
      setError('Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    const result =
      mode === 'signup' ? await signUp(email.trim(), password, name.trim()) : await signIn(email.trim(), password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else if (mode === 'signup') {
      Alert.alert('Check your email', 'Confirm your email to finish signing up, then sign in.');
      setMode('login');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.formTitle}>{mode === 'login' ? 'Sign In' : 'Create Account'}</Text>

      {mode === 'signup' && (
        <TextInput
          style={styles.input}
          placeholder="Full name"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.submitButtonText}>
          {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        <Text style={styles.switchModeText}>
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center' },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  avatarInitial: { color: '#fff', fontSize: 28, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  email: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 2 },
  title: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 6 },
  logoutButton: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonText: { color: colors.danger, fontWeight: '700', fontSize: 14 },
  formTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  },
  errorText: { color: colors.danger, fontSize: 12, marginBottom: 12, textAlign: 'center' },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
  },
  submitButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  switchModeText: { color: colors.primary, fontSize: 12, textAlign: 'center', marginTop: 16 },
});
