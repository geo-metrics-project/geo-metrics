'use client';

import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const router = useRouter();

  const handleBlur = (field: 'email' | 'password') => {
    setTouched({ ...touched, [field]: true });
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }
    if (!password || password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    try {
      // Simuler la connexion - à remplacer par l'appel API Kratos
      localStorage.setItem('auth_token', 'fake_token_123');
      localStorage.setItem('user_email', email);

      // Redirect vers le dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailValid = email === '' ? null : validateEmail(email);
  const isPasswordValid = password === '' ? null : password.length >= 6;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded px-2 py-1"
          aria-label="Retour à l'accueil"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        {/* Card Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Connexion
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Accédez à votre compte GEOmetrics
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm"
            >
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Adresse email <span className="text-red-500" aria-label="requis">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="vous@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white ${
                    isEmailValid === false && touched.email
                      ? 'border-red-500 focus:ring-red-500'
                      : isEmailValid === true
                      ? 'border-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={isEmailValid === false && touched.email ? 'true' : 'false'}
                  aria-describedby={isEmailValid === false && touched.email ? 'email-error' : undefined}
                />
              </div>
              {isEmailValid === false && touched.email && (
                <p id="email-error" className="text-sm text-red-600 dark:text-red-400">
                  Veuillez entrer une adresse email valide
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Mot de passe <span className="text-red-500" aria-label="requis">*</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1"
                >
                  Mot de passe oublié?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white ${
                    isPasswordValid === false && touched.password
                      ? 'border-red-500 focus:ring-red-500'
                      : isPasswordValid === true
                      ? 'border-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={isPasswordValid === false && touched.password ? 'true' : 'false'}
                  aria-describedby={isPasswordValid === false && touched.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1 transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {isPasswordValid === false && touched.password && (
                <p id="password-error" className="text-sm text-red-600 dark:text-red-400">
                  Le mot de passe doit contenir au moins 6 caractères
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isEmailValid === false || isPasswordValid === false}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center gap-2"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" aria-hidden="true" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Ou</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" aria-hidden="true" />
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              className="py-2.5 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Se connecter avec Google"
            >
              Google
            </button>
            <button
              type="button"
              className="py-2.5 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Se connecter avec GitHub"
            >
              GitHub
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Pas encore de compte?{' '}
            <Link
              href="/auth/register"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1"
            >
              S'inscrire
            </Link>
          </p>
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>🔒 Vos données sont protégées par le chiffrement SSL</p>
        </div>
      </div>
    </main>
  );
}
