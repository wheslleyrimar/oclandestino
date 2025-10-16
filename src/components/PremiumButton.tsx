import React, { useState } from 'react';
import { TouchableOpacity, Text, View, Platform, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const [scaleValue] = useState(new Animated.Value(1));

  // Se não for iOS, não mostrar o botão
  if (Platform.OS !== 'ios') {
    return null;
  }

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.textSmall;
      case 'medium':
        return styles.textMedium;
      case 'large':
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };

  if (isPremium) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <LinearGradient
          colors={['#10b981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, getTextSizeStyle(), styles.premiumActive]}
        >
          <TouchableOpacity 
            style={styles.buttonContent}
            disabled
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            {showIcon && (
              <Text style={styles.icon}>✓</Text>
            )}
            <Text style={[styles.text, styles.textWhite, getTextSizeStyle()]}>
              Premium Ativo
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  }

  const getButtonContent = () => {
    const buttonStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        return (
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={buttonStyle}
          >
            <TouchableOpacity
              style={styles.buttonContent}
              onPress={() => setModalVisible(true)}
              disabled={isLoading}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.8}
            >
              {showIcon && (
                <Text style={styles.icon}>👑</Text>
              )}
              <Text style={[styles.text, styles.textWhite, getTextSizeStyle()]}>
                {isLoading ? 'Carregando...' : 'Upgrade Premium'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        );
      case 'secondary':
        return (
          <TouchableOpacity
            style={[buttonStyle, styles.secondaryButton]}
            onPress={() => setModalVisible(true)}
            disabled={isLoading}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            {showIcon && (
              <Text style={[styles.icon, styles.iconSecondary]}>⭐</Text>
            )}
            <Text style={[styles.text, styles.textSecondary, getTextSizeStyle()]}>
              {isLoading ? 'Carregando...' : 'Upgrade Premium'}
            </Text>
          </TouchableOpacity>
        );
      case 'minimal':
        return (
          <TouchableOpacity
            style={[buttonStyle, styles.minimalButton]}
            onPress={() => setModalVisible(true)}
            disabled={isLoading}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            {showIcon && (
              <Text style={[styles.icon, styles.iconMinimal]}>👑</Text>
            )}
            <Text style={[styles.text, styles.textMinimal, getTextSizeStyle()]}>
              {isLoading ? 'Carregando...' : 'Upgrade Premium'}
            </Text>
          </TouchableOpacity>
        );
      default:
        return (
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={buttonStyle}
          >
            <TouchableOpacity
              style={styles.buttonContent}
              onPress={() => setModalVisible(true)}
              disabled={isLoading}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.8}
            >
              {showIcon && (
                <Text style={styles.icon}>👑</Text>
              )}
              <Text style={[styles.text, styles.textWhite, getTextSizeStyle()]}>
                {isLoading ? 'Carregando...' : 'Upgrade Premium'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        );
    }
  };

  return (
    <>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        {getButtonContent()}
      </Animated.View>
      
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
    <LinearGradient
      colors={['#10b981', '#059669']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statusBadge}
    >
      <Text style={styles.statusIcon}>✓</Text>
      <Text style={styles.statusText}>Premium</Text>
    </LinearGradient>
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
    <View style={styles.badgeContainer}>
      {children}
      {!isPremium && (
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badge}
        >
          <Text style={styles.badgeIcon}>👑</Text>
        </LinearGradient>
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

// Estilos usando StyleSheet para melhor performance e compatibilidade
const styles = StyleSheet.create({
  // Estilos base do botão
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Conteúdo do botão
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  
  // Tamanhos do botão
  small: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  
  // Variantes do botão
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  minimalButton: {
    backgroundColor: 'transparent',
  },
  premiumActive: {
    // Estilo específico para quando premium está ativo
  },
  
  // Estilos de texto
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  textSmall: {
    fontSize: 12,
  },
  textMedium: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 16,
  },
  textWhite: {
    color: '#ffffff',
  },
  textSecondary: {
    color: '#374151',
  },
  textMinimal: {
    color: '#3b82f6',
  },
  
  // Estilos de ícone
  icon: {
    marginRight: 8,
    fontSize: 18,
    color: '#ffffff',
  },
  iconSecondary: {
    color: '#6b7280',
  },
  iconMinimal: {
    color: '#3b82f6',
  },
  
  // Estilos do status badge
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statusIcon: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  
  // Estilos do badge
  badgeContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  badgeIcon: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
});
