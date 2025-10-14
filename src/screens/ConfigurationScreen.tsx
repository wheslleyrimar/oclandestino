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
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import ProfileEditModal from '../components/ProfileEditModal';
import GoalsEditModal from '../components/GoalsEditModal';
import PreferencesEditModal from '../components/PreferencesEditModal';
import { showLogoutConfirm } from '../utils/confirmDialog';

type ConfigurationSection = 'profile' | 'goals' | 'preferences';

const ConfigurationScreen = () => {
  const { state } = useConfiguration();
  const { logout } = useAuth();
  const { state: themeState, setTheme } = useTheme();
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<ConfigurationSection>('profile');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [goalsModalVisible, setGoalsModalVisible] = useState(false);
  const [preferencesModalVisible, setPreferencesModalVisible] = useState(false);

  const handleLogout = () => {
    showLogoutConfirm(async () => {
      await logout();
    });
  };

  const sections = [
    {
      id: 'profile' as ConfigurationSection,
      title: t('configuration.profile'),
      icon: '👤',
      description: t('configuration.profileDescription'),
      color: '#3b82f6',
    },
    {
      id: 'goals' as ConfigurationSection,
      title: t('configuration.goals'),
      icon: '🎯',
      description: t('configuration.goalsDescription'),
      color: '#22c55e',
    },
    {
      id: 'preferences' as ConfigurationSection,
      title: t('configuration.preferences'),
      icon: '⚙️',
      description: t('configuration.preferencesDescription'),
      color: '#f59e0b',
    },
  ];

  const renderProfileSection = () => (
    <View style={styles.modernContent}>
      {/* Profile Header Card */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.profileAvatar}>
          <Ionicons name="person-outline" size={20} color="#6b7280" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{state.profile.name}</Text>
          <Text style={styles.profileEmail}>{state.profile.email}</Text>
        </View>
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => setProfileModalVisible(true)}
        >
          <Ionicons name="pencil" size={16} color={themeState.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Info Cards */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>{t('configuration.personalInfo')}</Text>
        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <View style={styles.infoCardIcon}>
              <Text style={styles.infoCardIconText}>📱</Text>
            </View>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardLabel}>{t('configuration.phone')}</Text>
              <Text style={styles.infoCardValue}>{state.profile.phone}</Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoCardIcon}>
              <Text style={styles.infoCardIconText}>🆔</Text>
            </View>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardLabel}>{t('configuration.license')}</Text>
              <Text style={styles.infoCardValue}>{state.profile.licenseNumber}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Vehicle Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>{t('configuration.vehicleInfo')}</Text>
        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <View style={styles.infoCardIcon}>
              <Text style={styles.infoCardIconText}>🚗</Text>
            </View>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardLabel}>{t('configuration.vehicleModel')}</Text>
              <Text style={styles.infoCardValue}>{state.profile.vehicleModel}</Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoCardIcon}>
              <Text style={styles.infoCardIconText}>🔢</Text>
            </View>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardLabel}>{t('configuration.vehiclePlate')}</Text>
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
          <Ionicons name="flag-outline" size={20} color="#6b7280" />
        </View>
        <View style={styles.goalsHeaderContent}>
          <Text style={styles.goalsHeaderTitle}>{t('configuration.performanceGoals')}</Text>
          <Text style={styles.goalsHeaderSubtitle}>{t('configuration.goalsDescription')}</Text>
        </View>
        <TouchableOpacity 
          style={styles.editGoalsButton}
          onPress={() => setGoalsModalVisible(true)}
        >
          <Ionicons name="pencil" size={16} color={themeState.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Earnings Goals */}
      <View style={styles.goalsSection}>
        <Text style={styles.sectionTitle}>{t('configuration.earningsGoals')}</Text>
        <View style={styles.goalsCards}>
          <View style={styles.goalCard}>
            <View style={styles.goalCardIcon}>
              <Text style={styles.goalCardIconText}>💰</Text>
            </View>
            <View style={styles.goalCardContent}>
              <Text style={styles.goalCardLabel}>{t('configuration.monthlyEarningsGoal')}</Text>
              <Text style={styles.goalCardValue}>R$ {state.goals.monthlyEarningsGoal.toLocaleString()}</Text>
            </View>
          </View>
          
          <View style={styles.goalCard}>
            <View style={styles.goalCardIcon}>
              <Text style={styles.goalCardIconText}>⏱️</Text>
            </View>
            <View style={styles.goalCardContent}>
              <Text style={styles.goalCardLabel}>{t('configuration.averageEarningsPerHourGoal')}</Text>
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
          <Ionicons name="settings-outline" size={20} color="#6b7280" />
        </View>
        <View style={styles.preferencesHeaderContent}>
          <Text style={styles.preferencesHeaderTitle}>{t('configuration.preferences')}</Text>
          <Text style={styles.preferencesHeaderSubtitle}>{t('configuration.preferencesDescription')}</Text>
        </View>
        <TouchableOpacity 
          style={styles.editPreferencesButton}
          onPress={() => setPreferencesModalVisible(true)}
        >
          <Ionicons name="pencil" size={16} color={themeState.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* App Settings */}
      <View style={styles.preferencesSection}>
        <Text style={styles.sectionTitle}>{t('configuration.appSettings')}</Text>
        <View style={styles.preferencesCards}>
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceCardIcon}>
              <Text style={styles.preferenceCardIconText}>🌐</Text>
            </View>
            <View style={styles.preferenceCardContent}>
              <Text style={styles.preferenceCardLabel}>{t('configuration.language')}</Text>
              <Text style={styles.preferenceCardValue}>
                {state.preferences?.language === 'pt-BR' ? t('preferencesModal.portuguese') : 
                 state.preferences?.language === 'en-US' ? t('preferencesModal.english') : t('preferencesModal.spanish')}
              </Text>
            </View>
          </View>
          
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceCardIcon}>
              <Text style={styles.preferenceCardIconText}>🎨</Text>
            </View>
            <View style={styles.preferenceCardContent}>
              <Text style={styles.preferenceCardLabel}>{t('configuration.theme')}</Text>
              <Text style={styles.preferenceCardValue}>
                {themeState.theme === 'light' ? t('preferencesModal.light') : 
                 themeState.theme === 'dark' ? t('preferencesModal.dark') : 
                 themeState.theme === 'auto' ? t('preferencesModal.auto') : t('preferencesModal.system')}
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
                {state.preferences?.currency === 'BRL' ? 'Real (R$)' : 
                 state.preferences?.currency === 'USD' ? 'Dólar ($)' : 'Euro (€)'}
              </Text>
            </View>
          </View>
          
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceCardIcon}>
              <Text style={styles.preferenceCardIconText}>📅</Text>
            </View>
            <View style={styles.preferenceCardContent}>
              <Text style={styles.preferenceCardLabel}>Formato de Data</Text>
              <Text style={styles.preferenceCardValue}>{state.preferences?.dateFormat || 'DD/MM/YYYY'}</Text>
            </View>
          </View>
          
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceCardIcon}>
              <Text style={styles.preferenceCardIconText}>⏰</Text>
            </View>
            <View style={styles.preferenceCardContent}>
              <Text style={styles.preferenceCardLabel}>Formato de Hora</Text>
              <Text style={styles.preferenceCardValue}>
                {state.preferences?.timeFormat === '24h' ? '24 horas' : '12 horas'}
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
                { backgroundColor: state.preferences.notifications?.earnings ? '#dcfce7' : '#f3f4f6' }
              ]}>
                <Text style={[
                  styles.notificationStatusText, 
                  { color: state.preferences.notifications?.earnings ? '#22c55e' : '#6b7280' }
                ]}>
                  {state.preferences.notifications?.earnings ? 'Ativado' : 'Desativado'}
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
                { backgroundColor: state.preferences.notifications?.goals ? '#dcfce7' : '#f3f4f6' }
              ]}>
                <Text style={[
                  styles.notificationStatusText, 
                  { color: state.preferences.notifications?.goals ? '#22c55e' : '#6b7280' }
                ]}>
                  {state.preferences.notifications?.goals ? 'Ativado' : 'Desativado'}
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
                { backgroundColor: state.preferences.notifications?.reminders ? '#dcfce7' : '#f3f4f6' }
              ]}>
                <Text style={[
                  styles.notificationStatusText, 
                  { color: state.preferences.notifications?.reminders ? '#22c55e' : '#6b7280' }
                ]}>
                  {state.preferences.notifications?.reminders ? 'Ativado' : 'Desativado'}
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
                { backgroundColor: state.preferences.notifications?.promotions ? '#dcfce7' : '#f3f4f6' }
              ]}>
                <Text style={[
                  styles.notificationStatusText, 
                  { color: state.preferences.notifications?.promotions ? '#22c55e' : '#6b7280' }
                ]}>
                  {state.preferences.notifications?.promotions ? 'Ativado' : 'Desativado'}
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
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Ionicons name="settings-outline" size={24} color={themeState.colors.text} />
            </View>
            <View>
              <Text style={styles.title}>{t('configuration.title')}</Text>
              <Text style={styles.subtitle}>{t('configuration.preferencesDescription')}</Text>
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
              activeOpacity={0.7}
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
        
        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={styles.logoutIconContainer}>
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            </View>
            <Text style={styles.logoutButtonText}>{t('configuration.logout')}</Text>
          </TouchableOpacity>
        </View>
        
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
  
  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },

  // Modern Tab Navigation
  tabContainer: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
  },
  modernTab: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 90,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  activeModernTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowOpacity: 0.15,
    elevation: 4,
  },
  tabIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  activeTabIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#ffffff',
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  modernContent: {
    paddingTop: 16,
  },

  // Profile Section
  profileHeaderCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileAvatarText: {
    fontSize: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  editProfileButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Info Sections
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    paddingLeft: 4,
  },
  infoCards: {
    gap: 8,
  },
  infoCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  infoCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCardIconText: {
    fontSize: 16,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
    fontWeight: '500',
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },

  // Goals Section
  goalsHeaderCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  goalsHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalsHeaderIconText: {
    fontSize: 20,
  },
  goalsHeaderContent: {
    flex: 1,
  },
  goalsHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  goalsHeaderSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  editGoalsButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },

  goalsSection: {
    marginBottom: 20,
  },
  goalsCards: {
    gap: 8,
  },
  goalCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  goalCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalCardIconText: {
    fontSize: 16,
  },
  goalCardContent: {
    flex: 1,
  },
  goalCardLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
    fontWeight: '500',
  },
  goalCardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },

  // Preferences Section
  preferencesHeaderCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  preferencesHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  preferencesHeaderIconText: {
    fontSize: 20,
  },
  preferencesHeaderContent: {
    flex: 1,
  },
  preferencesHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  preferencesHeaderSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  editPreferencesButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },

  preferencesSection: {
    marginBottom: 20,
  },
  preferencesCards: {
    gap: 8,
  },
  preferenceCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  preferenceCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  preferenceCardIconText: {
    fontSize: 16,
  },
  preferenceCardContent: {
    flex: 1,
  },
  preferenceCardLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
    fontWeight: '500',
  },
  preferenceCardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },

  // Notifications
  notificationsCards: {
    gap: 8,
  },
  notificationCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  notificationCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationCardIconText: {
    fontSize: 16,
  },
  notificationCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationCardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  notificationStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  notificationStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  bottomSpacing: {
    height: 80,
  },
  logoutSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#fecaca',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
});

export default ConfigurationScreen;
