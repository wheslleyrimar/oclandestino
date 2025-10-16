import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';
import { Revenue, Expense } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useCustomAlert } from '../hooks/useCustomAlert';
import CustomAlert from './CustomAlert';
import CustomConfirm from './CustomConfirm';
import { WebCompatibleDateTimePicker } from './WebCompatibleDateTimePicker';

interface FormData {
  selectedDate: Date;
  uberRevenue: {
    value: string;
    rides: string;
  };
  ninetyNineRevenue: {
    value: string;
    rides: string;
  };
  otherAppsRevenue: {
    appName: string;
    value: string;
    rides: string;
  };
  mileage: {
    kilometers: string;
  };
  workHours: {
    hours: string;
  };
  fuelExpense: {
    value: string;
  };
}

interface NewEntryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const NewEntryModal: React.FC<NewEntryModalProps> = ({ isVisible, onClose, onSuccess }) => {
  const { state: themeState } = useTheme();
  const { alertState, confirmState, hideAlert, hideConfirm, showSuccess, showError, showConfirmDialog } = useCustomAlert();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    selectedDate: new Date(),
    uberRevenue: { value: '', rides: '' },
    ninetyNineRevenue: { value: '', rides: '' },
    otherAppsRevenue: { appName: '', value: '', rides: '' },
    mileage: { kilometers: '' },
    workHours: { hours: '' },
    fuelExpense: { value: '' },
  });

  const totalSteps = 7;

  const steps = [
    {
      title: 'Selecionar Data',
      icon: '📅',
      description: 'Escolha a data para os lançamentos',
      fields: [],
    },
    {
      title: 'Receita da Uber',
      icon: '🚗',
      description: 'Informe os valores recebidos e número de corridas realizadas na Uber hoje',
      fields: [
        { key: 'uberRevenue.value', label: 'Valor Recebido (opcional)', placeholder: 'R$ 0,00' },
        { key: 'uberRevenue.rides', label: 'Número de Corridas (opcional)', placeholder: '0' },
      ],
    },
    {
      title: 'Receita da 99',
      icon: '🚕',
      description: 'Informe os valores recebidos e número de corridas realizadas na 99 hoje',
      fields: [
        { key: 'ninetyNineRevenue.value', label: 'Valor Recebido (opcional)', placeholder: 'R$ 0,00' },
        { key: 'ninetyNineRevenue.rides', label: 'Número de Corridas (opcional)', placeholder: '0' },
      ],
    },
    {
      title: 'Outros Apps',
      icon: '📱',
      description: 'Informe os valores recebidos de outros aplicativos como inDrive, Cabify, etc.',
      fields: [
        { key: 'otherAppsRevenue.appName', label: 'Nome do App (opcional)', placeholder: 'inDrive, Cabify, etc.' },
        { key: 'otherAppsRevenue.value', label: 'Valor Recebido (opcional)', placeholder: 'R$ 0,00' },
        { key: 'otherAppsRevenue.rides', label: 'Número de Corridas (opcional)', placeholder: '0' },
      ],
    },
    {
      title: 'Quilometragem',
      icon: '🛣️',
      description: 'Informe a quilometragem total rodada no dia',
      fields: [
        { key: 'mileage.kilometers', label: 'Total de KMs rodados', placeholder: '0' },
      ],
    },
    {
      title: 'Horas Trabalhadas',
      icon: '⏰',
      description: 'Informe o total de horas trabalhadas no dia',
      fields: [
        { key: 'workHours.hours', label: 'Total de horas', placeholder: '0' },
      ],
    },
    {
      title: 'Combustível',
      icon: '⛽',
      description: 'Informe o valor gasto em combustível no dia',
      fields: [
        { key: 'fuelExpense.value', label: 'Valor gasto em combustível', placeholder: 'R$ 0,00' },
      ],
    },
  ];

  const updateFormData = (key: string, value: string) => {
    const keys = key.split('.');
    setFormData(prev => ({
      ...prev,
      [keys[0]]: {
        ...prev[keys[0] as keyof FormData],
        [keys[1]]: value,
      },
    }));
  };

  const getFieldValue = (key: string): string => {
    const keys = key.split('.');
    return (formData[keys[0] as keyof FormData] as any)[keys[1]] || '';
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalizar formulário
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };


  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Verificar se há token de autenticação
      const token = await authService.getStoredToken();
      if (!token) {
        showError(
          'Você precisa estar logado para cadastrar lançamentos.',
          'Erro de Autenticação'
        );
        return;
      }
      
      // Formato ISO 8601 com timezone UTC usando a data selecionada
      const selectedDateISO = formData.selectedDate.toISOString().split('T')[0] + 'T00:00:00Z';
      const promises: Promise<any>[] = [];

      // Criar receitas
      if (formData.uberRevenue.value && parseFloat(formData.uberRevenue.value) > 0) {
        const uberRevenue: any = {
          value: parseFloat(formData.uberRevenue.value),
          date: selectedDateISO,
          description: `Receita Uber - ${formData.uberRevenue.rides || '0'} corridas`,
          platform: 'Uber',
        };
        
        // Adicionar campos opcionais apenas se tiverem valores válidos (> 0)
        if (formData.uberRevenue.rides && parseInt(formData.uberRevenue.rides) > 0) {
          uberRevenue.tripsCount = parseInt(formData.uberRevenue.rides);
        }
        if (formData.workHours.hours && parseFloat(formData.workHours.hours) > 0) {
          uberRevenue.hoursWorked = parseFloat(formData.workHours.hours);
        }
        if (formData.mileage.kilometers && parseFloat(formData.mileage.kilometers) > 0) {
          uberRevenue.kilometersRidden = parseFloat(formData.mileage.kilometers);
        }
        
        // Validar campos obrigatórios
        if (!uberRevenue.value || uberRevenue.value <= 0) {
          throw new Error('Valor da receita Uber deve ser maior que 0');
        }
        if (!uberRevenue.date) {
          throw new Error('Data é obrigatória');
        }
        if (!uberRevenue.description || uberRevenue.description.trim().length === 0) {
          throw new Error('Descrição é obrigatória');
        }
        if (!uberRevenue.platform) {
          throw new Error('Plataforma é obrigatória');
        }
        
        promises.push(apiService.createRevenue(uberRevenue));
      }

      if (formData.ninetyNineRevenue.value && parseFloat(formData.ninetyNineRevenue.value) > 0) {
        const ninetyNineRevenue: any = {
          value: parseFloat(formData.ninetyNineRevenue.value),
          date: selectedDateISO,
          description: `Receita 99 - ${formData.ninetyNineRevenue.rides || '0'} corridas`,
          platform: '99',
        };
        
        // Adicionar campos opcionais apenas se tiverem valores válidos (> 0)
        if (formData.ninetyNineRevenue.rides && parseInt(formData.ninetyNineRevenue.rides) > 0) {
          ninetyNineRevenue.tripsCount = parseInt(formData.ninetyNineRevenue.rides);
        }
        if (formData.workHours.hours && parseFloat(formData.workHours.hours) > 0) {
          ninetyNineRevenue.hoursWorked = parseFloat(formData.workHours.hours);
        }
        if (formData.mileage.kilometers && parseFloat(formData.mileage.kilometers) > 0) {
          ninetyNineRevenue.kilometersRidden = parseFloat(formData.mileage.kilometers);
        }
        
        // Validar campos obrigatórios
        if (!ninetyNineRevenue.value || ninetyNineRevenue.value <= 0) {
          throw new Error('Valor da receita 99 deve ser maior que 0');
        }
        if (!ninetyNineRevenue.date) {
          throw new Error('Data é obrigatória');
        }
        if (!ninetyNineRevenue.description || ninetyNineRevenue.description.trim().length === 0) {
          throw new Error('Descrição é obrigatória');
        }
        if (!ninetyNineRevenue.platform) {
          throw new Error('Plataforma é obrigatória');
        }
        
        promises.push(apiService.createRevenue(ninetyNineRevenue));
      }

      if (formData.otherAppsRevenue.value && parseFloat(formData.otherAppsRevenue.value) > 0) {
        const otherAppsRevenue: any = {
          value: parseFloat(formData.otherAppsRevenue.value),
          date: selectedDateISO,
          description: `Receita ${formData.otherAppsRevenue.appName || 'Outros Apps'} - ${formData.otherAppsRevenue.rides || '0'} corridas`,
          platform: formData.otherAppsRevenue.appName === 'inDrive' ? 'inDrive' : 
                   formData.otherAppsRevenue.appName === 'Cabify' ? 'Cabify' : 'Outros',
        };
        
        // Adicionar campos opcionais apenas se tiverem valores válidos (> 0)
        if (formData.otherAppsRevenue.rides && parseInt(formData.otherAppsRevenue.rides) > 0) {
          otherAppsRevenue.tripsCount = parseInt(formData.otherAppsRevenue.rides);
        }
        if (formData.workHours.hours && parseFloat(formData.workHours.hours) > 0) {
          otherAppsRevenue.hoursWorked = parseFloat(formData.workHours.hours);
        }
        if (formData.mileage.kilometers && parseFloat(formData.mileage.kilometers) > 0) {
          otherAppsRevenue.kilometersRidden = parseFloat(formData.mileage.kilometers);
        }
        
        // Validar campos obrigatórios
        if (!otherAppsRevenue.value || otherAppsRevenue.value <= 0) {
          throw new Error('Valor da receita de outros apps deve ser maior que 0');
        }
        if (!otherAppsRevenue.date) {
          throw new Error('Data é obrigatória');
        }
        if (!otherAppsRevenue.description || otherAppsRevenue.description.trim().length === 0) {
          throw new Error('Descrição é obrigatória');
        }
        if (!otherAppsRevenue.platform) {
          throw new Error('Plataforma é obrigatória');
        }
        
        promises.push(apiService.createRevenue(otherAppsRevenue));
      }

      // Criar despesa de combustível
      if (formData.fuelExpense.value && parseFloat(formData.fuelExpense.value) > 0) {
        const fuelExpense: any = {
          value: parseFloat(formData.fuelExpense.value),
          date: selectedDateISO,
          description: 'Combustível',
          category: 'Combustível',
        };
        
        // Validar campos obrigatórios
        if (!fuelExpense.value || fuelExpense.value <= 0) {
          throw new Error('Valor da despesa de combustível deve ser maior que 0');
        }
        if (!fuelExpense.date) {
          throw new Error('Data é obrigatória');
        }
        if (!fuelExpense.description || fuelExpense.description.trim().length === 0) {
          throw new Error('Descrição é obrigatória');
        }
        if (!fuelExpense.category) {
          throw new Error('Categoria é obrigatória');
        }
        
        promises.push(apiService.createExpense(fuelExpense));
      }

      // Executar todas as criações
      if (promises.length > 0) {
        const results = await Promise.allSettled(promises);
        
        // Verificar se todas as operações foram bem-sucedidas
        const failed = results.filter(result => result.status === 'rejected');
        const successful = results.filter(result => result.status === 'fulfilled');
        
        if (failed.length === 0) {
          // Fechar modal imediatamente
          onClose();
          resetForm();
          onSuccess?.();
          
          // Mostrar mensagem de sucesso
          showSuccess('Lançamentos cadastrados com sucesso!');
        } else if (successful.length > 0) {
          // Fechar modal imediatamente
          onClose();
          resetForm();
          onSuccess?.();
          
          // Mostrar mensagem de sucesso parcial
          showError(
            `${successful.length} lançamento(s) cadastrado(s) com sucesso, mas ${failed.length} falharam.`,
            'Sucesso Parcial'
          );
        } else {
          throw new Error('Todos os lançamentos falharam');
        }
      } else {
        showConfirmDialog(
          'Nenhum lançamento foi preenchido. Deseja continuar mesmo assim?',
          () => {
            onClose();
            resetForm();
          },
          'Atenção',
          'Continuar',
          'Cancelar'
        );
      }
    } catch (error) {
      console.error('Erro ao cadastrar lançamentos:', error);
      
      let errorMessage = 'Não foi possível cadastrar os lançamentos. Tente novamente.';
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid input data')) {
          errorMessage = 'Os dados enviados não são válidos. Verifique se todos os campos estão preenchidos corretamente.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Sessão expirada. Faça login novamente.';
        } else if (error.message.includes('Network request failed')) {
          errorMessage = 'Erro de conexão. Verifique sua internet e se o servidor está rodando.';
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
      }
      
      showError(errorMessage, 'Erro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      selectedDate: new Date(),
      uberRevenue: { value: '', rides: '' },
      ninetyNineRevenue: { value: '', rides: '' },
      otherAppsRevenue: { appName: '', value: '', rides: '' },
      mileage: { kilometers: '' },
      workHours: { hours: '' },
      fuelExpense: { value: '' },
    });
  };

  const currentStepData = steps[currentStep - 1];
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={[styles.container, { backgroundColor: themeState.colors.background }]}>
        <StatusBar 
          barStyle={themeState.isDark ? "light-content" : "dark-content"} 
          backgroundColor={themeState.colors.background} 
        />
        
        {/* Header */}
        <View style={[styles.header, { backgroundColor: themeState.colors.surface, borderBottomColor: themeState.colors.border }]}>
          <Text style={[styles.title, { color: themeState.colors.text }]}>Novo Lançamento</Text>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: themeState.colors.border }]} onPress={onClose}>
            <Text style={[styles.closeButtonText, { color: themeState.colors.textSecondary }]}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={[styles.progressContainer, { backgroundColor: themeState.colors.surface }]}>
          <Text style={[styles.progressText, { color: themeState.colors.textSecondary }]}>
            Etapa {currentStep} de {totalSteps}
          </Text>
          <View style={[styles.progressBar, { backgroundColor: themeState.colors.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%`, backgroundColor: themeState.colors.primary }
              ]} 
            />
          </View>
          <Text style={[styles.progressPercentage, { color: themeState.colors.textSecondary }]}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>

        {/* Step Circles */}
        <View style={[styles.stepCircles, { backgroundColor: themeState.colors.surface, borderBottomColor: themeState.colors.border }]}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepCircleContainer}>
              <View 
                style={[
                  styles.stepCircle,
                  { 
                    backgroundColor: index + 1 <= currentStep ? themeState.colors.primary : themeState.colors.border,
                  }
                ]}
              >
                <Text 
                  style={[
                    styles.stepCircleText,
                    { 
                      color: index + 1 <= currentStep ? '#ffffff' : themeState.colors.textSecondary,
                    }
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              <Text style={[styles.stepLabel, { color: themeState.colors.textSecondary }]}>{step.title}</Text>
            </View>
          ))}
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.stepContent}>
            {/* Step Icon */}
            <View style={[styles.stepIconContainer, { backgroundColor: themeState.colors.border }]}>
              <Text style={styles.stepIcon}>{currentStepData.icon}</Text>
            </View>

            {/* Step Title */}
            <Text style={[styles.stepTitle, { color: themeState.colors.text }]}>{currentStepData.title}</Text>

            {/* Step Description */}
            <Text style={[styles.stepDescription, { color: themeState.colors.textSecondary }]}>{currentStepData.description}</Text>

            {/* Form Fields */}
            <View style={styles.fieldsContainer}>
              {/* Date Picker for Step 1 */}
              {currentStep === 1 && (
                <View style={styles.fieldContainer}>
                  <Text style={[styles.fieldLabel, { color: themeState.colors.text }]}>Data dos Lançamentos</Text>
                  <WebCompatibleDateTimePicker
                    value={formData.selectedDate}
                    mode="date"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setFormData({ ...formData, selectedDate });
                      }
                    }}
                    style={[styles.datePicker, { 
                      backgroundColor: themeState.colors.surface,
                      borderColor: themeState.colors.border
                    }]}
                  />
                </View>
              )}
              
              {/* Regular Fields */}
              {currentStepData.fields.map((field, index) => (
                <View key={index} style={styles.fieldContainer}>
                  <Text style={[styles.fieldLabel, { color: themeState.colors.text }]}>{field.label}</Text>
                  <TextInput
                    style={[styles.fieldInput, { 
                      backgroundColor: themeState.colors.surface,
                      borderColor: themeState.colors.border,
                      color: themeState.colors.text
                    }]}
                    value={getFieldValue(field.key)}
                    onChangeText={(value) => updateFormData(field.key, value)}
                    placeholder={field.placeholder}
                    keyboardType={field.key.includes('value') ? 'numeric' : 'default'}
                    placeholderTextColor={themeState.colors.textSecondary}
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={[styles.navigationContainer, { 
          backgroundColor: themeState.colors.surface,
          borderTopColor: themeState.colors.border
        }]}>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.backButton,
              { backgroundColor: themeState.colors.textSecondary },
              currentStep === 1 && styles.disabledButton
            ]}
            onPress={handlePrevious}
            disabled={currentStep === 1}
          >
            <Text style={styles.backButtonIcon}>←</Text>
            <Text style={[
              styles.navButtonText,
              currentStep === 1 && styles.disabledButtonText
            ]}>
              Voltar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.skipButton, { backgroundColor: themeState.colors.border }]}
            onPress={handleSkip}
          >
            <Text style={[styles.skipButtonIcon, { color: themeState.colors.textSecondary }]}>⏭</Text>
            <Text style={[styles.navButtonText, { color: themeState.colors.textSecondary }]}>Pular</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton, 
              styles.nextButton,
              { backgroundColor: themeState.colors.primary },
              isSubmitting && styles.disabledButton
            ]}
            onPress={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Text style={styles.navButtonText}>
                  {currentStep === totalSteps ? 'Finalizar' : 'Avançar'}
                </Text>
                <Text style={styles.nextButtonIcon}>→</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      {/* Custom Alert */}
      <CustomAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        buttons={alertState.buttons}
        onClose={hideAlert}
      />
      
      {/* Custom Confirm */}
      <CustomConfirm
        visible={confirmState.visible}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        buttons={confirmState.buttons}
        onClose={hideConfirm}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    textAlign: 'right',
  },
  stepCircles: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  stepCircleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  stepIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepIcon: {
    fontSize: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  fieldsContainer: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  fieldInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  datePicker: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  backButton: {
    // backgroundColor will be set dynamically
  },
  skipButton: {
    // backgroundColor will be set dynamically
  },
  nextButton: {
    // backgroundColor will be set dynamically
  },
  disabledButton: {
    backgroundColor: '#f9fafb',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#9ca3af',
  },
  backButtonIcon: {
    fontSize: 16,
    color: '#ffffff',
    marginRight: 4,
  },
  skipButtonIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  nextButtonIcon: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 4,
  },
});

export default NewEntryModal;
