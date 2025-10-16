import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { WebCompatibleDateTimePicker } from './WebCompatibleDateTimePicker';
import { useTheme } from '../context/ThemeContext';
import { Revenue, Expense } from '../types';
import { apiService } from '../services/apiService';

interface EditTransactionModalProps {
  isVisible: boolean;
  transaction: (Revenue | Expense) & { type: 'revenue' | 'expense' } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isVisible,
  transaction,
  onClose,
  onSuccess,
}) => {
  const { state: themeState } = useTheme();
  const [formData, setFormData] = useState({
    description: '',
    value: '',
    date: new Date(),
    platform: '',
    category: '',
    hoursWorked: '',
    kilometersRidden: '',
    tripsCount: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verificação de segurança para o tema
  if (!themeState || !themeState.colors) {
    return null;
  }

  const styles = createStyles(themeState.colors);

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || '',
        value: transaction.value?.toString() || '',
        date: new Date(transaction.date),
        platform: transaction.type === 'revenue' ? (transaction as Revenue).platform || '' : '',
        category: transaction.type === 'expense' ? (transaction as Expense).category || '' : '',
        hoursWorked: transaction.type === 'revenue' ? (transaction as Revenue).hoursWorked?.toString() || '' : '',
        kilometersRidden: transaction.type === 'revenue' ? (transaction as Revenue).kilometersRidden?.toString() || '' : '',
        tripsCount: transaction.type === 'revenue' ? (transaction as Revenue).tripsCount?.toString() || '' : '',
      });
    }
  }, [transaction]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    // Validação básica obrigatória
    if (!formData.description.trim()) {
      errors.push('Descrição é obrigatória');
    }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      errors.push('Valor deve ser maior que zero');
    }

    // Validações específicas para receitas
    if (transaction?.type === 'revenue') {
      if (!formData.platform) {
        errors.push('Plataforma é obrigatória');
      }
      
      // Validações para campos opcionais (só validar se preenchidos)
      if (formData.hoursWorked && formData.hoursWorked.trim()) {
        const hours = parseFloat(formData.hoursWorked);
        if (isNaN(hours) || hours <= 0) {
          errors.push('Horas trabalhadas devem ser um número maior que zero');
        }
      }
      
      if (formData.kilometersRidden && formData.kilometersRidden.trim()) {
        const km = parseFloat(formData.kilometersRidden);
        if (isNaN(km) || km <= 0) {
          errors.push('Quilômetros rodados devem ser um número maior que zero');
        }
      }
      
      if (formData.tripsCount && formData.tripsCount.trim()) {
        const trips = parseInt(formData.tripsCount);
        if (isNaN(trips) || trips <= 0) {
          errors.push('Número de corridas deve ser um número inteiro maior que zero');
        }
      }
    }

    // Validações específicas para despesas
    if (transaction?.type === 'expense') {
      if (!formData.category) {
        errors.push('Categoria é obrigatória');
      }
    }

    return errors;
  };

  const handleSave = async () => {
    if (!transaction) return;

    // Validar formulário
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      Alert.alert('Erro de Validação', validationErrors.join('\n'));
      return;
    }

    try {
      setIsLoading(true);

      // Preparar dados de atualização seguindo as diretrizes da API
      const updateData: any = {};

      // Campos obrigatórios sempre devem ser enviados com validação rigorosa
      updateData.description = formData.description.trim();
      
      // Garantir que o valor seja um número válido
      const value = parseFloat(formData.value);
      if (isNaN(value) || value <= 0) {
        throw new Error('Valor inválido');
      }
      updateData.value = value;
      
      // Garantir que a data esteja no formato ISO string correto
      updateData.date = formData.date.toISOString();

      if (transaction.type === 'revenue') {
        // Campos específicos de receita
        if (!formData.platform || formData.platform.trim() === '') {
          throw new Error('Plataforma é obrigatória');
        }
        
        // Validar plataforma contra valores aceitos
        const validPlatforms = ['Uber', '99', 'inDrive', 'Cabify', 'Outros'];
        const platform = formData.platform.trim();
        if (!validPlatforms.includes(platform)) {
          throw new Error(`Plataforma inválida. Valores aceitos: ${validPlatforms.join(', ')}`);
        }
        updateData.platform = platform;
        
        // Campos opcionais - só enviar se preenchidos e válidos
        if (formData.hoursWorked && formData.hoursWorked.trim()) {
          const hours = parseFloat(formData.hoursWorked);
          if (!isNaN(hours) && hours > 0) {
            updateData.hoursWorked = hours;
          }
        }
        
        if (formData.kilometersRidden && formData.kilometersRidden.trim()) {
          const km = parseFloat(formData.kilometersRidden);
          if (!isNaN(km) && km > 0) {
            updateData.kilometersRidden = km;
          }
        }
        
        if (formData.tripsCount && formData.tripsCount.trim()) {
          const trips = parseInt(formData.tripsCount);
          if (!isNaN(trips) && trips > 0) {
            updateData.tripsCount = trips;
          }
        }

        await apiService.updateRevenue(transaction.id, updateData);
      } else {
        // Campos específicos de despesa
        if (!formData.category || formData.category.trim() === '') {
          throw new Error('Categoria é obrigatória');
        }
        
        // Validar categoria contra valores aceitos
        const validCategories = ['Combustível', 'Manutenção', 'Alimentação', 'Pedágio', 'Estacionamento', 'Outros'];
        const category = formData.category.trim();
        if (!validCategories.includes(category)) {
          throw new Error(`Categoria inválida. Valores aceitos: ${validCategories.join(', ')}`);
        }
        updateData.category = category;

        await apiService.updateExpense(transaction.id, updateData);
      }

      Alert.alert('Sucesso', 'Lançamento atualizado com sucesso!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao atualizar lançamento:', {
        error,
        errorMessage: error.message,
        errorResponse: error.response,
        transactionId: transaction.id,
        formData
      });
      
      // Tratar diferentes tipos de erro
      let errorMessage = 'Não foi possível atualizar o lançamento. Tente novamente.';
      
      if (error.response?.status === 404) {
        errorMessage = 'Lançamento não encontrado ou você não tem permissão para editá-lo.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Dados inválidos. Verifique os campos preenchidos.';
        if (error.response?.data?.error?.message) {
          errorMessage += `\n\nDetalhes: ${error.response.data.error.message}`;
        }
      } else if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Editar Lançamento</Text>
          <TouchableOpacity onPress={handleSave} disabled={isLoading}>
            <Text style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Digite a descrição"
              placeholderTextColor={themeState.colors.textSecondary}
            />
          </View>

          {/* Value */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor (R$)</Text>
            <TextInput
              style={styles.input}
              value={formData.value}
              onChangeText={(text) => setFormData({ ...formData, value: text })}
              placeholder="0,00"
              placeholderTextColor={themeState.colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>{formatDate(formData.date)}</Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>
          </View>

          {/* Platform (for revenues) */}
          {transaction?.type === 'revenue' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Plataforma</Text>
              <TextInput
                style={styles.input}
                value={formData.platform}
                onChangeText={(text) => setFormData({ ...formData, platform: text })}
                placeholder="Uber, 99, inDrive, etc."
                placeholderTextColor={themeState.colors.textSecondary}
              />
            </View>
          )}

          {/* Category (for expenses) */}
          {transaction?.type === 'expense' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoria</Text>
              <TextInput
                style={styles.input}
                value={formData.category}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
                placeholder="Combustível, Manutenção, etc."
                placeholderTextColor={themeState.colors.textSecondary}
              />
            </View>
          )}

          {/* Additional fields for revenues */}
          {transaction?.type === 'revenue' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Horas Trabalhadas</Text>
                <TextInput
                  style={styles.input}
                  value={formData.hoursWorked}
                  onChangeText={(text) => setFormData({ ...formData, hoursWorked: text })}
                  placeholder="0.0"
                  placeholderTextColor={themeState.colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Quilômetros Rodados</Text>
                <TextInput
                  style={styles.input}
                  value={formData.kilometersRidden}
                  onChangeText={(text) => setFormData({ ...formData, kilometersRidden: text })}
                  placeholder="0.0"
                  placeholderTextColor={themeState.colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Número de Corridas</Text>
                <TextInput
                  style={styles.input}
                  value={formData.tripsCount}
                  onChangeText={(text) => setFormData({ ...formData, tripsCount: text })}
                  placeholder="0"
                  placeholderTextColor={themeState.colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </>
          )}
        </ScrollView>

        {/* Date Picker */}
        {showDatePicker && (
          <WebCompatibleDateTimePicker
            value={formData.date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>
    </Modal>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  saveButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  dateButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  calendarIcon: {
    fontSize: 16,
  },
});
