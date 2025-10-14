import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage } from '../i18n/types';
import { useConfiguration } from './ConfigurationContext';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { state: configState, updatePreferences } = useConfiguration();
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('pt-BR');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize language from configuration
  useEffect(() => {
    if (configState.preferences?.language) {
      setCurrentLanguage(configState.preferences.language);
    }
  }, [configState.preferences?.language]);

  const setLanguage = async (language: SupportedLanguage) => {
    try {
      setIsLoading(true);
      
      // Update local state immediately for better UX
      setCurrentLanguage(language);
      
      // Update configuration context
      await updatePreferences({
        ...configState.preferences!,
        language,
      });
      
    } catch (error) {
      console.error('Error updating language:', error);
      // Revert to previous language on error
      setCurrentLanguage(configState.preferences?.language || 'pt-BR');
    } finally {
      setIsLoading(false);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
