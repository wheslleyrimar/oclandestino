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
import { Platform } from '../types';

interface RevenueFormProps {
  isVisible: boolean;
  onClose: () => void;
}

export const RevenueForm: React.FC<RevenueFormProps> = ({
  isVisible,
  onClose,
}) => {
  const { addRevenue } = useFinance();
  const [formData, setFormData] = useState({
    value: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    platform: 'Uber' as Platform,
    hoursWorked: '',
    kilometersRidden: '',
    tripsCount: '',
  });

  const platforms: Platform[] = ['Uber', '99', 'inDrive', 'Cabify', 'Outros'];

  const handleSubmit = async () => {
    if (!formData.value || !formData.description) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const value = parseFloat(formData.value.replace(',', '.'));
    if (isNaN(value) || value <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    try {
      await addRevenue({
        value,
        date: formData.date,
        description: formData.description,
        platform: formData.platform,
        hoursWorked: formData.hoursWorked ? parseFloat(formData.hoursWorked.replace(',', '.')) : undefined,
        kilometersRidden: formData.kilometersRidden ? parseFloat(formData.kilometersRidden.replace(',', '.')) : undefined,
        tripsCount: formData.tripsCount ? parseInt(formData.tripsCount) : undefined,
      });

      // Reset form
      setFormData({
        value: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        platform: 'Uber',
        hoursWorked: '',
        kilometersRidden: '',
        tripsCount: '',
      });

      Alert.alert('Sucesso', 'Receita adicionada com sucesso!');
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar receita. Tente novamente.');
    }
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
          placeholder="Ex: Corridas manhã"
        />
      </View>

      {/* Platform */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Plataforma *</Text>
        <View style={styles.platformContainer}>
          {platforms.map((platform) => (
            <TouchableOpacity
              key={platform}
              style={[
                styles.platformButton,
                formData.platform === platform && styles.platformButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, platform })}
            >
              <Text
                style={[
                  styles.platformButtonText,
                  formData.platform === platform && styles.platformButtonTextActive,
                ]}
              >
                {platform}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Hours Worked */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Horas Trabalhadas</Text>
        <TextInput
          style={styles.input}
          value={formData.hoursWorked}
          onChangeText={(text) => setFormData({ ...formData, hoursWorked: text })}
          placeholder="0,0"
          keyboardType="decimal-pad"
        />
      </View>

      {/* Kilometers */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Quilômetros Rodados</Text>
        <TextInput
          style={styles.input}
          value={formData.kilometersRidden}
          onChangeText={(text) => setFormData({ ...formData, kilometersRidden: text })}
          placeholder="0,0"
          keyboardType="decimal-pad"
        />
      </View>

      {/* Trips Count */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Número de Corridas</Text>
        <TextInput
          style={styles.input}
          value={formData.tripsCount}
          onChangeText={(text) => setFormData({ ...formData, tripsCount: text })}
          placeholder="0"
          keyboardType="number-pad"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Adicionar Receita</Text>
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
            <Text style={styles.title}>Nova Receita</Text>
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
  platformContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  platformButtonActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  platformButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  platformButtonTextActive: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#22c55e',
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