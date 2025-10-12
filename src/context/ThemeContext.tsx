import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export type Theme = 'light' | 'dark' | 'auto' | 'system';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
    headerBackground: string;
    headerText: string;
    tabBackground: string;
    tabText: string;
    tabActiveBackground: string;
    tabActiveText: string;
    cardBackground: string;
    cardBorder: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

interface ThemeContextType {
  state: ThemeState;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

type ThemeAction = 
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_IS_DARK'; payload: boolean };

const lightColors = {
  background: '#f8fafc',
  surface: '#ffffff',
  primary: '#3b82f6',
  secondary: '#64748b',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  shadow: '#000000',
  headerBackground: '#1e293b',
  headerText: '#ffffff',
  tabBackground: '#ffffff',
  tabText: '#64748b',
  tabActiveBackground: '#3b82f6',
  tabActiveText: '#ffffff',
  cardBackground: '#ffffff',
  cardBorder: '#e2e8f0',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

const darkColors = {
  background: '#0f172a',
  surface: '#1e293b',
  primary: '#3b82f6',
  secondary: '#94a3b8',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155',
  shadow: '#000000',
  headerBackground: '#020617',
  headerText: '#f1f5f9',
  tabBackground: '#1e293b',
  tabText: '#94a3b8',
  tabActiveBackground: '#3b82f6',
  tabActiveText: '#ffffff',
  cardBackground: '#1e293b',
  cardBorder: '#334155',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

const initialState: ThemeState = {
  theme: 'light',
  isDark: false,
  colors: lightColors,
};

const getSystemTheme = (): boolean => {
  return Appearance.getColorScheme() === 'dark';
};

const getThemeState = (theme: Theme): boolean => {
  switch (theme) {
    case 'light':
      return false;
    case 'dark':
      return true;
    case 'auto':
      return new Date().getHours() >= 18;
    case 'system':
      return getSystemTheme();
    default:
      return false;
  }
};

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      const isDark = getThemeState(action.payload);
      
      return {
        ...state,
        theme: action.payload,
        isDark,
        colors: isDark ? darkColors : lightColors,
      };
    case 'SET_IS_DARK':
      return {
        ...state,
        isDark: action.payload,
        colors: action.payload ? darkColors : lightColors,
      };
    default:
      return state;
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Load theme from storage on first render
  useEffect(() => {
    loadTheme();
  }, []);

  // Check for theme changes
  useEffect(() => {
    if (state.theme === 'auto') {
      const interval = setInterval(() => {
        const isDark = new Date().getHours() >= 18;
        if (isDark !== state.isDark) {
          dispatch({ type: 'SET_IS_DARK', payload: isDark });
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    } else if (state.theme === 'system') {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        const isDark = colorScheme === 'dark';
        if (isDark !== state.isDark) {
          dispatch({ type: 'SET_IS_DARK', payload: isDark });
        }
      });

      return () => subscription?.remove();
    }
  }, [state.theme, state.isDark]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('app_theme');
      if (savedTheme) {
        dispatch({ type: 'SET_THEME', payload: savedTheme as Theme });
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (theme: Theme) => {
    try {
      await AsyncStorage.setItem('app_theme', theme);
      dispatch({ type: 'SET_THEME', payload: theme });
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = state.isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    state,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
