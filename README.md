# KLANS - Gestão Financeira

Aplicativo de gestão financeira para motoristas de aplicativo, desenvolvido com Expo/React Native para funcionar em Web, Android e iOS.

## 🚀 Tecnologias

- **Expo** - Framework para desenvolvimento multiplataforma
- **React Native** - Framework para desenvolvimento mobile
- **TypeScript** - Linguagem de programação
- **React Navigation** - Navegação entre telas
- **NativeWind** - Estilização com Tailwind CSS
- **React Context** - Gerenciamento de estado

## 📱 Funcionalidades

- ✅ Registro de receitas por plataforma (Uber, 99, inDrive, etc.)
- ✅ Controle de gastos por categoria
- ✅ Dashboard com métricas detalhadas
- ✅ Metas mensais com acompanhamento
- ✅ Filtros avançados por período e categoria
- ✅ Cálculos automáticos de lucro líquido
- ✅ Métricas de performance (ganho por hora, por km, por corrida)
- ✅ Interface responsiva para mobile e web
- ✅ Modal de cadastro progressivo com 6 etapas
- ✅ Sugestões clicáveis para preenchimento rápido
- ✅ Navegação por etapas com indicadores de progresso

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd klans
```

2. Instale as dependências:
```bash
npm install
```

3. Configure os assets (ícones):
   - Adicione os ícones necessários na pasta `assets/`
   - Ícones necessários: icon.png, adaptive-icon.png, splash-icon.png, favicon.png

## 🚀 Executando o Projeto

### Web
```bash
npm run web
```

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Desenvolvimento
```bash
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── CustomTabBar.tsx
│   ├── ExpenseForm.tsx
│   ├── FilterBar.tsx
│   ├── MetricsGrid.tsx
│   ├── MonthlyGoalCard.tsx
│   ├── NewEntryModal.tsx
│   ├── PeriodTabs.tsx
│   ├── RevenueForm.tsx
│   ├── StatCard.tsx
│   ├── TransactionCard.tsx
│   └── WorkEntryModal.tsx
├── screens/             # Telas principais
│   ├── DashboardScreen.tsx
│   ├── OverviewScreen.tsx
│   └── TransactionsScreen.tsx
├── navigation/          # Configuração de navegação
│   └── AppNavigator.tsx
├── context/            # Gerenciamento de estado
│   └── FinanceContext.tsx
├── types/              # Definições de tipos
│   └── index.ts
└── data/               # Dados mock
    └── mockData.ts
```

## 🎨 Design System

O aplicativo utiliza um design system consistente com:

- **Cores primárias**: Azul (#0ea5e9), Verde (#22c55e), Vermelho (#ef4444)
- **Tipografia**: Sistema nativo com pesos variados
- **Espaçamento**: Grid de 4px
- **Bordas**: Raios arredondados de 8px, 12px, 16px
- **Sombras**: Elevações sutis para hierarquia visual

## 📊 Métricas Calculadas

O aplicativo calcula automaticamente:

- **Receita Total**: Soma de todas as receitas
- **Gastos Totais**: Soma de todos os gastos
- **Lucro Líquido**: Receita - Gastos
- **Ganho por Hora**: Receita ÷ Horas trabalhadas
- **Ganho por KM**: Receita ÷ Quilômetros rodados
- **Ganho por Corrida**: Receita ÷ Número de corridas
- **Dias Trabalhados**: Contagem de dias únicos com receitas

## 🔧 Configuração de Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI
- Para desenvolvimento iOS: Xcode
- Para desenvolvimento Android: Android Studio

### Variáveis de Ambiente

Não há variáveis de ambiente necessárias para o funcionamento básico.

## 📱 Plataformas Suportadas

- ✅ **Web**: Funciona em qualquer navegador moderno
- ✅ **Android**: API 21+ (Android 5.0+)
- ✅ **iOS**: iOS 11+

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 🆕 Funcionalidades Recentes

### Modal de Cadastro Progressivo
- **6 etapas**: Receita Uber, Receita 99, Outros Apps, Quilometragem, Horas Trabalhadas, Combustível
- **Navegação intuitiva**: Botões Avançar, Voltar e Pular
- **Indicadores visuais**: Barra de progresso e círculos numerados
- **Sugestões clicáveis**: Valores comuns para preenchimento rápido
- **Interface responsiva**: Otimizada para dispositivos móveis

### Sugestões Inteligentes
- **Valores de corrida**: Faixas de preço por tipo de corrida
- **Distâncias comuns**: Jornadas típicas de trabalho
- **Estimativas de combustível**: Cálculos baseados em consumo médio
- **Jornadas padrão**: Horários comuns de trabalho

## 🐛 Problemas Conhecidos

- Os ícones de assets precisam ser adicionados manualmente
- Gráficos avançados podem ser implementados futuramente
- Sincronização com nuvem não está implementada

## 🚀 Próximas Funcionalidades

- [ ] Backup automático na nuvem
- [ ] Relatórios em PDF
- [ ] Notificações push
- [ ] Modo escuro
- [ ] Integração com APIs das plataformas
- [ ] Gráficos interativos avançados
- [ ] Validação de formulários
- [ ] Histórico de sugestões personalizadas