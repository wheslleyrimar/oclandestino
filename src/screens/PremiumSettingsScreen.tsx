import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscription } from '../context/SubscriptionContext';
import { PremiumButton, PremiumStatus, usePremiumFeatures } from '../components/PremiumButton';
import { SubscriptionModal } from '../components/SubscriptionModal';
import { PremiumFeaturesList } from '../components/PremiumFeature';

const PremiumSettingsScreen: React.FC = () => {
  const { isPremium, isLoading, restorePurchases, checkSubscriptionStatus } = useSubscription();
  const { canExportData, canViewAdvancedMetrics, canSetMultipleGoals, canSyncToCloud } = usePremiumFeatures();
  const [modalVisible, setModalVisible] = useState(false);

  const handleRestorePurchases = async () => {
    try {
      await restorePurchases();
      Alert.alert('Sucesso', 'Compras restauradas com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao restaurar compras.');
    }
  };

  const handleCheckStatus = async () => {
    try {
      await checkSubscriptionStatus();
      Alert.alert('Status Verificado', 'Status da assinatura atualizado.');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao verificar status da assinatura.');
    }
  };

  const openAppStoreSettings = () => {
    Alert.alert(
      'Gerenciar Assinatura',
      'Para gerenciar sua assinatura, vá em Configurações > Apple ID > Assinaturas no seu iPhone.',
      [{ text: 'OK' }]
    );
  };

  if (Platform.OS !== 'ios') {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        <View className="p-6">
          <Text className="text-xl font-bold text-center">
            Assinaturas Premium
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Disponível apenas no iOS
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white p-6 border-b border-gray-200">
          <Text className="text-2xl font-bold mb-2">Premium</Text>
          <Text className="text-gray-600 mb-4">
            Gerencie sua assinatura e funcionalidades premium
          </Text>
          
          <PremiumStatus className="self-start" />
        </View>

        {/* Status da Assinatura */}
        <View className="bg-white p-6 mt-4">
          <Text className="text-lg font-semibold mb-4">Status da Assinatura</Text>
          
          <View className="bg-gray-50 p-4 rounded-lg">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-semibold">Status Atual:</Text>
              <Text className={`font-semibold ${isPremium ? 'text-green-600' : 'text-gray-600'}`}>
                {isPremium ? '✓ Ativo' : '✗ Inativo'}
              </Text>
            </View>
            
            <Text className="text-sm text-gray-600 mb-4">
              {isPremium 
                ? 'Você tem acesso a todas as funcionalidades premium'
                : 'Upgrade para desbloquear funcionalidades exclusivas'
              }
            </Text>
            
            {!isPremium && (
              <PremiumButton 
                variant="primary" 
                size="large" 
                className="mb-4"
                onPress={() => setModalVisible(true)}
              />
            )}
          </View>
        </View>

        {/* Funcionalidades Premium */}
        <View className="bg-white p-6 mt-4">
          <Text className="text-lg font-semibold mb-4">Funcionalidades Premium</Text>
          
          <View className="space-y-3">
            <FeatureStatus 
              title="Exportar Relatórios PDF"
              isAvailable={canExportData()}
            />
            <FeatureStatus 
              title="Métricas Avançadas"
              isAvailable={canViewAdvancedMetrics()}
            />
            <FeatureStatus 
              title="Múltiplas Metas"
              isAvailable={canSetMultipleGoals()}
            />
            <FeatureStatus 
              title="Sincronização na Nuvem"
              isAvailable={canSyncToCloud()}
            />
          </View>
        </View>

        {/* Lista de Funcionalidades */}
        <View className="bg-white p-6 mt-4">
          <PremiumFeaturesList />
        </View>

        {/* Ações */}
        <View className="bg-white p-6 mt-4 mb-6">
          <Text className="text-lg font-semibold mb-4">Ações</Text>
          
          <TouchableOpacity
            className="bg-blue-100 py-3 px-4 rounded-lg mb-3"
            onPress={handleRestorePurchases}
            disabled={isLoading}
          >
            <Text className="text-blue-700 font-semibold text-center">
              Restaurar Compras
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-gray-100 py-3 px-4 rounded-lg mb-3"
            onPress={handleCheckStatus}
            disabled={isLoading}
          >
            <Text className="text-gray-700 font-semibold text-center">
              Verificar Status
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-gray-100 py-3 px-4 rounded-lg"
            onPress={openAppStoreSettings}
          >
            <Text className="text-gray-700 font-semibold text-center">
              Gerenciar na App Store
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

interface FeatureStatusProps {
  title: string;
  isAvailable: boolean;
}

const FeatureStatus: React.FC<FeatureStatusProps> = ({ title, isAvailable }) => (
  <View className="flex-row items-center justify-between py-2">
    <Text className="text-gray-700">{title}</Text>
    <Text className={`font-semibold ${isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
      {isAvailable ? '✓ Disponível' : '🔒 Premium'}
    </Text>
  </View>
);

export default PremiumSettingsScreen;
