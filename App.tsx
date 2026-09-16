import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { JobProvider } from './src/context/JobContext';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';
import { RootNavigator } from './src/navigation';

function AppContent() {
  const { theme } = useAppTheme();
  return (
    <>
      <RootNavigator />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <JobProvider>
          <AppContent />
        </JobProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
