import { Translations, SupportedLanguage } from './types';
import { ptBR } from './locales/pt-BR';
import { enUS } from './locales/en-US';
import { esES } from './locales/es-ES';

export const translations: Translations = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': esES,
};

export const defaultLanguage: SupportedLanguage = 'pt-BR';

export const supportedLanguages: SupportedLanguage[] = ['pt-BR', 'en-US', 'es-ES'];

export const getLanguageName = (language: SupportedLanguage): string => {
  const languageNames = {
    'pt-BR': 'Português',
    'en-US': 'English',
    'es-ES': 'Español',
  };
  return languageNames[language];
};

export const getLanguageFlag = (language: SupportedLanguage): string => {
  const flags = {
    'pt-BR': '🇧🇷',
    'en-US': '🇺🇸',
    'es-ES': '🇪🇸',
  };
  return flags[language];
};

export * from './types';
