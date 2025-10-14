import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ConfirmButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomConfirmProps {
  visible: boolean;
  title?: string;
  message: string;
  buttons?: ConfirmButton[];
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const CustomConfirm: React.FC<CustomConfirmProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK' }],
  type = 'warning',
  onClose,
}) => {
  const { state: themeState } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          color: themeState.colors.success,
          backgroundColor: `${themeState.colors.success}20`,
        };
      case 'error':
        return {
          icon: '❌',
          color: themeState.colors.error,
          backgroundColor: `${themeState.colors.error}20`,
        };
      case 'warning':
        return {
          icon: '⚠️',
          color: themeState.colors.warning,
          backgroundColor: `${themeState.colors.warning}20`,
        };
      case 'info':
      default:
        return {
          icon: 'ℹ️',
          color: themeState.colors.info,
          backgroundColor: `${themeState.colors.info}20`,
        };
    }
  };

  const typeConfig = getTypeConfig();

  const handleButtonPress = (button: ConfirmButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onClose) {
      onClose();
    }
  };

  const getButtonStyle = (buttonStyle?: string) => {
    switch (buttonStyle) {
      case 'cancel':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: themeState.colors.border,
        };
      case 'destructive':
        return {
          backgroundColor: themeState.colors.error,
        };
      default:
        return {
          backgroundColor: themeState.colors.primary,
        };
    }
  };

  const getButtonTextStyle = (buttonStyle?: string) => {
    switch (buttonStyle) {
      case 'cancel':
        return {
          color: themeState.colors.textSecondary,
        };
      case 'destructive':
        return {
          color: '#ffffff',
        };
      default:
        return {
          color: '#ffffff',
        };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <StatusBar
        backgroundColor="rgba(0,0,0,0.5)"
        barStyle={themeState.isDark ? "light-content" : "dark-content"}
      />
      
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: 'rgba(0,0,0,0.5)',
            opacity: opacityAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.confirmContainer,
            {
              backgroundColor: themeState.colors.surface,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header with Icon */}
          <View style={styles.header}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: typeConfig.backgroundColor,
                },
              ]}
            >
              <Text style={styles.icon}>{typeConfig.icon}</Text>
            </View>
            
            {title && (
              <Text style={[styles.title, { color: themeState.colors.text }]}>
                {title}
              </Text>
            )}
          </View>

          {/* Message */}
          <View style={styles.messageContainer}>
            <Text style={[styles.message, { color: themeState.colors.textSecondary }]}>
              {message}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  getButtonStyle(button.style),
                ]}
                onPress={() => handleButtonPress(button)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.buttonText,
                    getButtonTextStyle(button.style),
                  ]}
                >
                  {button.text.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  confirmContainer: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 22,
  },
  messageContainer: {
    marginBottom: 24,
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default CustomConfirm;
