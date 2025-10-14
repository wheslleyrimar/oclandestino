const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Configuração específica para web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configuração para resolver módulos específicos do React Native Web
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native': 'react-native-web',
};

// Configuração para resolver problemas de compatibilidade com módulos nativos
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = withNativeWind(config);
