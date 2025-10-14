import { Platform } from 'react-native';

// Configuração centralizada da API
export const API_CONFIG = {
  // URLs baseadas na plataforma e ambiente
  getBaseUrl: () => {
    if (__DEV__) {
      // Em desenvolvimento
      if (Platform.OS === 'android') {
        // Para Android, usar o IP da máquina de desenvolvimento
        // IMPORTANTE: Substitua pelo seu IP local real
        // Para encontrar seu IP: ipconfig (Windows) ou ifconfig (Mac/Linux)
        return 'http://10.0.2.2:8080/api'; // IP padrão do emulador Android
      } else {
        // Para iOS, localhost funciona no simulador
        return 'http://localhost:8080/api';
      }
    } else {
      // Em produção, usar a URL do servidor
      return 'https://seu-servidor.com/api';
    }
  },

  // Configurações de timeout
  timeout: 10000, // 10 segundos

  // Headers padrão
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // Configurações de retry
  retryAttempts: 3,
  retryDelay: 1000, // 1 segundo
};

// Função para obter o IP local da máquina (para dispositivos físicos)
export const getLocalIP = () => {
  // Esta função deve ser implementada para obter o IP real da máquina
  // Por enquanto, retorna o IP padrão do emulador
  return '10.0.2.2';
};

// Função para testar a conectividade
export const testConnection = async (baseUrl: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};
