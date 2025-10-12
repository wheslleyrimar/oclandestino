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
import NewEntryModal from './NewEntryModal';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const { state: themeState } = useTheme();
  const getTabIcon = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case 'Overview':
        return '🏠';
      case 'Transactions':
        return '➕'; // Será substituído pelo botão especial
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
      case 'Transactions':
        return 'Novo';
      case 'Configuration':
        return 'Config';
      default:
        return routeName;
    }
  };

  const styles = createStyles(themeState.colors);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
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

          // Botão especial para "Novo"
          if (route.name === 'Transactions') {
            return (
              <TouchableOpacity
                key={index}
                style={styles.newButton}
                onPress={() => setShowNewEntryModal(true)}
                activeOpacity={0.8}
              >
                <View style={styles.newButtonContent}>
                  <Text style={styles.newButtonIcon}>➕</Text>
                </View>
                <Text style={styles.newButtonLabel}>Novo</Text>
              </TouchableOpacity>
            );
          }

          // Botões normais
          return (
            <TouchableOpacity
              key={index}
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
          );
        })}
      </View>
      
      {/* Modal */}
      <NewEntryModal
        isVisible={showNewEntryModal}
        onClose={() => setShowNewEntryModal(false)}
      />
    </View>
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
    marginHorizontal: 20,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
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
    paddingHorizontal: 16,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
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
  newButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  newButtonContent: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 4,
  },
  newButtonIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  newButtonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.success,
  },
});
