import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { ExpenseCategory } from '../types';

interface ExpenseFormProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  isVisible,
  onClose,
}) => {
  const { addExpense } = useFinance();
  const [formData, setFormData] = useState({
    value: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Combustível' as ExpenseCategory,
  });

  const categories: ExpenseCategory[] = [
    'Combustível',
    'Manutenção',
    'Alimentação',
    'Pedágio',
    'Estacionamento',
    'Outros',
  ];

  const handleSubmit = () => {
    if (!formData.value || !formData.description) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const value = parseFloat(formData.value.replace(',', '.'));
    if (isNaN(value) || value <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    addExpense({
      value,
      date: formData.date,
      description: formData.description,
      category: formData.category,
    });

    // Reset form
    setFormData({
      value: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'Combustível',
    });

    Alert.alert('Sucesso', 'Gasto adicionado com sucesso!');
    onClose();
  };

  const getCategoryIcon = (category: ExpenseCategory): string => {
    const icons: { [key in ExpenseCategory]: string } = {
      'Combustível': '⛽',
      'Manutenção': '🔧',
      'Alimentação': '🍽️',
      'Pedágio': '🛣️',
      'Estacionamento': '🅿️',
      'Outros': '📦',
    };
    return icons[category];
  };

  const renderForm = () => (
    <View style={styles.form}>
      {/* Value */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Valor (R$) *</Text>
        <TextInput
          style={styles.input}
          value={formData.value}
          onChangeText={(text) => setFormData({ ...formData, value: text })}
          placeholder="0,00"
          keyboardType="decimal-pad"
        />
      </View>

      {/* Date */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Data *</Text>
        <TextInput
          style={styles.input}
          value={formData.date}
          onChangeText={(text) => setFormData({ ...formData, date: text })}
          placeholder="YYYY-MM-DD"
        />
      </View>

      {/* Description */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descrição *</Text>
        <TextInput
          style={styles.input}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Ex: Abastecimento posto Shell"
        />
      </View>

      {/* Category */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Categoria *</Text>
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                formData.category === category && styles.categoryButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, category })}
            >
              <Text style={styles.categoryIcon}>
                {getCategoryIcon(category)}
              </Text>
              <Text
                style={[
                  styles.categoryButtonText,
                  formData.category === category && styles.categoryButtonTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Adicionar Gasto</Text>
      </TouchableOpacity>
    </View>
  );

  if (!isVisible) {
    return (
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Novo Gasto</Text>
            <View style={styles.placeholder} />
          </View>
          <ScrollView style={styles.content}>
            {renderForm()}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  }

  return renderForm();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  form: {
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});