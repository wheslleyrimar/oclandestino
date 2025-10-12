import React from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { FinanceProvider } from './src/context/FinanceContext';
import { ConfigurationProvider } from './src/context/ConfigurationContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const { state } = useTheme();
  
  return (
    <>
      <AppNavigator />
      <StatusBar style={state.isDark ? "light" : "dark"} backgroundColor={state.colors.headerBackground} />
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <ConfigurationProvider>
          <AppContent />
        </ConfigurationProvider>
      </FinanceProvider>
    </ThemeProvider>
  );
}
