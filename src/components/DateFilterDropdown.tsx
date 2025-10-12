import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
} from 'react-native';
import { useFinance } from '../context/FinanceContext';

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
  const [isOpen, setIsOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

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
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0],
    };
  };

  const getLastWeek = () => {
    const today = new Date();
    const startOfLastWeek = new Date(today);
    startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
    
    return {
      startDate: startOfLastWeek.toISOString().split('T')[0],
      endDate: endOfLastWeek.toISOString().split('T')[0],
    };
  };

  const getThisMonth = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return {
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0],
    };
  };

  const getLastMonth = () => {
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    
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

  const handlePredefinedOption = (option: PredefinedOption) => {
    const dates = option.getDates();
    setFilters({
      ...state.filters,
      startDate: dates.startDate,
      endDate: dates.endDate,
    });
    setIsOpen(false);
  };

  const handleCustomRange = () => {
    if (customStartDate && customEndDate) {
      setFilters({
        ...state.filters,
        startDate: customStartDate,
        endDate: customEndDate,
      });
      setIsOpen(false);
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
          <Text style={styles.calendarIcon}>⚡</Text>
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
            <Text style={styles.clearButtonText}>×</Text>
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
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownTitle}>Filtrar por Data</Text>
            
            {/* Predefined Options */}
            {predefinedOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionRow}
                onPress={() => handlePredefinedOption(option)}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionPeriod}>{option.period}</Text>
              </TouchableOpacity>
            ))}

            {/* Separator */}
            <View style={styles.separator} />

            {/* Custom Range */}
            <Text style={styles.customRangeTitle}>Intervalo Personalizado</Text>
            
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>Data Inicial</Text>
              <View style={styles.dateInputWrapper}>
                <TextInput
                  style={styles.dateInput}
                  value={customStartDate}
                  onChangeText={setCustomStartDate}
                  placeholder="dd/mm/aaaa"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.calendarIconSmall}>⚡</Text>
              </View>
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>Data Final</Text>
              <View style={styles.dateInputWrapper}>
                <TextInput
                  style={styles.dateInput}
                  value={customEndDate}
                  onChangeText={setCustomEndDate}
                  placeholder="dd/mm/aaaa"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.calendarIconSmall}>⚡</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.applyButton,
                (!customStartDate || !customEndDate) && styles.applyButtonDisabled
              ]}
              onPress={handleCustomRange}
              disabled={!customStartDate || !customEndDate}
            >
              <Text style={[
                styles.applyButtonText,
                (!customStartDate || !customEndDate) && styles.applyButtonTextDisabled
              ]}>
                Aplicar Filtro
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minWidth: 100,
    maxWidth: 140,
  },
  filterButtonActive: {
    backgroundColor: '#E8F4FD',
    borderColor: '#B3D9FF',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666666',
    marginLeft: 6,
    marginRight: 6,
    flex: 1,
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#1E88E5',
  },
  clearButton: {
    marginLeft: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  clearButtonText: {
    color: '#999999',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 14,
  },
  calendarIcon: {
    fontSize: 14,
    color: '#666666',
  },
  arrowIcon: {
    fontSize: 10,
    color: '#999999',
    transform: [{ rotate: '0deg' }],
  },
  arrowIconOpen: {
    transform: [{ rotate: '180deg' }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 20,
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    minWidth: 280,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  optionLabel: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '400',
  },
  optionPeriod: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '400',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
  },
  customRangeTitle: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
    marginBottom: 16,
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  dateInputLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 8,
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateInput: {
    flex: 1,
    fontSize: 14,
    color: '#4A5568',
  },
  calendarIconSmall: {
    fontSize: 14,
    color: '#999999',
    marginLeft: 8,
  },
  applyButton: {
    backgroundColor: '#E8F4FD',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#B3D9FF',
  },
  applyButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E5E5E5',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E88E5',
  },
  applyButtonTextDisabled: {
    color: '#999999',
  },
});
