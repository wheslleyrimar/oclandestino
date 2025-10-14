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

  const handleSave = async () => {
    if (!transaction) return;

    try {
      setIsLoading(true);

      const updateData = {
        description: formData.description,
        value: parseFloat(formData.value),
        date: formData.date.toISOString().split('T')[0],
      };

      if (transaction.type === 'revenue') {
        const revenueData = {
          ...updateData,
          platform: formData.platform,
          hoursWorked: formData.hoursWorked ? parseFloat(formData.hoursWorked) : undefined,
          kilometersRidden: formData.kilometersRidden ? parseFloat(formData.kilometersRidden) : undefined,
          tripsCount: formData.tripsCount ? parseInt(formData.tripsCount) : undefined,
        };

        await apiService.updateRevenue(transaction.id, revenueData);
      } else {
        const expenseData = {
          ...updateData,
          category: formData.category,
        };

        await apiService.updateExpense(transaction.id, expenseData);
      }

      Alert.alert('Sucesso', 'Lançamento atualizado com sucesso!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar lançamento:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o lançamento. Tente novamente.');
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
