# 🚗 CLANS - Gestão Financeira para Motoristas

Uma aplicação completa para gestão financeira de motoristas de aplicativo, desenvolvida com React Native e Expo.

## 📱 Plataformas Suportadas

- **iOS** - Versão completa com todas as funcionalidades
- **Android** - Versão completa com todas as funcionalidades  
- **Web** - Versão experimental com funcionalidades básicas

## ✨ Funcionalidades

### 📊 Dashboard Inteligente
- Métricas em tempo real
- Gráficos de receitas e despesas
- Indicadores de performance
- Comparativos mensais

### 💰 Controle Financeiro
- Registro de receitas de corridas
- Controle de despesas (combustível, manutenção, etc.)
- Categorização automática
- Relatórios detalhados

### 🎯 Metas e Objetivos
- Definição de metas mensais
- Acompanhamento de progresso
- Alertas de performance
- Histórico de conquistas

### 🌙 Interface Adaptável
- Tema claro e escuro
- Suporte a múltiplos idiomas (PT-BR, EN-US, ES-ES)
- Interface responsiva
- Experiência otimizada

### 🔐 Autenticação e Segurança
- Login seguro
- Perfil do usuário
- Sincronização de dados
- Backup automático

### 💎 Recursos Premium (iOS)
- Exportação de dados
- Métricas avançadas
- Múltiplas metas
- Sincronização na nuvem

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **NativeWind** - Estilização com Tailwind CSS
- **React Navigation** - Navegação entre telas
- **AsyncStorage** - Armazenamento local
- **Axios** - Requisições HTTP
- **React Native Chart Kit** - Gráficos e visualizações
- **React Native IAP** - Compras in-app (iOS)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Expo CLI
- iOS Simulator (para iOS)
- Android Studio (para Android)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/wheslley/clans.git
cd clans
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute a aplicação**

Para iOS:
```bash
npm run ios
```

Para Android:
```bash
npm run android
```

Para Web:
```bash
npm run web
```

Para desenvolvimento geral:
```bash
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── CustomAlert.tsx
│   ├── CustomConfirm.tsx
│   ├── ExpenseForm.tsx
│   ├── RevenueForm.tsx
│   └── ...
├── context/             # Contextos React
│   ├── AuthContext.tsx
│   ├── FinanceContext.tsx
│   ├── ThemeContext.tsx
│   └── ...
├── screens/             # Telas da aplicação
│   ├── AuthScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── TransactionsScreen.tsx
│   └── ...
├── services/            # Serviços e APIs
│   ├── apiService.ts
│   ├── authService.ts
│   └── subscriptionService.ts
├── navigation/          # Configuração de navegação
│   └── AppNavigator.tsx
├── types/              # Definições de tipos
│   └── index.ts
├── utils/              # Utilitários
│   ├── confirmDialog.ts
│   └── indicatorsCalculator.ts
└── i18n/               # Internacionalização
    ├── index.ts
    └── locales/
        ├── pt-BR.ts
        ├── en-US.ts
        └── es-ES.ts
```

## 🎨 Temas e Personalização

A aplicação suporta múltiplos temas:
- **Claro** - Interface tradicional
- **Escuro** - Modo noturno
- **Automático** - Segue as configurações do sistema

## 🌍 Internacionalização

Suporte a múltiplos idiomas:
- 🇧🇷 Português (Brasil)
- 🇺🇸 Inglês (Estados Unidos)
- 🇪🇸 Espanhol (Espanha)

## 📊 Funcionalidades por Plataforma

| Funcionalidade | iOS | Android | Web |
|---------------|-----|---------|-----|
| Dashboard | ✅ | ✅ | ✅ |
| Transações | ✅ | ✅ | ✅ |
| Relatórios | ✅ | ✅ | ✅ |
| Temas | ✅ | ✅ | ✅ |
| Compras In-App | ✅ | ❌ | ❌ |
| Exportação | ✅ | ❌ | ❌ |


### Configuração do Expo
O arquivo `app.json` contém todas as configurações do Expo:
- Bundle identifier
- Permissões
- Plugins
- Configurações específicas por plataforma

## 📱 Build e Deploy

### Build para Produção

iOS:
```bash
expo build:ios
```

Android:
```bash
expo build:android
```

### Deploy para App Stores
1. Configure as credenciais no Expo
2. Execute o build de produção
3. Baixe e envie para as stores

## 📞 Suporte

Para suporte e dúvidas:
- 🐛 Issues: [GitHub Issues](https://github.com/wheslley/clans/issues)

---

**Desenvolvido com ❤️ para motoristas de aplicativos**