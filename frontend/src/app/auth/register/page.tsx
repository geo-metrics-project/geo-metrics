'use client';

import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'Le prénom est requis';
    if (!formData.lastName.trim()) return 'Le nom est requis';
    if (!formData.email || !validateEmail(formData.email)) {
      return 'Veuillez entrer une adresse email valide';
    }
    if (!formData.password || formData.password.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Les mots de passe ne correspondent pas';
    }
    if (!agreedToTerms) {
      return 'Vous devez accepter les conditions d\'utilisation';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Simuler l'enregistrement - à remplacer par l'appel API Kratos
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };

      localStorage.setItem('auth_token', 'fake_token_123');
      localStorage.setItem('user_data', JSON.stringify(userData));

      // Redirect vers le dashboard ou une page de confirmation
      router.push('/dashboard');
    } catch (err) {
      setError('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
  const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 6 ? 'medium' : 'weak';

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
              S'inscrire
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Créez votre compte GEOmetrics gratuit
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 dark:text-white">
                  Prénom <span className="text-red-500" aria-label="requis">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('firstName')}
                  placeholder="Jean"
                  className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white ${
                    !formData.firstName && touched.firstName
                      ? 'border-red-500'
                      : formData.firstName
                      ? 'border-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!formData.firstName && touched.firstName ? 'true' : 'false'}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 dark:text-white">
                  Nom <span className="text-red-500" aria-label="requis">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('lastName')}
                  placeholder="Dupont"
                  className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white ${
                    !formData.lastName && touched.lastName
                      ? 'border-red-500'
                      : formData.lastName
                      ? 'border-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!formData.lastName && touched.lastName ? 'true' : 'false'}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">
                Adresse email <span className="text-red-500" aria-label="requis">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="vous@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white ${
                    formData.email && !validateEmail(formData.email)
                      ? 'border-red-500'
                      : validateEmail(formData.email)
                      ? 'border-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={formData.email && !validateEmail(formData.email) ? 'true' : 'false'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">
                Mot de passe <span className="text-red-500" aria-label="requis">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white ${
                    formData.password && formData.password.length < 8
                      ? 'border-red-500'
                      : formData.password.length >= 8
                      ? 'border-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={formData.password && formData.password.length < 8 ? 'true' : 'false'}
                  aria-describedby="password-strength"
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
              <div id="password-strength" className="flex items-center gap-2 mt-2">
                <div className="flex gap-1 flex-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i === 0 && formData.password.length >= 6
                          ? 'bg-green-500'
                          : i === 1 && formData.password.length >= 12
                          ? 'bg-blue-500'
                          : i === 2 && formData.password.length >= 16
                          ? 'bg-purple-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {formData.password.length === 0
                    ? 'Aucun'
                    : passwordStrength === 'weak'
                    ? 'Faible'
                    : passwordStrength === 'medium'
                    ? 'Moyen'
                    : 'Fort'}
                </span>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 dark:text-white">
                Confirmer le mot de passe <span className="text-red-500" aria-label="requis">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white ${
                    formData.confirmPassword && !passwordsMatch
                      ? 'border-red-500'
                      : passwordsMatch
                      ? 'border-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={formData.confirmPassword && !passwordsMatch ? 'true' : 'false'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1 transition-colors"
                  aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 py-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
                aria-required="true"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                J'accepte les{' '}
                <Link
                  href="/terms"
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1"
                >
                  conditions d'utilisation
                </Link>
                {' '}et la{' '}
                <Link
                  href="/privacy"
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1"
                >
                  politique de confidentialité
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center gap-2"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                'S\'inscrire'
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
              aria-label="S'inscrire avec Google"
            >
              Google
            </button>
            <button
              type="button"
              className="py-2.5 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="S'inscrire avec GitHub"
            >
              GitHub
            </button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Vous avez déjà un compte?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1"
            >
              Se connecter
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
