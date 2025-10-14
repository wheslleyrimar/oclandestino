import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import NewEntryModal from './NewEntryModal';

interface FloatingActionButtonProps {
  style?: any;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  style,
}) => {
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const { state: themeState } = useTheme();
  const { loadData } = useFinance();
  
  // Animações
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Verificação de segurança
  if (!themeState || !themeState.colors) {
    return null;
  }

  const styles = createStyles(themeState.colors);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    setShowNewEntryModal(true);
  };

  return (
    <>
      <Animated.View
        style={[
          styles.floatingButtonContainer,
          {
            transform: [
              { scale: scaleAnim },
            ],
          },
          style,
        ]}
      >
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [
                { scale: pulseAnim },
              ],
            },
          ]}
        />
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <LinearGradient
            colors={[themeState.colors.primary, '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.floatingButtonIcon}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Modal */}
      <NewEntryModal
        isVisible={showNewEntryModal}
        onClose={() => setShowNewEntryModal(false)}
        onSuccess={() => {
          loadData(); // Recarregar dados após sucesso
        }}
      />
    </>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  floatingButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    opacity: 0.2,
  },
  floatingButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  gradientButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonIcon: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
