import React, { useState } from 'react';
import { Platform, View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface WebCompatibleDateTimePickerProps {
  value: Date;
  mode: 'date' | 'time' | 'datetime';
  display?: 'default' | 'spinner' | 'calendar' | 'clock';
  onChange: (event: any, selectedDate?: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  style?: any;
}

export const WebCompatibleDateTimePicker: React.FC<WebCompatibleDateTimePickerProps> = ({
  value,
  mode,
  display,
  onChange,
  maximumDate,
  minimumDate,
  style
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Para web, usar um modal com input HTML nativo
  if (Platform.OS === 'web') {
    const handleWebDateChange = (event: any, selectedDate?: Date) => {
      setShowPicker(false);
      if (selectedDate) {
        onChange(event, selectedDate);
      }
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('pt-BR');
    };

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const getDisplayText = () => {
      switch (mode) {
        case 'date':
          return formatDate(value);
        case 'time':
          return formatTime(value);
        case 'datetime':
          return `${formatDate(value)} ${formatTime(value)}`;
        default:
          return formatDate(value);
      }
    };

    const formatDateForInput = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatTimeForInput = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const handleInputChange = (inputValue: string) => {
      let newDate: Date;
      
      if (mode === 'date') {
        newDate = new Date(inputValue + 'T00:00:00');
      } else if (mode === 'time') {
        const [hours, minutes] = inputValue.split(':');
        newDate = new Date(value);
        newDate.setHours(parseInt(hours), parseInt(minutes));
      } else {
        // datetime mode
        const [datePart, timePart] = inputValue.split('T');
        newDate = new Date(datePart + 'T' + timePart);
      }
      
      onChange({ type: 'set' }, newDate);
    };

    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.buttonText}>{getDisplayText()}</Text>
        </TouchableOpacity>
        
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {mode === 'date' ? 'Selecionar Data' : 
                   mode === 'time' ? 'Selecionar Hora' : 
                   'Selecionar Data e Hora'}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.pickerContainer}>
                {mode === 'date' ? (
                  <input
                    type="date"
                    value={formatDateForInput(value)}
                    onChange={(e) => handleInputChange(e.target.value)}
                    style={styles.webInput}
                    max={maximumDate ? formatDateForInput(maximumDate) : undefined}
                    min={minimumDate ? formatDateForInput(minimumDate) : undefined}
                  />
                ) : mode === 'time' ? (
                  <input
                    type="time"
                    value={formatTimeForInput(value)}
                    onChange={(e) => handleInputChange(e.target.value)}
                    style={styles.webInput}
                  />
                ) : (
                  <input
                    type="datetime-local"
                    value={formatDateForInput(value) + 'T' + formatTimeForInput(value)}
                    onChange={(e) => handleInputChange(e.target.value)}
                    style={styles.webInput}
                    max={maximumDate ? formatDateForInput(maximumDate) + 'T' + formatTimeForInput(maximumDate) : undefined}
                    min={minimumDate ? formatDateForInput(minimumDate) + 'T' + formatTimeForInput(minimumDate) : undefined}
                  />
                )}
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.confirmButton, { backgroundColor: '#3b82f6' }]}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Para mobile, usar o DateTimePicker nativo diretamente
  return (
    <DateTimePicker
      value={value}
      mode={mode}
      display={display || (Platform.OS === 'ios' ? 'spinner' : 'default')}
      onChange={onChange}
      maximumDate={maximumDate}
      minimumDate={minimumDate}
      style={style}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 16,
    color: '#374151',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6b7280',
  },
  pickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    width: '100%',
    marginBottom: 20,
  },
  webInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#374151',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  confirmButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    minWidth: 120,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});