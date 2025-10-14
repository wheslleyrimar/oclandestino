import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { API_CONFIG, testConnection } from '../config/api';
import { useTheme } from '../context/ThemeContext';

interface NetworkDebugProps {
  onClose: () => void;
}

export const NetworkDebug: React.FC<NetworkDebugProps> = ({ onClose }) => {
  const { state: themeState } = useTheme();
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testNetworkConnection = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    addResult('Iniciando teste de conectividade...');
    addResult(`URL base: ${API_CONFIG.getBaseUrl()}`);
    
    try {
      // Teste básico de conectividade
      const isConnected = await testConnection(API_CONFIG.getBaseUrl());
      
      if (isConnected) {
        addResult('✅ Conexão com o servidor estabelecida com sucesso!');
      } else {
        addResult('❌ Falha na conexão com o servidor');
      }
    } catch (error) {
      addResult(`❌ Erro durante o teste: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
    
    setIsTesting(false);
  };

  const getNetworkInfo = () => {
    const info = [
      `URL Base: ${API_CONFIG.getBaseUrl()}`,
      `Timeout: ${API_CONFIG.timeout}ms`,
      `Ambiente: ${__DEV__ ? 'Desenvolvimento' : 'Produção'}`,
      `Plataforma: ${require('react-native').Platform.OS}`,
    ];
    
    Alert.alert(
      'Informações de Rede',
      info.join('\n'),
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeState.colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeState.colors.text }]}>
          Debug de Rede
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeText, { color: themeState.colors.text }]}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: themeState.colors.primary }]}
            onPress={testNetworkConnection}
            disabled={isTesting}
          >
            <Text style={styles.buttonText}>
              {isTesting ? 'Testando...' : 'Testar Conexão'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: themeState.colors.secondary }]}
            onPress={getNetworkInfo}
          >
            <Text style={styles.buttonText}>Informações de Rede</Text>
          </TouchableOpacity>
        </View>

        {testResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsTitle, { color: themeState.colors.text }]}>
              Resultados do Teste:
            </Text>
            {testResults.map((result, index) => (
              <Text
                key={index}
                style={[
                  styles.resultText,
                  { color: themeState.colors.textSecondary }
                ]}
              >
                {result}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.helpContainer}>
          <Text style={[styles.helpTitle, { color: themeState.colors.text }]}>
            Soluções Comuns:
          </Text>
          <Text style={[styles.helpText, { color: themeState.colors.textSecondary }]}>
            • Para Android: Use 10.0.2.2:8080 (emulador) ou seu IP local:8080 (dispositivo físico)
          </Text>
          <Text style={[styles.helpText, { color: themeState.colors.textSecondary }]}>
            • Para iOS: Use localhost:8080 (simulador) ou seu IP local:8080 (dispositivo físico)
          </Text>
          <Text style={[styles.helpText, { color: themeState.colors.textSecondary }]}>
            • Certifique-se de que o backend está rodando na porta 8080
          </Text>
          <Text style={[styles.helpText, { color: themeState.colors.textSecondary }]}>
            • Verifique se o dispositivo está na mesma rede Wi-Fi
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  helpContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});
