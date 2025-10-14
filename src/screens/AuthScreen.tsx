import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Componente de gradiente condicional para web
const ConditionalGradient = ({ children, colors, style }: any) => {
  if (typeof window !== 'undefined') {
    // Para web, usar View simples
    return <View style={[{ backgroundColor: colors[0] }, style]}>{children}</View>;
  }
  return <LinearGradient colors={colors} style={style}>{children}</LinearGradient>;
};

const AuthScreen: React.FC = () => {
  const { login, register, state } = useAuth();
  const { state: themeState } = useTheme();
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    licenseNumber: '',
    vehicleModel: '',
    vehiclePlate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = t('auth.nameRequired');
      } else if (formData.name.trim().length < 2) {
        newErrors.name = t('auth.nameMinLength');
      }

      if (!formData.phone.trim()) {
        newErrors.phone = t('auth.phoneRequired');
      } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
        newErrors.phone = 'Formato: (11) 99999-9999';
      }

      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = t('auth.licenseRequired');
      } else if (formData.licenseNumber.trim().length < 11) {
        newErrors.licenseNumber = t('auth.licenseMinLength');
      }

      if (!formData.vehicleModel.trim()) {
        newErrors.vehicleModel = t('auth.vehicleModelRequired');
      }

      if (!formData.vehiclePlate.trim()) {
        newErrors.vehiclePlate = t('auth.vehiclePlateRequired');
      } else if (!/^[A-Z]{3}-\d{4}$/.test(formData.vehiclePlate)) {
        newErrors.vehiclePlate = 'Formato: ABC-1234';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordMinLength');
    }

    if (!isLogin) {
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.passwordsDoNotMatch');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (isLogin) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login({
        email: formData.email,
        password: formData.password,
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        licenseNumber: formData.licenseNumber,
        vehicleModel: formData.vehicleModel,
        vehiclePlate: formData.vehiclePlate,
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha no registro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      licenseNumber: '',
      vehicleModel: '',
      vehiclePlate: '',
    });
    setErrors({});
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (match) {
      const [, area, prefix, suffix] = match;
      if (suffix) {
        return `(${area}) ${prefix}-${suffix}`;
      } else if (prefix) {
        return `(${area}) ${prefix}`;
      } else if (area) {
        return `(${area}`;
      }
    }
    return text;
  };

  const formatPlate = (text: string) => {
    const cleaned = text.replace(/[^A-Z0-9]/g, '').toUpperCase();
    if (cleaned.length <= 3) {
      return cleaned;
    }
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeState.colors.background }]}>
      <StatusBar 
        barStyle={themeState.isDark ? "light-content" : "dark-content"} 
        backgroundColor="transparent" 
        translucent 
      />
      
      <ConditionalGradient
        colors={themeState.isDark ? ['#1e293b', '#0f172a'] : ['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            bounces={true}
            alwaysBounceVertical={false}
          >
            {/* Header Section */}
            <Animated.View 
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <Animated.View 
                style={[
                  styles.logoContainer,
                  { transform: [{ scale: logoScale }] }
                ]}
              >
                <View style={[styles.logo, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                  <Ionicons name="car-sport" size={40} color="#ffffff" />
                </View>
                <Text style={styles.appName}>KLANS</Text>
                <Text style={styles.appSubtitle}>
                  {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                </Text>
              </Animated.View>
            </Animated.View>

            {/* Form Container */}
            <Animated.View 
              style={[
                styles.formContainer,
                { 
                  backgroundColor: themeState.colors.surface,
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              {/* Mode Toggle */}
              <View style={styles.modeToggle}>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    isLogin && styles.modeButtonActive,
                    { backgroundColor: isLogin ? themeState.colors.primary : 'transparent' }
                  ]}
                  onPress={() => !isLogin && toggleMode()}
                >
                  <Text style={[
                    styles.modeButtonText,
                    { color: isLogin ? '#ffffff' : themeState.colors.textSecondary }
                  ]}>
                    Entrar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    !isLogin && styles.modeButtonActive,
                    { backgroundColor: !isLogin ? themeState.colors.primary : 'transparent' }
                  ]}
                  onPress={() => isLogin && toggleMode()}
                >
                  <Text style={[
                    styles.modeButtonText,
                    { color: !isLogin ? '#ffffff' : themeState.colors.textSecondary }
                  ]}>
                    Cadastrar
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                {!isLogin && (
                  <Animated.View style={{ opacity: fadeAnim }}>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.label, { color: themeState.colors.text }]}>{t('auth.fullName')}</Text>
                      <View style={[
                        styles.inputContainer,
                        { 
                          backgroundColor: themeState.colors.background,
                          borderColor: errors.name ? themeState.colors.error : themeState.colors.border
                        }
                      ]}>
                        <Ionicons name="person-outline" size={20} color={themeState.colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                          style={[styles.input, { color: themeState.colors.text }]}
                          value={formData.name}
                          onChangeText={(text) => {
                            setFormData({ ...formData, name: text });
                            if (errors.name) {
                              setErrors({ ...errors, name: '' });
                            }
                          }}
                          placeholder="Seu nome completo"
                          placeholderTextColor={themeState.colors.textSecondary}
                          autoCapitalize="words"
                        />
                      </View>
                      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>
                  </Animated.View>
                )}

                <Animated.View style={{ opacity: fadeAnim }}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: themeState.colors.text }]}>Email</Text>
                    <View style={[
                      styles.inputContainer,
                      { 
                        backgroundColor: themeState.colors.background,
                        borderColor: errors.email ? themeState.colors.error : themeState.colors.border
                      }
                    ]}>
                      <Ionicons name="mail-outline" size={20} color={themeState.colors.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, { color: themeState.colors.text }]}
                        value={formData.email}
                        onChangeText={(text) => {
                          setFormData({ ...formData, email: text });
                          if (errors.email) {
                            setErrors({ ...errors, email: '' });
                          }
                        }}
                        placeholder="seu@email.com"
                        placeholderTextColor={themeState.colors.textSecondary}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                  </View>
                </Animated.View>

                <Animated.View style={{ opacity: fadeAnim }}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: themeState.colors.text }]}>{t('auth.password')}</Text>
                    <View style={[
                      styles.inputContainer,
                      { 
                        backgroundColor: themeState.colors.background,
                        borderColor: errors.password ? themeState.colors.error : themeState.colors.border
                      }
                    ]}>
                      <Ionicons name="lock-closed-outline" size={20} color={themeState.colors.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, { color: themeState.colors.text }]}
                        value={formData.password}
                        onChangeText={(text) => {
                          setFormData({ ...formData, password: text });
                          if (errors.password) {
                            setErrors({ ...errors, password: '' });
                          }
                        }}
                        placeholder="Sua senha"
                        placeholderTextColor={themeState.colors.textSecondary}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeButton}
                      >
                        <Ionicons 
                          name={showPassword ? "eye-off-outline" : "eye-outline"} 
                          size={20} 
                          color={themeState.colors.textSecondary} 
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                  </View>
                </Animated.View>

                {!isLogin && (
                  <Animated.View style={{ opacity: fadeAnim }}>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.label, { color: themeState.colors.text }]}>{t('auth.confirmPassword')}</Text>
                      <View style={[
                        styles.inputContainer,
                        { 
                          backgroundColor: themeState.colors.background,
                          borderColor: errors.confirmPassword ? themeState.colors.error : themeState.colors.border
                        }
                      ]}>
                        <Ionicons name="lock-closed-outline" size={20} color={themeState.colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                          style={[styles.input, { color: themeState.colors.text }]}
                          value={formData.confirmPassword}
                          onChangeText={(text) => {
                            setFormData({ ...formData, confirmPassword: text });
                            if (errors.confirmPassword) {
                              setErrors({ ...errors, confirmPassword: '' });
                            }
                          }}
                          placeholder="Confirme sua senha"
                          placeholderTextColor={themeState.colors.textSecondary}
                          secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={styles.eyeButton}
                        >
                          <Ionicons 
                            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                            size={20} 
                            color={themeState.colors.textSecondary} 
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>
                  </Animated.View>
                )}

                {!isLogin && (
                  <>
                    <Animated.View style={{ opacity: fadeAnim }}>
                      <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: themeState.colors.text }]}>{t('auth.phone')}</Text>
                        <View style={[
                          styles.inputContainer,
                          { 
                            backgroundColor: themeState.colors.background,
                            borderColor: errors.phone ? themeState.colors.error : themeState.colors.border
                          }
                        ]}>
                          <Ionicons name="call-outline" size={20} color={themeState.colors.textSecondary} style={styles.inputIcon} />
                          <TextInput
                            style={[styles.input, { color: themeState.colors.text }]}
                            value={formData.phone}
                            onChangeText={(text) => {
                              const formatted = formatPhone(text);
                              setFormData({ ...formData, phone: formatted });
                              if (errors.phone) {
                                setErrors({ ...errors, phone: '' });
                              }
                            }}
                            placeholder="(11) 99999-9999"
                            placeholderTextColor={themeState.colors.textSecondary}
                            keyboardType="phone-pad"
                            maxLength={15}
                          />
                        </View>
                        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                      </View>
                    </Animated.View>

                    <Animated.View style={{ opacity: fadeAnim }}>
                      <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: themeState.colors.text }]}>{t('auth.license')}</Text>
                        <View style={[
                          styles.inputContainer,
                          { 
                            backgroundColor: themeState.colors.background,
                            borderColor: errors.licenseNumber ? themeState.colors.error : themeState.colors.border
                          }
                        ]}>
                          <Ionicons name="card-outline" size={20} color={themeState.colors.textSecondary} style={styles.inputIcon} />
                          <TextInput
                            style={[styles.input, { color: themeState.colors.text }]}
                            value={formData.licenseNumber}
                            onChangeText={(text) => {
                              const cleaned = text.replace(/\D/g, '');
                              setFormData({ ...formData, licenseNumber: cleaned });
                              if (errors.licenseNumber) {
                                setErrors({ ...errors, licenseNumber: '' });
                              }
                            }}
                            placeholder="12345678900"
                            placeholderTextColor={themeState.colors.textSecondary}
                            keyboardType="numeric"
                            maxLength={11}
                          />
                        </View>
                        {errors.licenseNumber && <Text style={styles.errorText}>{errors.licenseNumber}</Text>}
                      </View>
                    </Animated.View>

                    <Animated.View style={{ opacity: fadeAnim }}>
                      <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: themeState.colors.text }]}>{t('auth.vehicleModel')}</Text>
                        <View style={[
                          styles.inputContainer,
                          { 
                            backgroundColor: themeState.colors.background,
                            borderColor: errors.vehicleModel ? themeState.colors.error : themeState.colors.border
                          }
                        ]}>
                          <Ionicons name="car-outline" size={20} color={themeState.colors.textSecondary} style={styles.inputIcon} />
                          <TextInput
                            style={[styles.input, { color: themeState.colors.text }]}
                            value={formData.vehicleModel}
                            onChangeText={(text) => {
                              setFormData({ ...formData, vehicleModel: text });
                              if (errors.vehicleModel) {
                                setErrors({ ...errors, vehicleModel: '' });
                              }
                            }}
                            placeholder="Honda Civic 2020"
                            placeholderTextColor={themeState.colors.textSecondary}
                            autoCapitalize="words"
                          />
                        </View>
                        {errors.vehicleModel && <Text style={styles.errorText}>{errors.vehicleModel}</Text>}
                      </View>
                    </Animated.View>

                    <Animated.View style={{ opacity: fadeAnim }}>
                      <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: themeState.colors.text }]}>{t('auth.vehiclePlate')}</Text>
                        <View style={[
                          styles.inputContainer,
                          { 
                            backgroundColor: themeState.colors.background,
                            borderColor: errors.vehiclePlate ? themeState.colors.error : themeState.colors.border
                          }
                        ]}>
                          <Ionicons name="car-sport-outline" size={20} color={themeState.colors.textSecondary} style={styles.inputIcon} />
                          <TextInput
                            style={[styles.input, { color: themeState.colors.text }]}
                            value={formData.vehiclePlate}
                            onChangeText={(text) => {
                              const formatted = formatPlate(text);
                              setFormData({ ...formData, vehiclePlate: formatted });
                              if (errors.vehiclePlate) {
                                setErrors({ ...errors, vehiclePlate: '' });
                              }
                            }}
                            placeholder="ABC-1234"
                            placeholderTextColor={themeState.colors.textSecondary}
                            autoCapitalize="characters"
                            maxLength={8}
                          />
                        </View>
                        {errors.vehiclePlate && <Text style={styles.errorText}>{errors.vehiclePlate}</Text>}
                      </View>
                    </Animated.View>
                  </>
                )}

                <Animated.View style={{ opacity: fadeAnim }}>
                  <TouchableOpacity 
                    style={[
                      styles.submitButton, 
                      isLoading && styles.submitButtonDisabled
                    ]} 
                    onPress={handleSubmit}
                    disabled={isLoading}
                  >
                    <ConditionalGradient
                      colors={isLoading ? ['#ccc', '#999'] : [themeState.colors.primary, '#0ea5e9']}
                      style={styles.submitGradient}
                    >
                      {isLoading ? (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator color="#ffffff" size="small" />
                          <Text style={styles.loadingText}>
                            {isLogin ? 'Entrando...' : 'Criando conta...'}
                          </Text>
                        </View>
                      ) : (
                        <>
                          <Ionicons 
                            name={isLogin ? "log-in-outline" : "person-add-outline"} 
                            size={20} 
                            color="#ffffff" 
                          />
                          <Text style={styles.submitButtonText}>
                            {isLogin ? t('auth.loginButton') : t('auth.registerButton')}
                          </Text>
                        </>
                      )}
                    </ConditionalGradient>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ opacity: fadeAnim }}>
                  <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
                    <Text style={[styles.toggleButtonText, { color: themeState.colors.primary }]}>
                      {isLogin 
                        ? 'Não tem conta? Criar conta' 
                        : 'Já tem conta? Fazer login'
                      }
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* Espaçamento extra para garantir que o botão seja sempre visível */}
                <View style={styles.bottomSpacer} />
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ConditionalGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: height < 700 ? 40 : 60,
    minHeight: height,
  },
  header: {
    alignItems: 'center',
    paddingTop: height < 700 ? height * 0.06 : height * 0.08,
    paddingBottom: height < 700 ? height * 0.03 : height * 0.04,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: height < 700 ? 70 : 90,
    height: height < 700 ? 70 : 90,
    borderRadius: height < 700 ? 35 : 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height < 700 ? 16 : 24,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: height < 700 ? 28 : 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: height < 700 ? 24 : 32,
    paddingHorizontal: width < 400 ? 20 : 24,
    paddingBottom: height < 700 ? 20 : 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 4,
    marginBottom: 32,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modeButtonActive: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: height < 700 ? 20 : 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
    marginLeft: 4,
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  toggleButton: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 16,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  bottomSpacer: {
    height: height < 700 ? 30 : 50,
  },
});

export default AuthScreen;