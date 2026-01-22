export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Politique de confidentialité
        </h1>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Collecte des données
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Nous collectons les informations que vous fournissez directement, telles que votre nom, votre adresse email et les données d'utilisation du service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Utilisation des données
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Vos données sont utilisées pour:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mt-2">
              <li>Fournir et améliorer nos services</li>
              <li>Communiquer avec vous</li>
              <li>Analyser les tendances d'utilisation</li>
              <li>Respecter les obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Partage des données
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Nous ne partageons vos données personnelles que lorsque cela est nécessaire pour fournir nos services ou lorsque la loi l'exige.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Sécurité
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Nous utilisons des mesures de sécurité appropriées pour protéger vos données contre l'accès non autorisé.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Vos droits
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Vous avez le droit d'accéder, de rectifier ou de supprimer vos données personnelles. Contactez-nous pour exercer ces droits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez contrôler les cookies via les paramètres de votre navigateur.
            </p>
          </section>
        </div>

        <div className="mt-12 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dernière mise à jour: {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </main>
  );
}
