'use client';

import { Mail, Phone, MapPin, Send, Loader } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setError('Tous les champs sont requis');
      return;
    }

    setIsLoading(true);

    try {
      // Simuler l'envoi du message
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Une erreur est survenue lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Nous contacter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Vous avez une question? Nous sommes là pour vous aider.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Contact Info Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 focus:ring-2 focus:ring-indigo-500">
            <div className="flex items-center gap-4 mb-4">
              <Mail className="w-8 h-8 text-indigo-600" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Email
              </h3>
            </div>
            <a
              href="mailto:contact@geometrics.fr"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
            >
              contact@geometrics.fr
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 focus:ring-2 focus:ring-indigo-500">
            <div className="flex items-center gap-4 mb-4">
              <Phone className="w-8 h-8 text-indigo-600" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Téléphone
              </h3>
            </div>
            <a
              href="tel:+33123456789"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
            >
              +33 1 23 45 67 89
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 focus:ring-2 focus:ring-indigo-500">
            <div className="flex items-center gap-4 mb-4">
              <MapPin className="w-8 h-8 text-indigo-600" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Localisation
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Paris, France
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
          {submitted ? (
            <div
              role="alert"
              className="text-center py-12"
            >
              <div className="inline-block p-4 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                <svg
                  className="w-12 h-12 text-green-600 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Merci pour votre message!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div
                  role="alert"
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm"
                >
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nom complet <span className="text-red-500" aria-label="requis">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Adresse email <span className="text-red-500" aria-label="requis">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vous@example.com"
                    className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Subject Field */}
              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Sujet <span className="text-red-500" aria-label="requis">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Comment pouvons-nous vous aider?"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Message <span className="text-red-500" aria-label="requis">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Décrivez votre message en détail..."
                  rows={6}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center gap-2"
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" aria-hidden="true" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Questions fréquemment posées
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: 'Comment puis-je créer un compte?',
                answer: 'Cliquez sur "S\'inscrire" dans le coin supérieur droit et remplissez le formulaire d\'enregistrement.',
              },
              {
                question: 'Quel est le prix de l\'abonnement?',
                answer: 'Consultez notre page Tarifs pour voir tous les plans disponibles et choisir celui qui vous convient.',
              },
              {
                question: 'Comment puis-je modifier mon profil?',
                answer: 'Connectez-vous et accédez à la section "Paramètres" pour modifier vos informations.',
              },
              {
                question: 'Comment puis-je résilier mon abonnement?',
                answer: 'Vous pouvez résilier votre abonnement à tout moment depuis votre tableau de bord.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
