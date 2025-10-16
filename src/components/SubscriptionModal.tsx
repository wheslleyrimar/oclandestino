import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform
} from 'react-native';
import { useSubscription } from '../context/SubscriptionContext';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ visible, onClose }) => {
  const { products, purchaseSubscription, restorePurchases, isLoading, error } = useSubscription();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handlePurchase = async (productId: string) => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Aviso', 'Assinaturas disponíveis apenas no iOS');
      return;
    }

    setSelectedProduct(productId);
    try {
      const success = await purchaseSubscription(productId);
      if (success) {
        Alert.alert(
          'Sucesso!',
          'Sua assinatura premium foi ativada com sucesso! Agora você tem acesso a todas as funcionalidades exclusivas.',
          [{ text: 'OK', onPress: onClose }]
        );
      } else {
        Alert.alert('Erro', 'Falha ao processar a compra. Tente novamente.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro durante a compra. Verifique sua conexão e tente novamente.');
    } finally {
      setSelectedProduct(null);
    }
  };

  const handleRestore = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Aviso', 'Restauração de compras disponível apenas no iOS');
      return;
    }

    try {
      await restorePurchases();
      Alert.alert('Sucesso', 'Compras restauradas com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao restaurar compras.');
    }
  };

  const getProductDisplayName = (productId: string) => {
    switch (productId) {
      case 'com.clans.finance.premium.monthly':
        return 'Premium Mensal';
      case 'com.clans.finance.premium.yearly':
        return 'Premium Anual';
      case 'com.clans.finance.premium.quarterly':
        return 'Premium Trimestral';
      default:
        return 'Premium';
    }
  };

  const getProductDescription = (productId: string) => {
    switch (productId) {
      case 'com.clans.finance.premium.monthly':
        return 'Acesso completo por 1 mês';
      case 'com.clans.finance.premium.yearly':
        return 'Acesso completo por 1 ano (Economize 20%)';
      case 'com.clans.finance.premium.quarterly':
        return 'Acesso completo por 3 meses';
      default:
        return 'Acesso premium completo';
    }
  };

  const getSavingsText = (productId: string) => {
    switch (productId) {
      case 'com.clans.finance.premium.yearly':
        return 'Economize 20%';
      case 'com.clans.finance.premium.quarterly':
        return 'Economize 10%';
      default:
        return null;
    }
  };

  if (Platform.OS !== 'ios') {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-white">
          <View className="p-6 pt-12">
            <Text className="text-2xl font-bold text-center mb-2">
              Assinatura Premium
            </Text>
            <Text className="text-gray-600 text-center mb-8">
              Assinaturas disponíveis apenas no iOS
            </Text>
            
            <TouchableOpacity
              className="bg-gray-200 py-3 rounded-lg"
              onPress={onClose}
            >
              <Text className="text-center font-semibold">
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white">
        <View className="p-6 pt-12">
          <Text className="text-2xl font-bold text-center mb-2">
            Upgrade para Premium
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            Desbloqueie todas as funcionalidades do CLANS
          </Text>

          {error && (
            <View className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <Text className="text-red-700">{error}</Text>
            </View>
          )}

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Benefícios Premium */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3">Benefícios Premium:</Text>
              <View className="space-y-2">
                <Text className="text-gray-700">✓ Relatórios detalhados em PDF</Text>
                <Text className="text-gray-700">✓ Backup automático na nuvem</Text>
                <Text className="text-gray-700">✓ Métricas avançadas de performance</Text>
                <Text className="text-gray-700">✓ Múltiplas metas personalizadas</Text>
                <Text className="text-gray-700">✓ Sincronização entre dispositivos</Text>
                <Text className="text-gray-700">✓ Suporte prioritário</Text>
              </View>
            </View>

            {/* Produtos de Assinatura */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3">Escolha seu plano:</Text>
              {products.map((product) => {
                const savingsText = getSavingsText(product.productId);
                return (
                  <TouchableOpacity
                    key={product.productId}
                    className={`border-2 rounded-lg p-4 mb-4 ${
                      product.productId === 'com.clans.finance.premium.yearly'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                    onPress={() => handlePurchase(product.productId)}
                    disabled={isLoading}
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1">
                        <View className="flex-row items-center">
                          <Text className="text-lg font-semibold">
                            {getProductDisplayName(product.productId)}
                          </Text>
                          {savingsText && (
                            <View className="bg-green-100 px-2 py-1 rounded ml-2">
                              <Text className="text-green-700 text-xs font-semibold">
                                {savingsText}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-gray-600 text-sm">
                          {getProductDescription(product.productId)}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-xl font-bold text-blue-600">
                          {product.localizedPrice}
                        </Text>
                        {selectedProduct === product.productId && (
                          <ActivityIndicator size="small" color="#0ea5e9" />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Informações Adicionais */}
            <View className="bg-gray-50 p-4 rounded-lg mb-6">
              <Text className="text-sm text-gray-600 text-center">
                • Assinatura renovada automaticamente{'\n'}
                • Cancele a qualquer momento nas configurações{'\n'}
                • Pagamento cobrado na conta da Apple{'\n'}
                • Acesso imediato após confirmação
              </Text>
            </View>
          </ScrollView>

          <View className="mt-6">
            <TouchableOpacity
              className="bg-gray-100 py-3 rounded-lg mb-4"
              onPress={handleRestore}
              disabled={isLoading}
            >
              <Text className="text-center font-semibold">
                Restaurar Compras
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-200 py-3 rounded-lg"
              onPress={onClose}
            >
              <Text className="text-center font-semibold">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
