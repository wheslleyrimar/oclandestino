import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useConfiguration } from '../context/ConfigurationContext';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import ProfileEditModal from '../components/ProfileEditModal';
import GoalsEditModal from '../components/GoalsEditModal';
import PreferencesEditModal from '../components/PreferencesEditModal';

type ConfigurationSection = 'profile' | 'goals' | 'preferences';

const ConfigurationScreen = () => {
  const { state } = useConfiguration();
  const { state: themeState, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<ConfigurationSection>('profile');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [goalsModalVisible, setGoalsModalVisible] = useState(false);
  const [preferencesModalVisible, setPreferencesModalVisible] = useState(false);

  const sections = [
    {
      id: 'profile' as ConfigurationSection,
      title: 'Perfil',
      icon: '👤',
      description: 'Dados pessoais e do veículo',
      color: '#3b82f6',
    },
    {
      id: 'goals' as ConfigurationSection,
      title: 'Metas',
      icon: '🎯',
      description: 'Metas de desempenho',
      color: '#22c55e',
    },
    {
      id: 'preferences' as ConfigurationSection,
      title: 'Preferências',
      icon: '⚙️',
      description: 'Configurações do app',
      color: '#f59e0b',
    },
  ];

  const renderProfileSection = () => (
    <View style={styles.modernContent}>
      {/* Profile Header Card */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>👤</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{state.profile.name}</Text>
          <Text style={styles.profileEmail}>{state.profile.email}</Text>
        </View>
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => setProfileModalVisible(true)}
        >
          <Ionicons name="create-outline" size={16} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Info Cards */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <View style={styles.infoCardIcon}>
              <Text style={styles.infoCardIconText}>📱</Text>
            </View>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardLabel}>Telefone</Text>
              <Text style={styles.infoCardValue}>{state.profile.phone}</Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoCardIcon}>
              <Text style={styles.infoCardIconText}>🆔</Text>
            </View>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardLabel}>CNH</Text>
              <Text style={styles.infoCardValue}>{state.profile.licenseNumber}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Vehicle Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Veículo</Text>
        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <View style={styles.infoCardIcon}>
              <Text style={styles.infoCardIconText}>🚗</Text>
            </View>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardLabel}>Modelo</Text>
              <Text style={styles.infoCardValue}>{state.profile.vehicleModel}</Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoCardIcon}>
              <Text style={styles.infoCardIconText}>🔢</Text>
            </View>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardLabel}>Placa</Text>
              <Text style={styles.infoCardValue}>{state.profile.vehiclePlate}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderGoalsSection = () => (
    <View style={styles.modernContent}>
      {/* Goals Header */}
      <View style={styles.goalsHeaderCard}>
        <View style={styles.goalsHeaderIcon}>
          <Text style={styles.goalsHeaderIconText}>🎯</Text>
        </View>
        <View style={styles.goalsHeaderContent}>
          <Text style={styles.goalsHeaderTitle}>Metas de Desempenho</Text>
          <Text style={styles.goalsHeaderSubtitle}>Configure suas metas de ganhos e trabalho</Text>
        </View>
        <TouchableOpacity 
          style={styles.editGoalsButton}
          onPress={() => setGoalsModalVisible(true)}
        >
          <Ionicons name="create-outline" size={16} color="#22c55e" />
        </TouchableOpacity>
      </View>

      {/* Earnings Goals */}
      <View style={styles.goalsSection}>
        <Text style={styles.sectionTitle}>Metas de Ganhos</Text>
        <View style={styles.goalsCards}>
          <View style={styles.goalCard}>
            <View style={styles.goalCardIcon}>
              <Text style={styles.goalCardIconText}>💰</Text>
            </View>
            <View style={styles.goalCardContent}>
              <Text style={styles.goalCardLabel}>Ganhos Mensais</Text>
              <Text style={styles.goalCardValue}>R$ {state.goals.monthlyEarningsGoal.toLocaleString()}</Text>
            </View>
          </View>
          
          <View style={styles.goalCard}>
            <View style={styles.goalCardIcon}>
              <Text style={styles.goalCardIconText}>⏱️</Text>
            </View>
            <View style={styles.goalCardContent}>
              <Text style={styles.goalCardLabel}>Ganho por Hora</Text>
              <Text style={styles.goalCardValue}>R$ {state.goals.averageEarningsPerHourGoal}/h</Text>
            </View>
          </View>
          
          <View style={styles.goalCard}>
            <View style={styles.goalCardIcon}>
              <Text style={styles.goalCardIconText}>🎯</Text>
            </View>
            <View style={styles.goalCardContent}>
              <Text style={styles.goalCardLabel}>Ganho por Corrida</Text>
              <Text style={styles.goalCardValue}>R$ {state.goals.averageEarningsPerTripGoal}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Work Goals */}
      <View style={styles.goalsSection}>
        <Text style={styles.sectionTitle}>Metas de Trabalho</Text>
        <View style={styles.goalsCards}>
          <View style={styles.goalCard}>
            <View style={styles.goalCardIcon}>
              <Text style={styles.goalCardIconText}>🚗</Text>
            </View>
            <View style={styles.goalCardContent}>
              <Text style={styles.goalCardLabel}>Corridas Diárias</Text>
              <Text style={styles.goalCardValue}>{state.goals.dailyTripsGoal} corridas</Text>
            </View>
          </View>
          
          <View style={styles.goalCard}>
            <View style={styles.goalCardIcon}>
              <Text style={styles.goalCardIconText}>⏰</Text>
            </View>
            <View style={styles.goalCardContent}>
              <Text style={styles.goalCardLabel}>Horas Semanais</Text>
              <Text style={styles.goalCardValue}>{state.goals.weeklyHoursGoal}h</Text>
            </View>
          </View>
          
          <View style={styles.goalCard}>
            <View style={styles.goalCardIcon}>
              <Text style={styles.goalCardIconText}>📅</Text>
            </View>
            <View style={styles.goalCardContent}>
              <Text style={styles.goalCardLabel}>Horas Mensais</Text>
              <Text style={styles.goalCardValue}>{state.goals.monthlyHoursGoal}h</Text>
            </View>
          </View>
          
          <View style={styles.goalCard}>
            <View style={styles.goalCardIcon}>
              <Text style={styles.goalCardIconText}>📊</Text>
            </View>
            <View style={styles.goalCardContent}>
              <Text style={styles.goalCardLabel}>Dias por Semana</Text>
              <Text style={styles.goalCardValue}>{state.goals.workingDaysPerWeekGoal} dias</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPreferencesSection = () => (
    <View style={styles.modernContent}>
      {/* Preferences Header */}
      <View style={styles.preferencesHeaderCard}>
        <View style={styles.preferencesHeaderIcon}>
          <Text style={styles.preferencesHeaderIconText}>⚙️</Text>
        </View>
        <View style={styles.preferencesHeaderContent}>
          <Text style={styles.preferencesHeaderTitle}>Preferências do App</Text>
          <Text style={styles.preferencesHeaderSubtitle}>Personalize sua experiência de uso</Text>
        </View>
        <TouchableOpacity 
          style={styles.editPreferencesButton}
          onPress={() => setPreferencesModalVisible(true)}
        >
          <Ionicons name="create-outline" size={16} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      {/* App Settings */}
      <View style={styles.preferencesSection}>
        <Text style={styles.sectionTitle}>Configurações do App</Text>
        <View style={styles.preferencesCards}>
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceCardIcon}>
              <Text style={styles.preferenceCardIconText}>🌐</Text>
            </View>
            <View style={styles.preferenceCardContent}>
              <Text style={styles.preferenceCardLabel}>Idioma</Text>
              <Text style={styles.preferenceCardValue}>
                {state.preferences.language === 'pt-BR' ? 'Português' : 
                 state.preferences.language === 'en-US' ? 'English' : 'Español'}
              </Text>
            </View>
          </View>
          
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceCardIcon}>
              <Text style={styles.preferenceCardIconText}>🎨</Text>
            </View>
            <View style={styles.preferenceCardContent}>
              <Text style={styles.preferenceCardLabel}>Tema</Text>
              <Text style={styles.preferenceCardValue}>
                {themeState.theme === 'light' ? 'Claro' : 
                 themeState.theme === 'dark' ? 'Escuro' : 
                 themeState.theme === 'auto' ? 'Automático' : 'Sistema'}
              </Text>
            </View>
          </View>
          
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceCardIcon}>
              <Text style={styles.preferenceCardIconText}>💰</Text>
            </View>
            <View style={styles.preferenceCardContent}>
              <Text style={styles.preferenceCardLabel}>Moeda</Text>
              <Text style={styles.preferenceCardValue}>
                {state.preferences.currency === 'BRL' ? 'Real (R$)' : 
                 state.preferences.currency === 'USD' ? 'Dólar ($)' : 'Euro (€)'}
              </Text>
            </View>
          </View>
          
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceCardIcon}>
              <Text style={styles.preferenceCardIconText}>📅</Text>
            </View>
            <View style={styles.preferenceCardContent}>
              <Text style={styles.preferenceCardLabel}>Formato de Data</Text>
              <Text style={styles.preferenceCardValue}>{state.preferences.dateFormat}</Text>
            </View>
          </View>
          
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceCardIcon}>
              <Text style={styles.preferenceCardIconText}>⏰</Text>
            </View>
            <View style={styles.preferenceCardContent}>
              <Text style={styles.preferenceCardLabel}>Formato de Hora</Text>
              <Text style={styles.preferenceCardValue}>
                {state.preferences.timeFormat === '24h' ? '24 horas' : '12 horas'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.preferencesSection}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        <View style={styles.notificationsCards}>
          <View style={styles.notificationCard}>
            <View style={styles.notificationCardIcon}>
              <Text style={styles.notificationCardIconText}>🔔</Text>
            </View>
            <View style={styles.notificationCardContent}>
              <Text style={styles.notificationCardLabel}>Ganhos</Text>
              <View style={[
                styles.notificationStatus, 
                { backgroundColor: state.preferences.notifications.earnings ? '#dcfce7' : '#f3f4f6' }
              ]}>
                <Text style={[
                  styles.notificationStatusText, 
                  { color: state.preferences.notifications.earnings ? '#22c55e' : '#6b7280' }
                ]}>
                  {state.preferences.notifications.earnings ? 'Ativado' : 'Desativado'}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.notificationCard}>
            <View style={styles.notificationCardIcon}>
              <Text style={styles.notificationCardIconText}>🎯</Text>
            </View>
            <View style={styles.notificationCardContent}>
              <Text style={styles.notificationCardLabel}>Metas</Text>
              <View style={[
                styles.notificationStatus, 
                { backgroundColor: state.preferences.notifications.goals ? '#dcfce7' : '#f3f4f6' }
              ]}>
                <Text style={[
                  styles.notificationStatusText, 
                  { color: state.preferences.notifications.goals ? '#22c55e' : '#6b7280' }
                ]}>
                  {state.preferences.notifications.goals ? 'Ativado' : 'Desativado'}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.notificationCard}>
            <View style={styles.notificationCardIcon}>
              <Text style={styles.notificationCardIconText}>⏰</Text>
            </View>
            <View style={styles.notificationCardContent}>
              <Text style={styles.notificationCardLabel}>Lembretes</Text>
              <View style={[
                styles.notificationStatus, 
                { backgroundColor: state.preferences.notifications.reminders ? '#dcfce7' : '#f3f4f6' }
              ]}>
                <Text style={[
                  styles.notificationStatusText, 
                  { color: state.preferences.notifications.reminders ? '#22c55e' : '#6b7280' }
                ]}>
                  {state.preferences.notifications.reminders ? 'Ativado' : 'Desativado'}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.notificationCard}>
            <View style={styles.notificationCardIcon}>
              <Text style={styles.notificationCardIconText}>📢</Text>
            </View>
            <View style={styles.notificationCardContent}>
              <Text style={styles.notificationCardLabel}>Promoções</Text>
              <View style={[
                styles.notificationStatus, 
                { backgroundColor: state.preferences.notifications.promotions ? '#dcfce7' : '#f3f4f6' }
              ]}>
                <Text style={[
                  styles.notificationStatusText, 
                  { color: state.preferences.notifications.promotions ? '#22c55e' : '#6b7280' }
                ]}>
                  {state.preferences.notifications.promotions ? 'Ativado' : 'Desativado'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'goals':
        return renderGoalsSection();
      case 'preferences':
        return renderPreferencesSection();
      default:
        return renderProfileSection();
    }
  };

  const styles = createStyles(themeState.colors);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={themeState.isDark ? "light-content" : "dark-content"} backgroundColor={themeState.colors.headerBackground} />
      
      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>⚙️</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Configurações</Text>
              <Text style={styles.headerSubtitle}>Personalize sua experiência</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Modern Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {sections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={[
                styles.modernTab,
                activeSection === section.id && styles.activeModernTab,
              ]}
              onPress={() => setActiveSection(section.id)}
            >
              <View style={[
                styles.tabIconContainer,
                activeSection === section.id && styles.activeTabIconContainer
              ]}>
                <Text style={styles.tabIcon}>{section.icon}</Text>
              </View>
              <Text style={[
                styles.tabLabel,
                activeSection === section.id && styles.activeTabLabel
              ]}>
                {section.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <ProfileEditModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
      />
      
      <GoalsEditModal
        visible={goalsModalVisible}
        onClose={() => setGoalsModalVisible(false)}
      />
      
      <PreferencesEditModal
        visible={preferencesModalVisible}
        onClose={() => setPreferencesModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Modern Header
  header: {
    backgroundColor: colors.headerBackground,
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerIconText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.headerText,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },

  // Modern Tab Navigation
  tabContainer: {
    backgroundColor: colors.tabBackground,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabScrollContent: {
    paddingHorizontal: 20,
  },
  modernTab: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 100,
  },
  activeModernTab: {
    backgroundColor: colors.tabActiveBackground,
    borderColor: colors.tabActiveBackground,
  },
  tabIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activeTabIconContainer: {
    backgroundColor: colors.tabActiveText,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.tabText,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: colors.tabActiveText,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modernContent: {
    paddingTop: 20,
  },

  // Profile Section
  profileHeaderCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.info,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileAvatarText: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Info Sections
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    paddingLeft: 4,
  },
  infoCards: {
    gap: 12,
  },
  infoCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoCardIconText: {
    fontSize: 20,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },

  // Goals Section
  goalsHeaderCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  goalsHeaderIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  goalsHeaderIconText: {
    fontSize: 28,
  },
  goalsHeaderContent: {
    flex: 1,
  },
  goalsHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  goalsHeaderSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  editGoalsButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },

  goalsSection: {
    marginBottom: 24,
  },
  goalsCards: {
    gap: 12,
  },
  goalCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  goalCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  goalCardIconText: {
    fontSize: 20,
  },
  goalCardContent: {
    flex: 1,
  },
  goalCardLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  goalCardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },

  // Preferences Section
  preferencesHeaderCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  preferencesHeaderIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  preferencesHeaderIconText: {
    fontSize: 28,
  },
  preferencesHeaderContent: {
    flex: 1,
  },
  preferencesHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  preferencesHeaderSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  editPreferencesButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },

  preferencesSection: {
    marginBottom: 24,
  },
  preferencesCards: {
    gap: 12,
  },
  preferenceCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  preferenceCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  preferenceCardIconText: {
    fontSize: 20,
  },
  preferenceCardContent: {
    flex: 1,
  },
  preferenceCardLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  preferenceCardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },

  // Notifications
  notificationsCards: {
    gap: 12,
  },
  notificationCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  notificationCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  notificationCardIconText: {
    fontSize: 20,
  },
  notificationCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationCardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  notificationStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  notificationStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  bottomSpacing: {
    height: 120,
  },
});

export default ConfigurationScreen;
