import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConfiguration } from '../context/ConfigurationContext';
import { PerformanceGoals } from '../types';

interface GoalsEditModalProps {
  visible: boolean;
  onClose: () => void;
}

const GoalsEditModal: React.FC<GoalsEditModalProps> = ({ visible, onClose }) => {
  const { state, updateGoals } = useConfiguration();
  const [formData, setFormData] = useState<Partial<PerformanceGoals>>({});

  useEffect(() => {
    if (visible) {
      setFormData(state.goals);
    }
  }, [visible, state.goals]);

  const handleSave = () => {
    const goals = {
      monthlyEarningsGoal: Number(formData.monthlyEarningsGoal) || 0,
      dailyTripsGoal: Number(formData.dailyTripsGoal) || 0,
      weeklyHoursGoal: Number(formData.weeklyHoursGoal) || 0,
      monthlyHoursGoal: Number(formData.monthlyHoursGoal) || 0,
      averageEarningsPerHourGoal: Number(formData.averageEarningsPerHourGoal) || 0,
      averageEarningsPerTripGoal: Number(formData.averageEarningsPerTripGoal) || 0,
      workingDaysPerWeekGoal: Number(formData.workingDaysPerWeekGoal) || 0,
    };

    updateGoals(goals);
    onClose();
    Alert.alert('Sucesso', 'Metas atualizadas com sucesso!');
  };

  const handleCancel = () => {
    setFormData(state.goals);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Metas</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Metas de Ganhos</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Meta de Ganhos Mensais (R$)</Text>
              <TextInput
                style={styles.input}
                value={formData.monthlyEarningsGoal?.toString() || ''}
                onChangeText={(text) => setFormData({ ...formData, monthlyEarningsGoal: Number(text) })}
                placeholder="5000"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Meta de Ganho por Hora (R$)</Text>
              <TextInput
                style={styles.input}
                value={formData.averageEarningsPerHourGoal?.toString() || ''}
                onChangeText={(text) => setFormData({ ...formData, averageEarningsPerHourGoal: Number(text) })}
                placeholder="30"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Meta de Ganho por Corrida (R$)</Text>
              <TextInput
                style={styles.input}
                value={formData.averageEarningsPerTripGoal?.toString() || ''}
                onChangeText={(text) => setFormData({ ...formData, averageEarningsPerTripGoal: Number(text) })}
                placeholder="15"
                keyboardType="numeric"
              />
            </View>

            <Text style={styles.sectionTitle}>Metas de Trabalho</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Meta de Corridas Diárias</Text>
              <TextInput
                style={styles.input}
                value={formData.dailyTripsGoal?.toString() || ''}
                onChangeText={(text) => setFormData({ ...formData, dailyTripsGoal: Number(text) })}
                placeholder="20"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Meta de Horas Semanais</Text>
              <TextInput
                style={styles.input}
                value={formData.weeklyHoursGoal?.toString() || ''}
                onChangeText={(text) => setFormData({ ...formData, weeklyHoursGoal: Number(text) })}
                placeholder="40"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Meta de Horas Mensais</Text>
              <TextInput
                style={styles.input}
                value={formData.monthlyHoursGoal?.toString() || ''}
                onChangeText={(text) => setFormData({ ...formData, monthlyHoursGoal: Number(text) })}
                placeholder="160"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Meta de Dias de Trabalho por Semana</Text>
              <TextInput
                style={styles.input}
                value={formData.workingDaysPerWeekGoal?.toString() || ''}
                onChangeText={(text) => setFormData({ ...formData, workingDaysPerWeekGoal: Number(text) })}
                placeholder="5"
                keyboardType="numeric"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 24,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
});

export default GoalsEditModal;
