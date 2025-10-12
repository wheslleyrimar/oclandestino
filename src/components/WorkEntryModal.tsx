import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useFinance } from '../context/FinanceContext';

interface WorkEntryModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const WorkEntryModal: React.FC<WorkEntryModalProps> = ({
  isVisible,
  onClose,
}) => {
  const { addRevenue } = useFinance();
  const [formData, setFormData] = useState({
    platform: 'Uber' as 'Uber' | '99' | 'inDrive' | 'Cabify' | 'Outros',
    value: '',
    hoursWorked: '',
    kilometersRidden: '',
    tripsCount: '',
    description: '',
  });

  const platforms = ['Uber', '99', 'inDrive', 'Cabify', 'Outros'] as const;

  const handleSubmit = () => {
    if (!formData.value || !formData.hoursWorked) {
      Alert.alert('Erro', 'Preencha pelo menos o valor e horas trabalhadas');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    addRevenue({
      value: parseFloat(formData.value),
      date: today,
      description: formData.description || `Corridas ${formData.platform}`,
      platform: formData.platform,
      hoursWorked: parseFloat(formData.hoursWorked) || 0,
      kilometersRidden: parseFloat(formData.kilometersRidden) || 0,
      tripsCount: parseInt(formData.tripsCount) || 0,
    });

    // Reset form
    setFormData({
      platform: 'Uber' as 'Uber' | '99' | 'inDrive' | 'Cabify' | 'Outros',
      value: '',
      hoursWorked: '',
      kilometersRidden: '',
      tripsCount: '',
      description: '',
    });

    onClose();
  };

  const handleClose = () => {
    setFormData({
      platform: 'Uber' as 'Uber' | '99' | 'inDrive' | 'Cabify' | 'Outros',
      value: '',
      hoursWorked: '',
      kilometersRidden: '',
      tripsCount: '',
      description: '',
    });
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Registrar Trabalho</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.saveButton}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Platform Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Plataforma</Text>
            <View style={styles.platformGrid}>
              {platforms.map((platform) => (
                <TouchableOpacity
                  key={platform}
                  style={[
                    styles.platformButton,
                    formData.platform === platform && styles.selectedPlatform,
                  ]}
                  onPress={() => setFormData({ ...formData, platform })}
                >
                  <Text
                    style={[
                      styles.platformText,
                      formData.platform === platform && styles.selectedPlatformText,
                    ]}
                  >
                    {platform}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Value Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Valor Ganho (R$)</Text>
            <TextInput
              style={styles.input}
              value={formData.value}
              onChangeText={(text) => setFormData({ ...formData, value: text })}
              placeholder="0,00"
              keyboardType="numeric"
            />
          </View>

          {/* Hours Worked */}
          <View style={styles.section}>
            <Text style={styles.label}>Horas Trabalhadas</Text>
            <TextInput
              style={styles.input}
              value={formData.hoursWorked}
              onChangeText={(text) => setFormData({ ...formData, hoursWorked: text })}
              placeholder="0.0"
              keyboardType="numeric"
            />
          </View>

          {/* Kilometers */}
          <View style={styles.section}>
            <Text style={styles.label}>Quilômetros Rodados</Text>
            <TextInput
              style={styles.input}
              value={formData.kilometersRidden}
              onChangeText={(text) => setFormData({ ...formData, kilometersRidden: text })}
              placeholder="0.0"
              keyboardType="numeric"
            />
          </View>

          {/* Trips Count */}
          <View style={styles.section}>
            <Text style={styles.label}>Número de Corridas</Text>
            <TextInput
              style={styles.input}
              value={formData.tripsCount}
              onChangeText={(text) => setFormData({ ...formData, tripsCount: text })}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Descrição (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Ex: Corridas da manhã, região centro..."
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6b7280',
  },
  saveButton: {
    fontSize: 16,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  selectedPlatform: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  platformText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedPlatformText: {
    color: '#ffffff',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});
