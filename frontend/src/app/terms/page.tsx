export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Conditions d'utilisation
        </h1>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Acceptation des conditions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              En utilisant GEOmetrics, vous acceptez ces conditions d'utilisation et notre politique de confidentialité.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Licence d'utilisation
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              GEOmetrics vous accorde une licence limitée, non-exclusive et révocable pour utiliser notre service à titre personnel ou professionnel.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Restrictions
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Vous ne devez pas utiliser le service à des fins illégales</li>
              <li>Vous ne devez pas contourner les mesures de sécurité</li>
              <li>Vous ne devez pas accéder à d'autres comptes sans autorisation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Limitation de responsabilité
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              GEOmetrics n'est pas responsable des dommages indirects, accessoires ou consécutifs découlant de l'utilisation du service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Modifications
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront effectives dès leur publication.
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
