import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { DriverProfile, PerformanceGoals, AppPreferences, ConfigurationState } from '../types';
import { apiService } from '../services/apiService';
import { useAuth } from './AuthContext';

interface ConfigurationContextType {
  state: ConfigurationState;
  updateProfile: (profile: Partial<DriverProfile>) => Promise<void>;
  updateGoals: (goals: Partial<PerformanceGoals>) => Promise<void>;
  updatePreferences: (preferences: Partial<AppPreferences>) => Promise<void>;
  resetToDefaults: () => void;
  loadConfiguration: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

type ConfigurationAction =
  | { type: 'UPDATE_PROFILE'; payload: Partial<DriverProfile> }
  | { type: 'UPDATE_GOALS'; payload: Partial<PerformanceGoals> }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<AppPreferences> }
  | { type: 'RESET_TO_DEFAULTS' }
  | { type: 'LOAD_CONFIGURATION'; payload: ConfigurationState }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

const defaultProfile: DriverProfile = {
  id: '1',
  name: 'Motorista',
  email: 'motorista@exemplo.com',
  phone: '(11) 99999-9999',
  licenseNumber: '12345678901',
  vehicleModel: 'Modelo do Veículo',
  vehiclePlate: 'ABC-1234',
};

const defaultGoals: PerformanceGoals = {
  id: '1',
  monthlyEarningsGoal: 5000,
  dailyTripsGoal: 20,
  weeklyHoursGoal: 40,
  monthlyHoursGoal: 160,
  averageEarningsPerHourGoal: 30,
  averageEarningsPerTripGoal: 15,
  workingDaysPerWeekGoal: 5,
};

const defaultPreferences: AppPreferences = {
  id: '1',
  language: 'pt-BR',
  theme: 'system',
  notifications: {
    earnings: true,
    goals: true,
    reminders: true,
    promotions: false,
  },
  currency: 'BRL',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
};

const initialState: ConfigurationState = {
  profile: defaultProfile,
  goals: defaultGoals,
  preferences: defaultPreferences,
  isLoading: false,
  error: null,
};

const configurationReducer = (state: ConfigurationState, action: ConfigurationAction): ConfigurationState => {
  switch (action.type) {
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      };
    case 'UPDATE_GOALS':
      return {
        ...state,
        goals: { ...state.goals, ...action.payload },
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
    case 'RESET_TO_DEFAULTS':
      return {
        profile: defaultProfile,
        goals: defaultGoals,
        preferences: defaultPreferences,
      };
    case 'LOAD_CONFIGURATION':
      return action.payload;
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export const useConfiguration = () => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider');
  }
  return context;
};

interface ConfigurationProviderProps {
  children: ReactNode;
}

export const ConfigurationProvider: React.FC<ConfigurationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(configurationReducer, initialState);
  const { state: authState } = useAuth();

  // Load configuration when authenticated
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      loadConfiguration();
    }
  }, [authState.isAuthenticated, authState.isLoading]);

  const loadConfiguration = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const [profileResponse, goalsResponse, preferencesResponse] = await Promise.all([
        apiService.getProfile(),
        apiService.getPerformanceGoals(),
        apiService.getPreferences().catch(() => null), // Optional
      ]);

      const configuration: ConfigurationState = {
        profile: profileResponse.success ? profileResponse.data : defaultProfile,
        goals: goalsResponse.success ? goalsResponse.data : defaultGoals,
        preferences: preferencesResponse?.data || defaultPreferences,
      };

      dispatch({ type: 'LOAD_CONFIGURATION', payload: configuration });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load configuration',
      });
    }
  };

  const updateProfile = async (profile: Partial<DriverProfile>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.updateProfile(profile);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_PROFILE', payload: response.data });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to update profile',
      });
    }
  };

  const updateGoals = async (goals: Partial<PerformanceGoals>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.updatePerformanceGoals(goals);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_GOALS', payload: response.data });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to update goals',
      });
    }
  };

  const updatePreferences = async (preferences: Partial<AppPreferences>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.updatePreferences(preferences);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_PREFERENCES', payload: response.data });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to update preferences',
      });
    }
  };

  const resetToDefaults = () => {
    dispatch({ type: 'RESET_TO_DEFAULTS' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: ConfigurationContextType = {
    state,
    updateProfile,
    updateGoals,
    updatePreferences,
    resetToDefaults,
    loadConfiguration,
    isLoading: state.isLoading || false,
    error: state.error || null,
    clearError,
  };

  return <ConfigurationContext.Provider value={value}>{children}</ConfigurationContext.Provider>;
};
