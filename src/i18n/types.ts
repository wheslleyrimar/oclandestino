export type SupportedLanguage = 'pt-BR' | 'en-US' | 'es-ES';

export interface TranslationKeys {
  // Auth Screen
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    loginButton: string;
    registerButton: string;
    loginSuccess: string;
    loginError: string;
    registerSuccess: string;
    registerError: string;
    emailRequired: string;
    passwordRequired: string;
    passwordMinLength: string;
    passwordsDoNotMatch: string;
    invalidEmail: string;
    fullName: string;
    phone: string;
    license: string;
    vehicleModel: string;
    vehiclePlate: string;
    nameRequired: string;
    nameMinLength: string;
    phoneRequired: string;
    licenseRequired: string;
    licenseMinLength: string;
    vehicleModelRequired: string;
    vehiclePlateRequired: string;
  };

  // Navigation
  navigation: {
    overview: string;
    dashboard: string;
    transactions: string;
    configuration: string;
  };

  // Overview Screen
  overview: {
    title: string;
    welcomeMessage: string;
    daily: string;
    weekly: string;
    monthly: string;
    totalRevenue: string;
    totalExpenses: string;
    netProfit: string;
    averagePerHour: string;
    averagePerTrip: string;
    averagePerKm: string;
    totalHours: string;
    totalTrips: string;
    totalKm: string;
    workingDays: string;
    monthlyGoal: string;
    averageHours: string;
  };

  // Dashboard Screen
  dashboard: {
    title: string;
    totalRevenue: string;
    netProfit: string;
    revenueChart: string;
    expenseChart: string;
    performanceChart: string;
    dailyProfit: string;
    revenueByPlatform: string;
    expensesByCategory: string;
    averageEarningsPerHour: string;
    averageEarningsPerKm: string;
    averageEarningsPerTrip: string;
    totalHoursWorked: string;
    totalKilometersRidden: string;
    totalTripsCount: string;
    workingDaysCount: string;
  };

  // Transactions Screen
  transactions: {
    title: string;
    subtitle: string;
    addNewEntry: string;
    revenue: string;
    expense: string;
    filterByPeriod: string;
    filterByCategory: string;
    allCategories: string;
    allPeriods: string;
    noTransactions: string;
    loadingTransactions: string;
    all: string;
  };

  // Configuration Screen
  configuration: {
    title: string;
    profile: string;
    goals: string;
    preferences: string;
    profileDescription: string;
    goalsDescription: string;
    preferencesDescription: string;
    personalInfo: string;
    vehicleInfo: string;
    phone: string;
    license: string;
    vehicleModel: string;
    vehiclePlate: string;
    performanceGoals: string;
    earningsGoals: string;
    workGoals: string;
    monthlyEarningsGoal: string;
    dailyTripsGoal: string;
    weeklyHoursGoal: string;
    monthlyHoursGoal: string;
    averageEarningsPerHourGoal: string;
    averageEarningsPerTripGoal: string;
    workingDaysPerWeekGoal: string;
    appSettings: string;
    language: string;
    theme: string;
    currency: string;
    notifications: string;
    notificationsDescription: string;
    earningsNotifications: string;
    goalsNotifications: string;
    remindersNotifications: string;
    promotionsNotifications: string;
    logout: string;
    logoutConfirm: string;
    logoutConfirmMessage: string;
    cancel: string;
    confirm: string;
  };

  // Preferences Modal
  preferencesModal: {
    title: string;
    language: string;
    theme: string;
    currency: string;
    notifications: string;
    save: string;
    cancel: string;
    light: string;
    dark: string;
    auto: string;
    system: string;
    real: string;
    dollar: string;
    euro: string;
    portuguese: string;
    english: string;
    spanish: string;
  };

  // New Entry Modal
  newEntryModal: {
    title: string;
    uberRevenue: string;
    ninetyNineRevenue: string;
    otherAppsRevenue: string;
    mileage: string;
    workHours: string;
    fuelExpense: string;
    step: string;
    of: string;
    next: string;
    previous: string;
    finish: string;
    cancel: string;
    valueReceived: string;
    numberOfRides: string;
    appName: string;
    kilometers: string;
    hours: string;
    fuelValue: string;
    commonValues: string;
    shortRide: string;
    mediumRide: string;
    longRide: string;
    averagePerRide: string;
    summary: string;
    totalRevenue: string;
    totalExpenses: string;
    netProfit: string;
    success: string;
    entryAddedSuccessfully: string;
    error: string;
    failedToAddEntry: string;
  };

  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    confirm: string;
    yes: string;
    no: string;
    ok: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    finish: string;
    retry: string;
    refresh: string;
    search: string;
    filter: string;
    sort: string;
    select: string;
    all: string;
    none: string;
    today: string;
    yesterday: string;
    thisWeek: string;
    lastWeek: string;
    thisMonth: string;
    lastMonth: string;
    thisYear: string;
    lastYear: string;
  };

  // Currency and formatting
  currency: {
    real: string;
    dollar: string;
    euro: string;
    symbol: {
      BRL: string;
      USD: string;
      EUR: string;
    };
  };

  // Date and time
  dateTime: {
    formats: {
      date: string;
      time: string;
      datetime: string;
    };
    periods: {
      day: string;
      week: string;
      month: string;
      year: string;
    };
  };
}

export interface Translations {
  'pt-BR': TranslationKeys;
  'en-US': TranslationKeys;
  'es-ES': TranslationKeys;
}
