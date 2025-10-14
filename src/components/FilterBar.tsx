import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';

export const FilterBar: React.FC = () => {
  const { state, setFilters } = useFinance();
  const { state: themeState } = useTheme();
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState(state.filters);

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = {};
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setShowFilters(false);
  };

  const hasActiveFilters = Object.keys(state.filters).some(
    key => state.filters[key as keyof typeof state.filters]
  );

  const styles = createStyles(themeState.colors);

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(true)}
        >
          <Text style={[styles.filterButtonText, hasActiveFilters && styles.filterButtonTextActive]}>
            🔍 Filtros {hasActiveFilters && '•'}
          </Text>
        </TouchableOpacity>

        {hasActiveFilters && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearFilters}
          >
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={handleApplyFilters}>
              <Text style={styles.applyButton}>Aplicar</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Content */}
          <View style={styles.modalContent}>
            {/* Date Range */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Período</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Data Inicial</Text>
                <TextInput
                  style={styles.input}
                  value={tempFilters.startDate || ''}
                  onChangeText={(text) => setTempFilters({ ...tempFilters, startDate: text })}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Data Final</Text>
                <TextInput
                  style={styles.input}
                  value={tempFilters.endDate || ''}
                  onChangeText={(text) => setTempFilters({ ...tempFilters, endDate: text })}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>

            {/* Platform Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Plataforma</Text>
              <View style={styles.optionsContainer}>
                {['Uber', '99', 'inDrive', 'Cabify', 'Outros'].map((platform) => (
                  <TouchableOpacity
                    key={platform}
                    style={[
                      styles.optionButton,
                      tempFilters.platform === platform && styles.optionButtonActive,
                    ]}
                    onPress={() => 
                      setTempFilters({ 
                        ...tempFilters, 
                        platform: tempFilters.platform === platform ? undefined : platform 
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        tempFilters.platform === platform && styles.optionButtonTextActive,
                      ]}
                    >
                      {platform}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Categoria</Text>
              <View style={styles.optionsContainer}>
                {['Combustível', 'Manutenção', 'Alimentação', 'Pedágio', 'Estacionamento', 'Outros'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.optionButton,
                      tempFilters.category === category && styles.optionButtonActive,
                    ]}
                    onPress={() => 
                      setTempFilters({ 
                        ...tempFilters, 
                        category: tempFilters.category === category ? undefined : category 
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        tempFilters.category === category && styles.optionButtonTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  clearButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    fontSize: 24,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  applyButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  optionButtonTextActive: {
    color: '#ffffff',
  },
});