import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';

const DebugInfo: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: financeState } = useFinance();

  // Verificação de segurança para os estados
  if (!authState || !financeState) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Info</Text>
      
      <Text style={styles.section}>Auth State:</Text>
      <Text style={styles.text}>isAuthenticated: {authState.isAuthenticated ? 'true' : 'false'}</Text>
      <Text style={styles.text}>isLoading: {authState.isLoading ? 'true' : 'false'}</Text>
      <Text style={styles.text}>driver: {authState.driver ? authState.driver.name : 'null'}</Text>
      <Text style={styles.text}>error: {authState.error || 'null'}</Text>
      
      <Text style={styles.section}>Finance State:</Text>
      <Text style={styles.text}>isLoading: {financeState.isLoading ? 'true' : 'false'}</Text>
      <Text style={styles.text}>revenues count: {financeState.revenues?.length || 0}</Text>
      <Text style={styles.text}>expenses count: {financeState.expenses?.length || 0}</Text>
      <Text style={styles.text}>error: {financeState.error || 'null'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    color: 'yellow',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    color: 'white',
    fontSize: 12,
    marginBottom: 2,
  },
});

export default DebugInfo;
