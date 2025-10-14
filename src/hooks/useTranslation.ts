import { useLanguage } from '../context/LanguageContext';
import { TranslationKeys, SupportedLanguage } from '../i18n/types';
import { translations } from '../i18n';

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Silently return the key as fallback without logging
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  const getCurrentLanguage = (): SupportedLanguage => {
    return currentLanguage;
  };

  const getLanguageName = (language: SupportedLanguage): string => {
    const languageNames = {
      'pt-BR': 'Português',
      'en-US': 'English',
      'es-ES': 'Español',
    };
    return languageNames[language];
  };

  const formatCurrency = (value: number, currency: 'BRL' | 'USD' | 'EUR' = 'BRL'): string => {
    const symbols = {
      BRL: 'R$',
      USD: '$',
      EUR: '€',
    };

    const formatter = new Intl.NumberFormat(
      currentLanguage === 'pt-BR' ? 'pt-BR' : 
      currentLanguage === 'es-ES' ? 'es-ES' : 'en-US',
      {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

    return formatter.format(value);
  };

  const formatDate = (date: Date, format: 'short' | 'medium' | 'long' = 'medium'): string => {
    const locale = currentLanguage === 'pt-BR' ? 'pt-BR' : 
                  currentLanguage === 'es-ES' ? 'es-ES' : 'en-US';

    const options: Intl.DateTimeFormatOptions = {
      short: { day: '2-digit', month: '2-digit', year: 'numeric' },
      medium: { day: '2-digit', month: 'short', year: 'numeric' },
      long: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' },
    };

    return date.toLocaleDateString(locale, options[format]);
  };

  const formatTime = (date: Date, format: '12h' | '24h' = '24h'): string => {
    const locale = currentLanguage === 'pt-BR' ? 'pt-BR' : 
                  currentLanguage === 'es-ES' ? 'es-ES' : 'en-US';

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: format === '12h',
    };

    return date.toLocaleTimeString(locale, options);
  };

  const formatNumber = (value: number, decimals: number = 2): string => {
    const locale = currentLanguage === 'pt-BR' ? 'pt-BR' : 
                  currentLanguage === 'es-ES' ? 'es-ES' : 'en-US';

    return value.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return {
    t,
    currentLanguage,
    getCurrentLanguage,
    getLanguageName,
    formatCurrency,
    formatDate,
    formatTime,
    formatNumber,
  };
};
