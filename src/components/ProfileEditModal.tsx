import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useConfiguration } from '../context/ConfigurationContext';
import { DriverProfile, AppType, VehicleStatus, VehicleProtection } from '../types';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
}

// Categorias por aplicativo
const APP_CATEGORIES = {
  'Uber': ['BLACK', 'COMFORT', 'UBER X', 'UBER PET', 'UBER POR TEMPO', 'UBER ENVIOS'],
  '99': ['99POP', '99PLUS', '99ENTREGAS'],
  'inDrive': ['ELECTRIC PRO'],
  'Cabify': ['ELECTRIC PRO'],
  'Outros': ['ELECTRIC PRO']
};

const APP_OPTIONS: AppType[] = ['Uber', '99', 'inDrive', 'Cabify', 'Outros'];
const VEHICLE_STATUS_OPTIONS: VehicleStatus[] = ['Próprio', 'Alugado'];
const VEHICLE_PROTECTION_OPTIONS: VehicleProtection[] = ['Seguro', 'Proteção Veicular', 'Desprotegido'];

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ visible, onClose }) => {
  const { state, updateProfile } = useConfiguration();
  const [formData, setFormData] = useState<Partial<DriverProfile>>({});
  const [showVehicleStatusDropdown, setShowVehicleStatusDropdown] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    if (visible) {
      setFormData({
        ...state.profile,
        favoriteApps: state.profile.favoriteApps || [],
        appCategories: state.profile.appCategories || [],
        vehicleModel: state.profile.vehicleModel || '',
        vehiclePlate: state.profile.vehiclePlate || '',
        vehicleStatus: state.profile.vehicleStatus || undefined,
        vehicleProtection: state.profile.vehicleProtection || undefined,
      });
    }
  }, [visible, state.profile]);

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    updateProfile(formData);
    onClose();
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const handleCancel = () => {
    setFormData({
      ...state.profile,
      favoriteApps: state.profile.favoriteApps || [],
      appCategories: state.profile.appCategories || [],
      vehicleModel: state.profile.vehicleModel || '',
      vehiclePlate: state.profile.vehiclePlate || '',
      vehicleStatus: state.profile.vehicleStatus || undefined,
      vehicleProtection: state.profile.vehicleProtection || undefined,
    });
    onClose();
  };

  const toggleFavoriteApp = (app: AppType) => {
    const currentApps = formData.favoriteApps || [];
    const updatedApps = currentApps.includes(app)
      ? currentApps.filter(a => a !== app)
      : [...currentApps, app];
    
    // Limpar categorias que não são mais válidas para os apps selecionados
    const validCategories = getAvailableCategories();
    const currentCategories = formData.appCategories || [];
    const filteredCategories = currentCategories.filter(cat => validCategories.includes(cat));
    
    setFormData({ 
      ...formData, 
      favoriteApps: updatedApps,
      appCategories: filteredCategories
    });
  };

  const toggleAppCategory = (category: string) => {
    const currentCategories = formData.appCategories || [];
    const updatedCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    setFormData({ ...formData, appCategories: updatedCategories });
  };

  const getAvailableCategories = () => {
    const selectedApps = formData.favoriteApps || [];
    if (selectedApps.length === 0) return [];
    
    // Se apenas um app está selecionado, retorna suas categorias
    if (selectedApps.length === 1) {
      return APP_CATEGORIES[selectedApps[0]] || [];
    }
    
    // Se múltiplos apps estão selecionados, retorna todas as categorias únicas
    const allCategories = selectedApps.flatMap(app => APP_CATEGORIES[app] || []);
    return [...new Set(allCategories)];
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria de fotos.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoadingImage(true);
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Usar a URI da imagem para exibição e base64 para armazenamento
        const imageData = {
          uri: asset.uri,
          base64: asset.base64,
        };
        setFormData({ ...formData, avatar: asset.uri });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    } finally {
      setIsLoadingImage(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua câmera.');
      return;
    }

    setIsLoadingImage(true);
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Usar a URI da imagem para exibição e base64 para armazenamento
        const imageData = {
          uri: asset.uri,
          base64: asset.base64,
        };
        setFormData({ ...formData, avatar: asset.uri });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    } finally {
      setIsLoadingImage(false);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Selecionar Foto',
      'Escolha uma opção',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Câmera', onPress: takePhoto },
        { text: 'Galeria', onPress: pickImage },
      ]
    );
  };

  const removePhoto = () => {
    Alert.alert(
      'Remover Foto',
      'Tem certeza que deseja remover sua foto de perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => setFormData({ ...formData, avatar: undefined }) },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Foto do Perfil */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Foto do Perfil</Text>
            <View style={styles.form}>
              <View style={styles.photoSection}>
                <View style={styles.photoContainer}>
                  {formData.avatar ? (
                    <Image source={{ uri: formData.avatar }} style={styles.profilePhoto} />
                  ) : (
                    <View style={styles.placeholderPhoto}>
                      <Ionicons name="person" size={40} color="#9ca3af" />
                    </View>
                  )}
                  {isLoadingImage && (
                    <View style={styles.loadingOverlay}>
                      <Ionicons name="refresh" size={20} color="#ffffff" />
                    </View>
                  )}
                </View>
                <View style={styles.photoActions}>
                  <TouchableOpacity 
                    style={styles.photoButton} 
                    onPress={showImagePicker}
                    disabled={isLoadingImage}
                  >
                    <Ionicons name="camera" size={16} color="#3b82f6" />
                    <Text style={styles.photoButtonText}>
                      {formData.avatar ? 'Alterar Foto' : 'Adicionar Foto'}
                    </Text>
                  </TouchableOpacity>
                  {formData.avatar && (
                    <TouchableOpacity 
                      style={[styles.photoButton, styles.removeButton]} 
                      onPress={removePhoto}
                      disabled={isLoadingImage}
                    >
                      <Ionicons name="trash" size={16} color="#ef4444" />
                      <Text style={[styles.photoButtonText, styles.removeButtonText]}>
                        Remover
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Informações Pessoais */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name || ''}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Digite seu nome completo"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email || ''}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder="Digite seu email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Telefone *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone || ''}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="(11) 99999-9999"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {/* Aplicativos e Categorias */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aplicativos e Categorias</Text>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Aplicativos Favoritos *</Text>
                <View style={styles.appsContainer}>
                  {APP_OPTIONS.map((app) => (
                    <TouchableOpacity
                      key={app}
                      style={[
                        styles.appButton,
                        formData.favoriteApps?.includes(app) && styles.appButtonSelected
                      ]}
                      onPress={() => toggleFavoriteApp(app)}
                    >
                      <Text style={[
                        styles.appButtonText,
                        formData.favoriteApps?.includes(app) && styles.appButtonTextSelected
                      ]}>
                        {app}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Categorias do Aplicativo */}
              {getAvailableCategories().length > 0 && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Categorias do Aplicativo</Text>
                  <View style={styles.categoriesContainer}>
                    {getAvailableCategories().map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryButton,
                          formData.appCategories?.includes(category) && styles.categoryButtonSelected
                        ]}
                        onPress={() => toggleAppCategory(category)}
                      >
                        <Text style={[
                          styles.categoryButtonText,
                          formData.appCategories?.includes(category) && styles.categoryButtonTextSelected
                        ]}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Informações do Veículo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações do Veículo</Text>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Modelo do Veículo</Text>
                <TextInput
                  style={styles.input}
                  value={formData.vehicleModel || ''}
                  onChangeText={(text) => setFormData({ ...formData, vehicleModel: text })}
                  placeholder="Ex: Honda Civic 2020"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Placa do Veículo</Text>
                <TextInput
                  style={styles.input}
                  value={formData.vehiclePlate || ''}
                  onChangeText={(text) => setFormData({ ...formData, vehiclePlate: text.toUpperCase() })}
                  placeholder="ABC-1234"
                  autoCapitalize="characters"
                  maxLength={8}
                />
              </View>

              {/* Status do Veículo */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Status do Veículo</Text>
                <View style={styles.statusContainer}>
                  {VEHICLE_STATUS_OPTIONS.map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        formData.vehicleStatus === status && styles.statusButtonSelected
                      ]}
                      onPress={() => {
                        const newData = { ...formData, vehicleStatus: status };
                        // Se mudou para "Alugado", limpar a proteção
                        if (status === 'Alugado') {
                          newData.vehicleProtection = undefined;
                        }
                        setFormData(newData);
                      }}
                    >
                      <Text style={[
                        styles.statusButtonText,
                        formData.vehicleStatus === status && styles.statusButtonTextSelected
                      ]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Proteção do Veículo - Só aparece se for Próprio */}
              {formData.vehicleStatus === 'Próprio' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Proteção do Veículo</Text>
                  <View style={styles.protectionContainer}>
                    {VEHICLE_PROTECTION_OPTIONS.map((protection) => (
                      <TouchableOpacity
                        key={protection}
                        style={[
                          styles.protectionButton,
                          formData.vehicleProtection === protection && styles.protectionButtonSelected
                        ]}
                        onPress={() => setFormData({ ...formData, vehicleProtection: protection })}
                      >
                        <Text style={[
                          styles.protectionButtonText,
                          formData.vehicleProtection === protection && styles.protectionButtonTextSelected
                        ]}>
                          {protection}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  appsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  appButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  appButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  appButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  appButtonTextSelected: {
    color: '#ffffff',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  categoryButtonSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: '#ffffff',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  statusButtonSelected: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  statusButtonTextSelected: {
    color: '#ffffff',
  },
  protectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  protectionButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  protectionButtonSelected: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  protectionButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  protectionButtonTextSelected: {
    color: '#ffffff',
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
  },
  placeholderPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    backgroundColor: '#ffffff',
    gap: 6,
  },
  removeButton: {
    borderColor: '#ef4444',
  },
  photoButtonText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  removeButtonText: {
    color: '#ef4444',
  },
});

export default ProfileEditModal;
