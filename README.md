# 🚗 KLANS - Gestão Financeira para Motoristas

![KLANS Logo](assets/icon.png)

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
git clone https://github.com/wheslley/oclandestino.git
cd oclandestino
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

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
API_BASE_URL=https://api.klans.com
API_KEY=your_api_key_here
```

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

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- 📧 Email: suporte@klans.com
- 🐛 Issues: [GitHub Issues](https://github.com/wheslley/oclandestino/issues)
- 📖 Documentação: [Wiki do Projeto](https://github.com/wheslley/oclandestino/wiki)

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] Sincronização com Google Drive
- [ ] Integração com APIs de combustível
- [ ] Relatórios fiscais automáticos
- [ ] Modo offline completo
- [ ] Widgets para tela inicial
- [ ] Notificações push
- [ ] Backup automático na nuvem

### Melhorias Planejadas
- [ ] Performance otimizada
- [ ] Novos tipos de gráficos
- [ ] Filtros avançados
- [ ] Exportação em PDF
- [ ] Integração com contadores de quilometragem

---

**Desenvolvido com ❤️ para motoristas de aplicativo**