import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { usePremiumFeatures } from './PremiumButton';
import { SubscriptionModal } from './SubscriptionModal';

interface PremiumFeatureProps {
  children: React.ReactNode;
  featureName: string;
  description?: string;
  className?: string;
}

export const PremiumFeature: React.FC<PremiumFeatureProps> = ({ 
  children, 
  featureName, 
  description,
  className = ''
}) => {
  const { isPremium } = usePremiumFeatures();
  const [modalVisible, setModalVisible] = useState(false);

  // Se não for iOS, sempre mostrar o conteúdo
  if (Platform.OS !== 'ios') {
    return <>{children}</>;
  }

  // Se for premium, mostrar o conteúdo normalmente
  if (isPremium) {
    return <>{children}</>;
  }

  // Se não for premium, mostrar overlay com opção de upgrade
  return (
    <>
      <View className={`relative ${className}`}>
        {children}
        
        {/* Overlay para funcionalidade bloqueada */}
        <View className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
          <View className="bg-white p-4 rounded-lg mx-4 max-w-sm">
            <Text className="text-lg font-semibold text-center mb-2">
              🔒 Funcionalidade Premium
            </Text>
            <Text className="text-gray-600 text-center mb-4">
              {description || `${featureName} está disponível apenas para usuários Premium.`}
            </Text>
            
            <TouchableOpacity
              className="bg-blue-500 py-2 px-4 rounded-lg mb-2"
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-white font-semibold text-center">
                Upgrade Premium
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-gray-200 py-2 px-4 rounded-lg"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-gray-700 font-semibold text-center">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <SubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

// Componente para mostrar lista de funcionalidades premium
export const PremiumFeaturesList: React.FC<{ className?: string }> = ({ className = '' }) => {
  const features = [
    {
      icon: '📊',
      title: 'Relatórios Detalhados',
      description: 'Exporte seus dados em PDF com análises avançadas'
    },
    {
      icon: '☁️',
      title: 'Backup na Nuvem',
      description: 'Seus dados sincronizados automaticamente'
    },
    {
      icon: '📈',
      title: 'Métricas Avançadas',
      description: 'Análises de performance e tendências'
    },
    {
      icon: '🎯',
      title: 'Múltiplas Metas',
      description: 'Configure várias metas personalizadas'
    },
    {
      icon: '🔄',
      title: 'Sincronização',
      description: 'Acesse seus dados em qualquer dispositivo'
    },
    {
      icon: '🎧',
      title: 'Suporte Prioritário',
      description: 'Atendimento exclusivo e personalizado'
    }
  ];

  return (
    <View className={`${className}`}>
      <Text className="text-xl font-bold mb-4">Funcionalidades Premium</Text>
      <View className="space-y-3">
        {features.map((feature, index) => (
          <View key={index} className="flex-row items-center p-3 bg-gray-50 rounded-lg">
            <Text className="text-2xl mr-3">{feature.icon}</Text>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">{feature.title}</Text>
              <Text className="text-sm text-gray-600">{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Hook para funcionalidades específicas
export const usePremiumFeature = (featureName: string) => {
  const { isPremium } = usePremiumFeatures();
  
  return {
    isAvailable: Platform.OS === 'ios' ? isPremium : true,
    showUpgradePrompt: Platform.OS === 'ios' && !isPremium,
    featureName
  };
};
