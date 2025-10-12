import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';

interface FormData {
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
}

const NewEntryModal: React.FC<NewEntryModalProps> = ({ isVisible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    uberRevenue: { value: '', rides: '' },
    ninetyNineRevenue: { value: '', rides: '' },
    otherAppsRevenue: { appName: '', value: '', rides: '' },
    mileage: { kilometers: '' },
    workHours: { hours: '' },
    fuelExpense: { value: '' },
  });

  const totalSteps = 6;

  const steps = [
    {
      title: 'Receita da Uber',
      icon: '🚗',
      description: 'Informe os valores recebidos e número de corridas realizadas na Uber hoje',
      fields: [
        { key: 'uberRevenue.value', label: 'Valor Recebido (opcional)', placeholder: 'R$ 0,00' },
        { key: 'uberRevenue.rides', label: 'Número de Corridas (opcional)', placeholder: '0' },
      ],
      summary: {
        title: 'Valores Comuns Uber',
        items: [
          { label: 'Corrida curta', value: 'R$ 8-15' },
          { label: 'Corrida média', value: 'R$ 15-25' },
          { label: 'Corrida longa', value: 'R$ 25-40' },
          { label: 'Média por corrida', value: 'R$ 18' },
        ]
      }
    },
    {
      title: 'Receita da 99',
      icon: '🚕',
      description: 'Informe os valores recebidos e número de corridas realizadas na 99 hoje',
      fields: [
        { key: 'ninetyNineRevenue.value', label: 'Valor Recebido (opcional)', placeholder: 'R$ 0,00' },
        { key: 'ninetyNineRevenue.rides', label: 'Número de Corridas (opcional)', placeholder: '0' },
      ],
      summary: {
        title: 'Valores Comuns 99',
        items: [
          { label: 'Corrida curta', value: 'R$ 7-12' },
          { label: 'Corrida média', value: 'R$ 12-22' },
          { label: 'Corrida longa', value: 'R$ 22-35' },
          { label: 'Média por corrida', value: 'R$ 16' },
        ]
      }
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
      summary: {
        title: 'Apps Populares',
        items: [
          { label: 'inDrive', value: 'Preço negociável' },
          { label: 'Cabify', value: 'R$ 10-30' },
          { label: 'Maxi Taxi', value: 'R$ 8-20' },
          { label: 'Indrive', value: 'R$ 6-25' },
        ]
      }
    },
    {
      title: 'Quilometragem',
      icon: '🛣️',
      description: 'Informe a quilometragem total rodada no dia',
      fields: [
        { key: 'mileage.kilometers', label: 'Total de KMs rodados', placeholder: '0' },
      ],
      summary: {
        title: 'Distâncias Comuns',
        items: [
          { label: 'Jornada leve', value: '50-80 km' },
          { label: 'Jornada média', value: '80-120 km' },
          { label: 'Jornada pesada', value: '120-200 km' },
          { label: 'Jornada intensa', value: '200+ km' },
        ]
      }
    },
    {
      title: 'Horas Trabalhadas',
      icon: '⏰',
      description: 'Informe o total de horas trabalhadas no dia',
      fields: [
        { key: 'workHours.hours', label: 'Total de horas', placeholder: '0' },
      ],
      summary: {
        title: 'Jornadas Comuns',
        items: [
          { label: 'Meio período', value: '4-6 horas' },
          { label: 'Jornada padrão', value: '8 horas' },
          { label: 'Jornada estendida', value: '10-12 horas' },
          { label: 'Jornada intensa', value: '12+ horas' },
        ]
      }
    },
    {
      title: 'Combustível',
      icon: '⛽',
      description: 'Informe o valor gasto em combustível no dia',
      fields: [
        { key: 'fuelExpense.value', label: 'Valor gasto em combustível', placeholder: 'R$ 0,00' },
      ],
      summary: {
        title: 'Estimativas de Consumo',
        items: [
          { label: 'Consumo médio', value: '10-12 km/L' },
          { label: '50 km', value: 'R$ 15-20' },
          { label: '100 km', value: 'R$ 30-40' },
          { label: '200 km', value: 'R$ 60-80' },
        ]
      }
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

  const handleSuggestionClick = (item: any, step: number) => {
    switch (step) {
      case 1: // Uber
        if (item.label.includes('curta')) {
          updateFormData('uberRevenue.value', '12');
          updateFormData('uberRevenue.rides', '1');
        } else if (item.label.includes('média')) {
          updateFormData('uberRevenue.value', '20');
          updateFormData('uberRevenue.rides', '1');
        } else if (item.label.includes('longa')) {
          updateFormData('uberRevenue.value', '32');
          updateFormData('uberRevenue.rides', '1');
        } else if (item.label.includes('Média')) {
          updateFormData('uberRevenue.value', '18');
          updateFormData('uberRevenue.rides', '1');
        }
        break;
      case 2: // 99
        if (item.label.includes('curta')) {
          updateFormData('ninetyNineRevenue.value', '10');
          updateFormData('ninetyNineRevenue.rides', '1');
        } else if (item.label.includes('média')) {
          updateFormData('ninetyNineRevenue.value', '17');
          updateFormData('ninetyNineRevenue.rides', '1');
        } else if (item.label.includes('longa')) {
          updateFormData('ninetyNineRevenue.value', '28');
          updateFormData('ninetyNineRevenue.rides', '1');
        } else if (item.label.includes('Média')) {
          updateFormData('ninetyNineRevenue.value', '16');
          updateFormData('ninetyNineRevenue.rides', '1');
        }
        break;
      case 3: // Outros Apps
        if (item.label === 'inDrive') {
          updateFormData('otherAppsRevenue.appName', 'inDrive');
          updateFormData('otherAppsRevenue.value', '15');
          updateFormData('otherAppsRevenue.rides', '1');
        } else if (item.label === 'Cabify') {
          updateFormData('otherAppsRevenue.appName', 'Cabify');
          updateFormData('otherAppsRevenue.value', '20');
          updateFormData('otherAppsRevenue.rides', '1');
        } else if (item.label === 'Maxi Taxi') {
          updateFormData('otherAppsRevenue.appName', 'Maxi Taxi');
          updateFormData('otherAppsRevenue.value', '14');
          updateFormData('otherAppsRevenue.rides', '1');
        } else if (item.label === 'Indrive') {
          updateFormData('otherAppsRevenue.appName', 'Indrive');
          updateFormData('otherAppsRevenue.value', '15');
          updateFormData('otherAppsRevenue.rides', '1');
        }
        break;
      case 4: // Quilometragem
        if (item.label.includes('leve')) {
          updateFormData('mileage.kilometers', '65');
        } else if (item.label.includes('média')) {
          updateFormData('mileage.kilometers', '100');
        } else if (item.label.includes('pesada')) {
          updateFormData('mileage.kilometers', '160');
        } else if (item.label.includes('intensa')) {
          updateFormData('mileage.kilometers', '250');
        }
        break;
      case 5: // Horas Trabalhadas
        if (item.label.includes('Meio período')) {
          updateFormData('workHours.hours', '5');
        } else if (item.label.includes('padrão')) {
          updateFormData('workHours.hours', '8');
        } else if (item.label.includes('estendida')) {
          updateFormData('workHours.hours', '11');
        } else if (item.label.includes('intensa')) {
          updateFormData('workHours.hours', '14');
        }
        break;
      case 6: // Combustível
        if (item.label === '50 km') {
          updateFormData('fuelExpense.value', '17');
        } else if (item.label === '100 km') {
          updateFormData('fuelExpense.value', '35');
        } else if (item.label === '200 km') {
          updateFormData('fuelExpense.value', '70');
        } else if (item.label.includes('Consumo médio')) {
          updateFormData('fuelExpense.value', '25');
        }
        break;
    }
  };

  const handleSubmit = () => {
    // Aqui você pode processar os dados do formulário
    console.log('Form data:', formData);
    onClose();
    // Reset form
    setCurrentStep(1);
    setFormData({
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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Novo Lançamento</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Etapa {currentStep} de {totalSteps}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressPercentage}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>

        {/* Step Circles */}
        <View style={styles.stepCircles}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepCircleContainer}>
              <View 
                style={[
                  styles.stepCircle,
                  { 
                    backgroundColor: index + 1 <= currentStep ? '#3b82f6' : '#e5e7eb',
                  }
                ]}
              >
                <Text 
                  style={[
                    styles.stepCircleText,
                    { 
                      color: index + 1 <= currentStep ? '#ffffff' : '#6b7280',
                    }
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              <Text style={styles.stepLabel}>{step.title}</Text>
            </View>
          ))}
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.stepContent}>
            {/* Step Icon */}
            <View style={styles.stepIconContainer}>
              <Text style={styles.stepIcon}>{currentStepData.icon}</Text>
            </View>

            {/* Step Title */}
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>

            {/* Step Description */}
            <Text style={styles.stepDescription}>{currentStepData.description}</Text>

            {/* Form Fields */}
            <View style={styles.fieldsContainer}>
              {currentStepData.fields.map((field, index) => (
                <View key={index} style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={getFieldValue(field.key)}
                    onChangeText={(value) => updateFormData(field.key, value)}
                    placeholder={field.placeholder}
                    keyboardType={field.key.includes('value') ? 'numeric' : 'default'}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              ))}
            </View>

            {/* Summary Section */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>{currentStepData.summary.title}</Text>
              <View style={styles.summaryGrid}>
                {currentStepData.summary.items.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.summaryItem}
                    onPress={() => handleSuggestionClick(item, currentStep)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.summaryLabel}>{item.label}</Text>
                    <Text style={styles.summaryValue}>{item.value}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.backButton,
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
            style={[styles.navButton, styles.skipButton]}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonIcon}>⏭</Text>
            <Text style={styles.navButtonText}>Pular</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.navButtonText}>
              {currentStep === totalSteps ? 'Finalizar' : 'Avançar'}
            </Text>
            <Text style={styles.nextButtonIcon}>→</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  stepCircles: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    color: '#6b7280',
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
    backgroundColor: '#f3f4f6',
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
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#6b7280',
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
    color: '#111827',
    marginBottom: 8,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  summaryContainer: {
    width: '100%',
    marginTop: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
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
    backgroundColor: '#6b7280',
  },
  skipButton: {
    backgroundColor: '#9ca3af',
  },
  nextButton: {
    backgroundColor: '#3b82f6',
  },
  disabledButton: {
    backgroundColor: '#f9fafb',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
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
    color: '#6b7280',
    marginRight: 4,
  },
  nextButtonIcon: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 4,
  },
});

export default NewEntryModal;
