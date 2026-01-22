/**
 * Configuration et constantes pour l'authentification et l'application
 */

// ============================================
// STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_EMAIL: 'user_email',
  USER_DATA: 'user_data',
} as const;

// ============================================
// VALIDATION RULES
// ============================================

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  PASSWORD: {
    MIN_LENGTH_LOGIN: 6,
    MIN_LENGTH_REGISTER: 8,
  },
  
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
} as const;

// ============================================
// API ENDPOINTS (Placeholder)
// ============================================

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
    CHANGE_PASSWORD: '/api/user/password',
    DELETE_ACCOUNT: '/api/user/account',
  },
  PASSWORD: {
    FORGOT: '/api/password/forgot',
    RESET: '/api/password/reset',
  },
} as const;

// ============================================
// MESSAGES
// ============================================

export const MESSAGES = {
  VALIDATION: {
    EMAIL_INVALID: 'Veuillez entrer une adresse email valide',
    EMAIL_REQUIRED: 'L\'email est requis',
    PASSWORD_TOO_SHORT: (min: number) => 
      `Le mot de passe doit contenir au moins ${min} caractères`,
    PASSWORDS_NOT_MATCH: 'Les mots de passe ne correspondent pas',
    NAME_REQUIRED: 'Le nom est requis',
  },
  AUTH: {
    LOGIN_SUCCESS: 'Connexion réussie!',
    LOGOUT_SUCCESS: 'Déconnexion réussie',
    REGISTER_SUCCESS: 'Inscription réussie! Bienvenue!',
    PASSWORD_CHANGED: 'Mot de passe changé avec succès!',
    PROFILE_UPDATED: 'Profil mis à jour avec succès!',
  },
  ERROR: {
    GENERIC: 'Une erreur est survenue. Veuillez réessayer.',
    LOGIN_FAILED: 'Connexion échouée. Vérifiez vos identifiants.',
    REGISTER_FAILED: 'Inscription échouée. Veuillez réessayer.',
    NETWORK: 'Erreur réseau. Vérifiez votre connexion.',
  },
} as const;

// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    TERMS: '/terms',
    PRIVACY: '/privacy',
    CONTACT: '/contact',
    PRICING: '/tarifs',
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  PROTECTED: {
    DASHBOARD: '/dashboard',
    ACCOUNT: '/account',
    REPORTS_CREATE: '/reports/create',
  },
} as const;

// ============================================
// USER INTERFACE
// ============================================

export const UI = {
  COLORS: {
    PRIMARY: 'indigo',
    SECONDARY: 'purple',
    SUCCESS: 'green',
    WARNING: 'yellow',
    ERROR: 'red',
  },
  
  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    DESKTOP: 1024,
    WIDE: 1280,
  },
  
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
} as const;

// ============================================
// FEATURE FLAGS
// ============================================

export const FEATURES = {
  ENABLE_OAUTH: true,
  ENABLE_2FA: false,
  ENABLE_MAGIC_LINK: false,
  REQUIRE_EMAIL_VERIFICATION: false,
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Valide une adresse email
 */
export function validateEmail(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email);
}

/**
 * Valide la force d'un mot de passe
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 8) return 'weak';
  if (password.length < 12) return 'medium';
  return 'strong';
}

/**
 * Valide un mot de passe pour le register
 */
export function validatePasswordForRegister(password: string): boolean {
  return password.length >= VALIDATION.PASSWORD.MIN_LENGTH_REGISTER;
}

/**
 * Valide un mot de passe pour le login
 */
export function validatePasswordForLogin(password: string): boolean {
  return password.length >= VALIDATION.PASSWORD.MIN_LENGTH_LOGIN;
}

/**
 * Extrait les initiales d'un nom
 */
export function getInitials(firstName: string, lastName?: string): string {
  let initials = firstName.charAt(0).toUpperCase();
  if (lastName) {
    initials += lastName.charAt(0).toUpperCase();
  }
  return initials;
}

/**
 * Formate un nom pour affichage
 */
export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

/**
 * Obtient le message d'erreur de validation
 */
export function getValidationError(
  field: string,
  error: string
): string {
  const messageKey = `VALIDATION.${error.toUpperCase()}`;
  return `${field}: Erreur de validation`;
}

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

export interface PasswordResetData {
  email?: string;
  code?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  STORAGE_KEYS,
  VALIDATION,
  API_ENDPOINTS,
  MESSAGES,
  ROUTES,
  UI,
  FEATURES,
  validateEmail,
  getPasswordStrength,
  validatePasswordForRegister,
  validatePasswordForLogin,
  getInitials,
  formatFullName,
  getValidationError,
};
