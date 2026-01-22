/**
 * Custom React Hooks pour l'authentification et l'application
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_KEYS, ROUTES } from './config';

// ============================================
// useAuth - Hook de gestion de l'authentification
// ============================================

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UseAuthReturn {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (userData: User & { password: string }) => void;
  updateUser: (userData: Partial<User>) => void;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification au montage
  useEffect(() => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) 
      : null;

    if (token) {
      setIsLoggedIn(true);
      
      // Charger les données utilisateur
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Erreur parsing user data:', e);
        }
      }
    }

    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    // Simuler l'authentification
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'fake_token_123');
    localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
    
    setIsLoggedIn(true);
    router.push(ROUTES.PROTECTED.DASHBOARD);
  };

  const register = (userData: User & { password: string }) => {
    // Simuler l'enregistrement
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'fake_token_123');
    localStorage.setItem(STORAGE_KEYS.USER_EMAIL, userData.email);
    localStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      })
    );

    setIsLoggedIn(true);
    setUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    });

    router.push(ROUTES.PROTECTED.DASHBOARD);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);

    setIsLoggedIn(false);
    setUser(null);
    router.push(ROUTES.PUBLIC.HOME);
  };

  const updateUser = (userData: Partial<User>) => {
    const updated = { ...user, ...userData };
    setUser(updated as User);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updated));
  };

  return {
    isLoggedIn,
    user,
    isLoading,
    login,
    logout,
    register,
    updateUser,
  };
}

// ============================================
// useProtectedRoute - Hook pour protéger les routes
// ============================================

export function useProtectedRoute(): boolean {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      : null;

    if (!token) {
      router.push(ROUTES.AUTH.LOGIN);
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  return isAuthorized;
}

// ============================================
// useForm - Hook pour la gestion des formulaires
// ============================================

export interface FormField {
  value: string;
  touched: boolean;
  error?: string;
}

export interface FormState {
  [key: string]: FormField;
}

export interface UseFormReturn {
  values: { [key: string]: string };
  touched: { [key: string]: boolean };
  errors: { [key: string]: string };
  isSubmitting: boolean;
  handleChange: (name: string, value: string) => void;
  handleBlur: (name: string) => void;
  handleSubmit: (onSubmit: () => Promise<void>) => (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFieldError: (name: string, error: string) => void;
}

export function useForm(
  initialValues: { [key: string]: string },
  onSubmit?: () => Promise<void>
): UseFormReturn {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name: string, value: string) => {
    setValues({ ...values, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (name: string) => {
    setTouched({ ...touched, [name]: true });
  };

  const handleSubmit = (submitFn: () => Promise<void>) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        await submitFn();
      } catch (error) {
        console.error('Erreur lors de la soumission:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  };

  const resetForm = () => {
    setValues(initialValues);
    setTouched({});
    setErrors({});
    setIsSubmitting(false);
  };

  const setFieldError = (name: string, error: string) => {
    setErrors({ ...errors, [name]: error });
  };

  return {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldError,
  };
}

// ============================================
// useLocalStorage - Hook pour localStorage
// ============================================

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Lire la valeur
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Erreur lors de la lecture de ${key}:`, error);
    }
  }, [key]);

  // Écrire la valeur
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Erreur lors de l'écriture de ${key}:`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// ============================================
// useDebounce - Hook pour débounce
// ============================================

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// useAsync - Hook pour les appels asynchrones
// ============================================

export interface UseAsyncReturn<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
): UseAsyncReturn<T> {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = async () => {
    setStatus('pending');
    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setStatus('error');
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return {
    data,
    error,
    isLoading: status === 'pending',
  };
}

// ============================================
// useMounted - Hook pour détecter le montage
// ============================================

export function useMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}

// ============================================
// usePrevious - Hook pour la valeur précédente
// ============================================

export function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// ============================================
// Export par défaut
// ============================================

export default {
  useAuth,
  useProtectedRoute,
  useForm,
  useLocalStorage,
  useDebounce,
  useAsync,
  useMounted,
  usePrevious,
};

// Import React pour usePrevious
import React from 'react';
