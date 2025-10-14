import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const SimpleDebug: React.FC = () => {
  const { state } = useAuth();
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Debug Info:</Text>
      <Text style={styles.text}>• Auth: {state.isAuthenticated ? 'SIM' : 'NÃO'}</Text>
      <Text style={styles.text}>• Loading: {state.isLoading ? 'SIM' : 'NÃO'}</Text>
      <Text style={styles.text}>• Driver: {state.driver?.name || 'Nenhum'}</Text>
      {state.error && <Text style={styles.errorText}>• Erro: {state.error}</Text>}
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
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SimpleDebug;
