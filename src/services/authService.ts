import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriverProfile } from '../types';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.getBaseUrl();

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  licenseNumber: string;
  vehicleModel: string;
  vehiclePlate: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    driver: DriverProfile;
    message: string;
  };
}

export interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details: any;
  };
}

class AuthService {
  private token: string | null = null;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        timeout: API_CONFIG.timeout,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }

      if (data.success && data.data.token) {
        this.token = data.data.token;
        await AsyncStorage.setItem('auth_token', data.data.token);
        await AsyncStorage.setItem('driver_profile', JSON.stringify(data.data.driver));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      
      // Tratar diferentes tipos de erro
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new Error(`Não foi possível conectar ao servidor.\n\nURL: ${API_BASE_URL}\n\nVerifique se:\n• O backend está rodando\n• A URL está correta\n• O dispositivo está na mesma rede`);
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Erro desconhecido durante o login');
      }
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Registration failed');
      }

      if (data.success && data.data.token) {
        this.token = data.data.token;
        await AsyncStorage.setItem('auth_token', data.data.token);
        await AsyncStorage.setItem('driver_profile', JSON.stringify(data.data.driver));
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Tratar diferentes tipos de erro
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new Error('Servidor não está disponível. Verifique sua conexão ou se o backend está rodando.');
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Erro desconhecido durante o cadastro');
      }
    }
  }

  async logout(): Promise<void> {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('driver_profile');
  }

  async getStoredToken(): Promise<string | null> {
    if (this.token) {
      return this.token;
    }

    try {
      const token = await AsyncStorage.getItem('auth_token');
      this.token = token;
      return token;
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }

  async getStoredProfile(): Promise<DriverProfile | null> {
    try {
      const profile = await AsyncStorage.getItem('driver_profile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting stored profile:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getStoredToken();
    return token !== null;
  }

  getAuthHeaders(): Record<string, string> {
    if (!this.token) {
      return {};
    }

    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  async refreshToken(): Promise<boolean> {
    // Implementar refresh token se necessário
    // Por enquanto, retorna false para forçar novo login
    return false;
  }
}

export const authService = new AuthService();
