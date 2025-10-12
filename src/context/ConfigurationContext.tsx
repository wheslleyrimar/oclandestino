import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { DriverProfile, PerformanceGoals, AppPreferences, ConfigurationState } from '../types';

interface ConfigurationContextType {
  state: ConfigurationState;
  updateProfile: (profile: Partial<DriverProfile>) => void;
  updateGoals: (goals: Partial<PerformanceGoals>) => void;
  updatePreferences: (preferences: Partial<AppPreferences>) => void;
  resetToDefaults: () => void;
}

type ConfigurationAction =
  | { type: 'UPDATE_PROFILE'; payload: Partial<DriverProfile> }
  | { type: 'UPDATE_GOALS'; payload: Partial<PerformanceGoals> }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<AppPreferences> }
  | { type: 'RESET_TO_DEFAULTS' }
  | { type: 'LOAD_CONFIGURATION'; payload: ConfigurationState };

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
  theme: 'light',
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

  // Load configuration from storage on first render
  useEffect(() => {
    // TODO: Load from AsyncStorage or other persistent storage
    // For now, using default values
  }, []);

  // Save configuration to storage whenever it changes
  useEffect(() => {
    // TODO: Save to AsyncStorage or other persistent storage
  }, [state]);

  const updateProfile = (profile: Partial<DriverProfile>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
  };

  const updateGoals = (goals: Partial<PerformanceGoals>) => {
    dispatch({ type: 'UPDATE_GOALS', payload: goals });
  };

  const updatePreferences = (preferences: Partial<AppPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
  };

  const resetToDefaults = () => {
    dispatch({ type: 'RESET_TO_DEFAULTS' });
  };

  const value: ConfigurationContextType = {
    state,
    updateProfile,
    updateGoals,
    updatePreferences,
    resetToDefaults,
  };

  return <ConfigurationContext.Provider value={value}>{children}</ConfigurationContext.Provider>;
};
