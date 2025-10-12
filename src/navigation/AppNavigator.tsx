import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import OverviewScreen from '../screens/OverviewScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import ConfigurationScreen from '../screens/ConfigurationScreen';

// Import custom tab bar
import { CustomTabBar } from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Tab.Screen 
            name="Overview" 
            component={OverviewScreen} 
            options={{ tabBarLabel: 'Painel' }}
          />
          <Tab.Screen 
            name="Transactions" 
            component={TransactionsScreen} 
            options={{ tabBarLabel: 'Novo' }}
          />
          <Tab.Screen 
            name="Configuration" 
            component={ConfigurationScreen} 
            options={{ tabBarLabel: 'Config' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
