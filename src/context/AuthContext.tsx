import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { DriverProfile } from '../types';
import { authService, LoginCredentials, RegisterData } from '../services/authService';
import { apiService } from '../services/apiService';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  driver: DriverProfile | null;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: DriverProfile }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_PROFILE'; payload: DriverProfile };

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  driver: null,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        driver: action.payload,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        driver: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        driver: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        driver: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateProfile: (profile: DriverProfile) => void;
  loadDashboardData: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: 'AUTH_START' });
        
        const isAuth = await authService.isAuthenticated();
        
        if (isAuth) {
          const profile = await authService.getStoredProfile();
          
          if (profile) {
            dispatch({ type: 'AUTH_SUCCESS', payload: profile });
          } else {
            dispatch({ type: 'AUTH_FAILURE', payload: 'Profile not found' });
          }
        } else {
          dispatch({ type: 'AUTH_FAILURE', payload: 'Not authenticated' });
        }
      } catch (error) {
        dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication check failed' });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authService.login(credentials);
      
      if (response.success && response.data.driver) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data.driver });
        
        // Aguardar um pouco para garantir que o FinanceContext seja inicializado
        setTimeout(() => {
          // Disparar evento customizado para recarregar dados do FinanceContext (apenas se window existir)
          if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('auth-success'));
          }
        }, 100);
        
        // Carregar dados do dashboard após login bem-sucedido
        try {
          await loadDashboardData();
        } catch (dashboardError) {
          console.warn('Erro ao carregar dados do dashboard após login:', dashboardError);
          // Não falhar o login se o dashboard falhar
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: 'Login failed' });
      }
    } catch (error) {
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authService.register(userData);
      
      if (response.success && response.data.driver) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data.driver });
        
        // Carregar dados do dashboard após registro bem-sucedido
        try {
          await loadDashboardData();
        } catch (dashboardError) {
          console.warn('Erro ao carregar dados do dashboard após registro:', dashboardError);
          // Não falhar o registro se o dashboard falhar
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: 'Registration failed' });
      }
    } catch (error) {
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Registration failed' 
      });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Still dispatch logout even if there's an error
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateProfile = (profile: DriverProfile) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
  };

  // Função para carregar dados do dashboard após autenticação
  const loadDashboardData = async () => {
    try {
      // Definir período padrão (mês atual)
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const startDate = startOfMonth.toISOString().split('T')[0]; // YYYY-MM-DD
      const endDate = endOfMonth.toISOString().split('T')[0]; // YYYY-MM-DD
      
      const dashboardData = await apiService.getDashboardData({
        startDate,
        endDate,
      });
      
      return dashboardData;
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    clearError,
    updateProfile,
    loadDashboardData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
