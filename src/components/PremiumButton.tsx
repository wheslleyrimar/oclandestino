import React, { useState } from 'react';
import { TouchableOpacity, Text, View, Platform } from 'react-native';
import { useSubscription } from '../context/SubscriptionContext';
import { SubscriptionModal } from './SubscriptionModal';

interface PremiumButtonProps {
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  className?: string;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium',
  showIcon = true,
  className = ''
}) => {
  const { isPremium, isLoading } = useSubscription();
  const [modalVisible, setModalVisible] = useState(false);

  // Se não for iOS, não mostrar o botão
  if (Platform.OS !== 'ios') {
    return null;
  }

  if (isPremium) {
    return (
      <TouchableOpacity 
        className={`bg-green-500 px-4 py-2 rounded-lg flex-row items-center ${className}`}
        disabled
      >
        {showIcon && (
          <Text className="text-white mr-2">✓</Text>
        )}
        <Text className="text-white font-semibold">
          Premium Ativo
        </Text>
      </TouchableOpacity>
    );
  }

  const getButtonStyles = () => {
    const baseStyles = 'rounded-lg flex-row items-center justify-center';
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-blue-500`;
      case 'secondary':
        return `${baseStyles} bg-gray-100 border border-gray-300`;
      case 'minimal':
        return `${baseStyles} bg-transparent`;
      default:
        return `${baseStyles} bg-blue-500`;
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-white font-semibold';
      case 'secondary':
        return 'text-gray-700 font-semibold';
      case 'minimal':
        return 'text-blue-500 font-semibold';
      default:
        return 'text-white font-semibold';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5';
      case 'medium':
        return 'px-4 py-2';
      case 'large':
        return 'px-6 py-3';
      default:
        return 'px-4 py-2';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <>
      <TouchableOpacity
        className={`${getButtonStyles()} ${getSizeStyles()} ${className}`}
        onPress={() => setModalVisible(true)}
        disabled={isLoading}
      >
        {showIcon && (
          <Text className={`${getTextStyles()} mr-2`}>
            {variant === 'primary' ? '👑' : '⭐'}
          </Text>
        )}
        <Text className={`${getTextStyles()} ${getTextSize()}`}>
          {isLoading ? 'Carregando...' : 'Upgrade Premium'}
        </Text>
      </TouchableOpacity>
      
      <SubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

// Componente para mostrar status premium em headers/barras
export const PremiumStatus: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isPremium } = useSubscription();

  if (Platform.OS !== 'ios') {
    return null;
  }

  if (!isPremium) {
    return null;
  }

  return (
    <View className={`bg-green-100 px-2 py-1 rounded-full flex-row items-center ${className}`}>
      <Text className="text-green-700 text-xs font-semibold mr-1">✓</Text>
      <Text className="text-green-700 text-xs font-semibold">Premium</Text>
    </View>
  );
};

// Componente para mostrar badge premium em funcionalidades
export const PremiumBadge: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const { isPremium } = useSubscription();

  if (Platform.OS !== 'ios') {
    return <>{children}</>;
  }

  return (
    <View className={`relative ${className}`}>
      {children}
      {!isPremium && (
        <View className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center">
          <Text className="text-white text-xs font-bold">👑</Text>
        </View>
      )}
    </View>
  );
};

// Hook para verificar se uma funcionalidade está disponível
export const usePremiumFeatures = () => {
  const { isPremium } = useSubscription();

  const canExportData = () => Platform.OS === 'ios' && isPremium;
  const canViewAdvancedMetrics = () => Platform.OS === 'ios' && isPremium;
  const canSetMultipleGoals = () => Platform.OS === 'ios' && isPremium;
  const canSyncToCloud = () => Platform.OS === 'ios' && isPremium;
  const canAccessReports = () => Platform.OS === 'ios' && isPremium;
  const canUsePrioritySupport = () => Platform.OS === 'ios' && isPremium;

  return {
    canExportData,
    canViewAdvancedMetrics,
    canSetMultipleGoals,
    canSyncToCloud,
    canAccessReports,
    canUsePrioritySupport,
    isPremium: Platform.OS === 'ios' && isPremium
  };
};
