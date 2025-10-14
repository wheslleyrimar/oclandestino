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

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message: string;
  buttons?: AlertButton[];
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK' }],
  type = 'info',
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
          backgroundColor: `${themeState.colors.success}15`,
        };
      case 'error':
        return {
          icon: '❌',
          color: themeState.colors.error,
          backgroundColor: `${themeState.colors.error}15`,
        };
      case 'warning':
        return {
          icon: '⚠️',
          color: themeState.colors.warning,
          backgroundColor: `${themeState.colors.warning}15`,
        };
      case 'info':
      default:
        return {
          icon: 'ℹ️',
          color: themeState.colors.info,
          backgroundColor: `${themeState.colors.info}15`,
        };
    }
  };

  const typeConfig = getTypeConfig();

  const handleButtonPress = (button: AlertButton) => {
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
            styles.alertContainer,
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
                  buttons.length === 1 && styles.singleButton,
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
  alertContainer: {
    width: '100%',
    maxWidth: 340,
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
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  messageContainer: {
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleButton: {
    flex: 0,
    minWidth: 120,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default CustomAlert;
