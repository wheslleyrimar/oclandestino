import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import NewEntryModal from './NewEntryModal';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const { state: themeState } = useTheme();
  const { loadData } = useFinance();

  // Verificação de segurança
  if (!themeState || !themeState.colors) {
    return null;
  }

  if (!state || !descriptors) {
    return null;
  }
  const getTabIcon = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case 'Overview':
        return '🏠';
      case 'Dashboard':
        return '📊';
      case 'Transactions':
        return '📋';
      case 'Configuration':
        return '⚙️';
      default:
        return '⚪';
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'Overview':
        return 'Painel';
      case 'Dashboard':
        return 'Dashboard';
      case 'Transactions':
        return 'Lançamentos';
      case 'Configuration':
        return 'Config';
      default:
        return routeName;
    }
  };

  const styles = createStyles(themeState.colors);

  const handleNewEntryPress = () => {
    setShowNewEntryModal(true);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.tabBar}>
          {/* Renderizar tabs na ordem correta: Overview, Dashboard, Novo, Transactions, Configuration */}
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = getTabLabel(route.name);
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <React.Fragment key={`tab-${index}`}>
                <TouchableOpacity
                  style={styles.tab}
                  onPress={onPress}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tabIcon,
                      { color: isFocused ? '#3b82f6' : '#9ca3af' }
                    ]}
                  >
                    {getTabIcon(route.name, isFocused)}
                  </Text>
                  <Text
                    style={[
                      styles.tabLabel,
                      { color: isFocused ? '#3b82f6' : '#9ca3af' }
                    ]}
                  >
                    {label}
                  </Text>
                  {isFocused && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                
                {/* Adicionar botão Novo Lançamento após Dashboard */}
                {route.name === 'Dashboard' && (
                  <TouchableOpacity
                    style={styles.newEntryButton}
                    onPress={handleNewEntryPress}
                    activeOpacity={0.8}
                  >
                    <View style={styles.newEntryButtonContent}>
                      <Text style={styles.newEntryIcon}>+</Text>
                    </View>
                    <Text style={styles.newEntryLabel}>Novo</Text>
                  </TouchableOpacity>
                )}
              </React.Fragment>
            );
          })}
        </View>
      </View>
      
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
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    position: 'relative',
    flexShrink: 0,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  newEntryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    position: 'relative',
    marginHorizontal: 4,
    flexShrink: 0,
  },
  newEntryButtonContent: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  newEntryIcon: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  newEntryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
});
