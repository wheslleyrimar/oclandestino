import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Platform,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { WebCompatibleDateTimePicker } from './WebCompatibleDateTimePicker';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface PredefinedOption {
  label: string;
  period: string;
  getDates: () => DateRange;
}

export const DateFilterDropdown: React.FC = () => {
  const { state, setFilters } = useFinance();
  const { state: themeState } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);

  // Verificação de segurança para o tema
  if (!themeState || !themeState.colors) {
    return null;
  }

  const styles = createStyles(themeState.colors);
  const screenWidth = Dimensions.get('window').width;

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  const getThisWeek = () => {
    const today = new Date();
    // Calcular início da semana (segunda-feira)
    const dayOfWeek = today.getDay(); // 0 = domingo, 1 = segunda, etc.
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Se domingo, volta 6 dias; senão, volta (dayOfWeek - 1) dias
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysFromMonday);
    startOfWeek.setHours(0, 0, 0, 0); // Início do dia
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); // Final do dia
    
    return {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0],
    };
  };

  const getLastWeek = () => {
    const today = new Date();
    // Calcular início da semana passada (segunda-feira)
    const dayOfWeek = today.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const startOfLastWeek = new Date(today);
    startOfLastWeek.setDate(today.getDate() - daysFromMonday - 7);
    startOfLastWeek.setHours(0, 0, 0, 0);
    
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
    endOfLastWeek.setHours(23, 59, 59, 999);
    
    return {
      startDate: startOfLastWeek.toISOString().split('T')[0],
      endDate: endOfLastWeek.toISOString().split('T')[0],
    };
  };

  const getThisMonth = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    
    return {
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0],
    };
  };

  const getLastMonth = () => {
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    startOfLastMonth.setHours(0, 0, 0, 0);
    
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    endOfLastMonth.setHours(23, 59, 59, 999);
    
    return {
      startDate: startOfLastMonth.toISOString().split('T')[0],
      endDate: endOfLastMonth.toISOString().split('T')[0],
    };
  };

  const predefinedOptions: PredefinedOption[] = [
    {
      label: 'Hoje',
      period: 'Dia',
      getDates: () => ({ startDate: getToday(), endDate: getToday() }),
    },
    {
      label: 'Ontem',
      period: 'Dia',
      getDates: () => ({ startDate: getYesterday(), endDate: getYesterday() }),
    },
    {
      label: 'Esta Semana',
      period: 'Semana',
      getDates: getThisWeek,
    },
    {
      label: 'Semana Passada',
      period: 'Semana',
      getDates: getLastWeek,
    },
    {
      label: 'Este Mês',
      period: 'Mês',
      getDates: getThisMonth,
    },
    {
      label: 'Mês Passado',
      period: 'Mês',
      getDates: getLastMonth,
    },
  ];

  const handlePredefinedOption = async (option: PredefinedOption) => {
    setIsApplyingFilter(true);
    try {
      const dates = option.getDates();
      setFilters({
        ...state.filters,
        startDate: dates.startDate,
        endDate: dates.endDate,
      });
      setIsOpen(false);
    } finally {
      setIsApplyingFilter(false);
    }
  };

  const formatDateToISO = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatDateToDisplay = (date: Date): string => {
    return date.toLocaleDateString('pt-BR');
  };

  const parseDisplayDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    
    // Tentar diferentes formatos de data
    const formats = [
      /^(\d{2})\/(\d{2})\/(\d{4})$/, // dd/mm/yyyy
      /^(\d{4})-(\d{2})-(\d{2})$/, // yyyy-mm-dd
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // d/m/yyyy ou dd/m/yyyy ou d/mm/yyyy
    ];
    
    for (const format of formats) {
      const match = dateString.match(format);
      if (match) {
        const [, day, month, year] = match;
        const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        // Validar se a data é válida
        if (
          parsedDate.getFullYear() === parseInt(year) &&
          parsedDate.getMonth() === parseInt(month) - 1 &&
          parsedDate.getDate() === parseInt(day)
        ) {
          return parsedDate;
        }
      }
    }
    
    return null;
  };

  const validateDateRange = (startDate: Date, endDate: Date): boolean => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Final do dia atual
    
    // Verificar se as datas não são futuras
    if (startDate > today || endDate > today) {
      return false;
    }
    
    // Verificar se a data inicial não é posterior à final
    if (startDate > endDate) {
      return false;
    }
    
    // Verificar se o intervalo não é muito grande (máximo 1 ano)
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    if (startDate < oneYearAgo) {
      return false;
    }
    
    return true;
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setTempStartDate(selectedDate);
      setCustomStartDate(formatDateToDisplay(selectedDate));
      
      // Se a data final for anterior à inicial, ajustar automaticamente
      if (selectedDate > tempEndDate) {
        setTempEndDate(selectedDate);
        setCustomEndDate(formatDateToDisplay(selectedDate));
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      // Garantir que a data final não seja anterior à inicial
      const finalDate = selectedDate < tempStartDate ? tempStartDate : selectedDate;
      setTempEndDate(finalDate);
      setCustomEndDate(formatDateToDisplay(finalDate));
    }
  };

  const handleCustomRange = async () => {
    if (customStartDate && customEndDate) {
      setIsApplyingFilter(true);
      try {
        const startDate = parseDisplayDate(customStartDate);
        const endDate = parseDisplayDate(customEndDate);
        
        if (startDate && endDate) {
          if (validateDateRange(startDate, endDate)) {
            setFilters({
              ...state.filters,
              startDate: formatDateToISO(startDate),
              endDate: formatDateToISO(endDate),
            });
            setIsOpen(false);
          } else {
            // Mostrar erro de validação
            alert('Intervalo de datas inválido. Verifique se:\n- As datas não são futuras\n- A data inicial não é posterior à final\n- O intervalo não excede 1 ano');
          }
        } else {
          alert('Formato de data inválido. Use o formato dd/mm/aaaa');
        }
      } finally {
        setIsApplyingFilter(false);
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      ...state.filters,
      startDate: undefined,
      endDate: undefined,
    });
  };

  const hasActiveDateFilter = state.filters.startDate || state.filters.endDate;

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getButtonText = () => {
    if (!hasActiveDateFilter) return 'Filtrar';
    
    const startDate = state.filters.startDate;
    const endDate = state.filters.endDate;
    
    if (!startDate || !endDate) return 'Filtrar';
    
    // Verificar se é uma opção pré-definida
    const today = getToday();
    const yesterday = getYesterday();
    const thisWeek = getThisWeek();
    const lastWeek = getLastWeek();
    const thisMonth = getThisMonth();
    const lastMonth = getLastMonth();
    
    if (startDate === endDate) {
      if (startDate === today) return 'Hoje';
      if (startDate === yesterday) return 'Ontem';
    }
    
    if (startDate === thisWeek.startDate && endDate === thisWeek.endDate) {
      return 'Esta Semana';
    }
    
    if (startDate === lastWeek.startDate && endDate === lastWeek.endDate) {
      return 'Semana Passada';
    }
    
    if (startDate === thisMonth.startDate && endDate === thisMonth.endDate) {
      return 'Este Mês';
    }
    
    if (startDate === lastMonth.startDate && endDate === lastMonth.endDate) {
      return 'Mês Passado';
    }
    
    // Se não for uma opção pré-definida, mostrar intervalo personalizado
    const startFormatted = formatDateForDisplay(startDate);
    const endFormatted = formatDateForDisplay(endDate);
    
    if (startFormatted === endFormatted) {
      return startFormatted;
    }
    
    return `${startFormatted} - ${endFormatted}`;
  };

  return (
    <>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.filterButton, hasActiveDateFilter && styles.filterButtonActive]}
          onPress={() => setIsOpen(true)}
        >
          <Text style={styles.calendarIcon}>📅</Text>
          <Text 
            style={[styles.filterButtonText, hasActiveDateFilter && styles.filterButtonTextActive]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {getButtonText()}
          </Text>
          <Text style={[styles.arrowIcon, isOpen && styles.arrowIconOpen]}>
            ▼
          </Text>
        </TouchableOpacity>
        
        {hasActiveDateFilter && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearFilters}
        >
          <Text style={styles.clearButtonText}>✕</Text>
        </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.dropdownContainer, { maxWidth: screenWidth - 40 }]}>
            <Text style={styles.dropdownTitle}>📅 Filtrar por Data</Text>
            
            {/* Predefined Options */}
            {predefinedOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.optionRow, isApplyingFilter && styles.optionRowDisabled]}
                onPress={() => handlePredefinedOption(option)}
                disabled={isApplyingFilter}
              >
                <Text style={[styles.optionLabel, isApplyingFilter && styles.optionLabelDisabled]}>
                  {option.label}
                </Text>
                <Text style={[styles.optionPeriod, isApplyingFilter && styles.optionPeriodDisabled]}>
                  {option.period}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Separator */}
            <View style={styles.separator} />

            {/* Custom Range */}
            <Text style={styles.customRangeTitle}>📊 Intervalo Personalizado</Text>
            
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>Data Inicial</Text>
              <TouchableOpacity 
                style={styles.dateInputWrapper}
                onPress={() => setShowStartDatePicker(true)}
              >
                <TextInput
                  style={styles.dateInput}
                  value={customStartDate}
                  onChangeText={setCustomStartDate}
                  placeholder="dd/mm/aaaa"
                  placeholderTextColor="#9CA3AF"
                  editable={false}
                />
                <Text style={styles.calendarIconSmall}>📅</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>Data Final</Text>
              <TouchableOpacity 
                style={styles.dateInputWrapper}
                onPress={() => setShowEndDatePicker(true)}
              >
                <TextInput
                  style={styles.dateInput}
                  value={customEndDate}
                  onChangeText={setCustomEndDate}
                  placeholder="dd/mm/aaaa"
                  placeholderTextColor="#9CA3AF"
                  editable={false}
                />
                <Text style={styles.calendarIconSmall}>📅</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.applyButton,
                (!customStartDate || !customEndDate || isApplyingFilter) && styles.applyButtonDisabled
              ]}
              onPress={handleCustomRange}
              disabled={!customStartDate || !customEndDate || isApplyingFilter}
            >
              <Text style={[
                styles.applyButtonText,
                (!customStartDate || !customEndDate || isApplyingFilter) && styles.applyButtonTextDisabled
              ]}>
                {isApplyingFilter ? 'Aplicando...' : 'Aplicar Filtro'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <WebCompatibleDateTimePicker
          value={tempStartDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
          maximumDate={tempEndDate}
        />
      )}

      {showEndDatePicker && (
        <WebCompatibleDateTimePicker
          value={tempEndDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndDateChange}
          minimumDate={tempStartDate}
        />
      )}
    </>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 70,
    maxWidth: 100,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 3,
    marginRight: 3,
    flex: 1,
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  clearButton: {
    marginLeft: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 10,
  },
  calendarIcon: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  arrowIcon: {
    fontSize: 7,
    color: colors.textSecondary,
    transform: [{ rotate: '0deg' }],
  },
  arrowIconOpen: {
    transform: [{ rotate: '180deg' }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingHorizontal: 20,
  },
  dropdownContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  optionPeriod: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '400',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  optionRowDisabled: {
    opacity: 0.5,
  },
  optionLabelDisabled: {
    color: colors.textSecondary,
  },
  optionPeriodDisabled: {
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  customRangeTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  dateInputLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 8,
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  calendarIconSmall: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  applyButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  applyButtonTextDisabled: {
    color: colors.surface,
  },
});
