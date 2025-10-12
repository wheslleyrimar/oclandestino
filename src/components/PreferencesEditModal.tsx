import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConfiguration } from '../context/ConfigurationContext';
import { useTheme } from '../context/ThemeContext';
import { AppPreferences } from '../types';

interface PreferencesEditModalProps {
  visible: boolean;
  onClose: () => void;
}

const PreferencesEditModal: React.FC<PreferencesEditModalProps> = ({ visible, onClose }) => {
  const { state, updatePreferences } = useConfiguration();
  const { state: themeState, setTheme } = useTheme();
  const [formData, setFormData] = useState<Partial<AppPreferences>>({});

  useEffect(() => {
    if (visible) {
      setFormData(state.preferences);
    }
  }, [visible, state.preferences]);

  const handleSave = () => {
    updatePreferences(formData);
    // Update theme if changed
    if (formData.theme && formData.theme !== themeState.theme) {
      setTheme(formData.theme);
    }
    onClose();
    Alert.alert('Sucesso', 'Preferências atualizadas com sucesso!');
  };

  const handleCancel = () => {
    setFormData(state.preferences);
    onClose();
  };

  const toggleNotification = (key: keyof AppPreferences['notifications']) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications!,
        [key]: !formData.notifications![key],
      },
    });
  };

  const OptionButton = ({ 
    title, 
    value, 
    onPress, 
    selected 
  }: { 
    title: string; 
    value: string; 
    onPress: () => void; 
    selected: boolean; 
  }) => (
    <TouchableOpacity
      style={[styles.optionButton, selected && styles.selectedOption]}
      onPress={onPress}
    >
      <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
        {title}
      </Text>
      {selected && <Ionicons name="checkmark" size={20} color="#007AFF" />}
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>Editar Preferências</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Idioma</Text>
            <OptionButton
              title="Português"
              value="pt-BR"
              selected={formData.language === 'pt-BR'}
              onPress={() => setFormData({ ...formData, language: 'pt-BR' })}
            />
            <OptionButton
              title="English"
              value="en-US"
              selected={formData.language === 'en-US'}
              onPress={() => setFormData({ ...formData, language: 'en-US' })}
            />
            <OptionButton
              title="Español"
              value="es-ES"
              selected={formData.language === 'es-ES'}
              onPress={() => setFormData({ ...formData, language: 'es-ES' })}
            />

            <Text style={styles.sectionTitle}>Tema</Text>
            <OptionButton
              title="Claro"
              value="light"
              selected={themeState.theme === 'light'}
              onPress={() => {
                setFormData({ ...formData, theme: 'light' });
                setTheme('light');
              }}
            />
            <OptionButton
              title="Escuro"
              value="dark"
              selected={themeState.theme === 'dark'}
              onPress={() => {
                setFormData({ ...formData, theme: 'dark' });
                setTheme('dark');
              }}
            />
            <OptionButton
              title="Automático"
              value="auto"
              selected={themeState.theme === 'auto'}
              onPress={() => {
                setFormData({ ...formData, theme: 'auto' });
                setTheme('auto');
              }}
            />
            <OptionButton
              title="Sistema"
              value="system"
              selected={themeState.theme === 'system'}
              onPress={() => {
                setFormData({ ...formData, theme: 'system' });
                setTheme('system');
              }}
            />

            <Text style={styles.sectionTitle}>Moeda</Text>
            <OptionButton
              title="Real (R$)"
              value="BRL"
              selected={formData.currency === 'BRL'}
              onPress={() => setFormData({ ...formData, currency: 'BRL' })}
            />
            <OptionButton
              title="Dólar ($)"
              value="USD"
              selected={formData.currency === 'USD'}
              onPress={() => setFormData({ ...formData, currency: 'USD' })}
            />
            <OptionButton
              title="Euro (€)"
              value="EUR"
              selected={formData.currency === 'EUR'}
              onPress={() => setFormData({ ...formData, currency: 'EUR' })}
            />

            <Text style={styles.sectionTitle}>Formato de Data</Text>
            <OptionButton
              title="DD/MM/YYYY"
              value="DD/MM/YYYY"
              selected={formData.dateFormat === 'DD/MM/YYYY'}
              onPress={() => setFormData({ ...formData, dateFormat: 'DD/MM/YYYY' })}
            />
            <OptionButton
              title="MM/DD/YYYY"
              value="MM/DD/YYYY"
              selected={formData.dateFormat === 'MM/DD/YYYY'}
              onPress={() => setFormData({ ...formData, dateFormat: 'MM/DD/YYYY' })}
            />
            <OptionButton
              title="YYYY-MM-DD"
              value="YYYY-MM-DD"
              selected={formData.dateFormat === 'YYYY-MM-DD'}
              onPress={() => setFormData({ ...formData, dateFormat: 'YYYY-MM-DD' })}
            />

            <Text style={styles.sectionTitle}>Formato de Hora</Text>
            <OptionButton
              title="24 horas"
              value="24h"
              selected={formData.timeFormat === '24h'}
              onPress={() => setFormData({ ...formData, timeFormat: '24h' })}
            />
            <OptionButton
              title="12 horas"
              value="12h"
              selected={formData.timeFormat === '12h'}
              onPress={() => setFormData({ ...formData, timeFormat: '12h' })}
            />

            <Text style={styles.sectionTitle}>Notificações</Text>
            
            <View style={styles.notificationItem}>
              <Text style={styles.notificationLabel}>Ganhos</Text>
              <Switch
                value={formData.notifications?.earnings || false}
                onValueChange={() => toggleNotification('earnings')}
                trackColor={{ false: '#e0e0e0', true: '#E3F2FD' }}
                thumbColor={formData.notifications?.earnings ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            <View style={styles.notificationItem}>
              <Text style={styles.notificationLabel}>Metas</Text>
              <Switch
                value={formData.notifications?.goals || false}
                onValueChange={() => toggleNotification('goals')}
                trackColor={{ false: '#e0e0e0', true: '#E3F2FD' }}
                thumbColor={formData.notifications?.goals ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            <View style={styles.notificationItem}>
              <Text style={styles.notificationLabel}>Lembretes</Text>
              <Switch
                value={formData.notifications?.reminders || false}
                onValueChange={() => toggleNotification('reminders')}
                trackColor={{ false: '#e0e0e0', true: '#E3F2FD' }}
                thumbColor={formData.notifications?.reminders ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            <View style={styles.notificationItem}>
              <Text style={styles.notificationLabel}>Promoções</Text>
              <Switch
                value={formData.notifications?.promotions || false}
                onValueChange={() => toggleNotification('promotions')}
                trackColor={{ false: '#e0e0e0', true: '#E3F2FD' }}
                thumbColor={formData.notifications?.promotions ? '#007AFF' : '#f4f3f4'}
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
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedOption: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  notificationLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
});

export default PreferencesEditModal;
