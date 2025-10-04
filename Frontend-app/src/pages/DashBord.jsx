import React, { useEffect, useState } from "react";
import { 
  ChevronsRight,
  ClipboardPlus,
  TriangleAlert,
  ShieldPlus,
  TabletSmartphone
} from "lucide-react";
import { authService } from "../services/authService"; // ✅ Importer le service

function TableauDeBord() {
  const [stats, setStats] = useState({
    medicaments_disponibles: 0,
    medicaments_total: 0,
    groupes_total: 0,
    utilisateurs_total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await authService.getDashboardStats(); // ✅ Utiliser le service
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des stats :", err);
        setError("Impossible de charger les statistiques");
        // Valeurs par défaut en cas d'erreur
        setStats({
          medicaments_disponibles: 0,
          medicaments_total: 0,
          groupes_total: 0,
          utilisateurs_total: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-full bg-gray-100 p-4 sm:p-6 lg:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-gray-100 p-4 sm:p-6 lg:p-6 flex items-center justify-center">
        <div className="text-center">
          <TriangleAlert className="mx-auto text-red-500 mb-4" size={48} />
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-100 p-4 sm:p-6 lg:p-6">
      {/* En-tête */}
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Tableau de bord</h1>
          <p className="text-gray-600 text-sm sm:text-base">Un aperçu rapide des données de votre pharmacie</p>
        </div>
        <div className="flex-shrink-0">
          <button className="w-full sm:w-auto border border-gray-500 py-2 px-4 sm:px-6 rounded-lg bg-white text-sm sm:text-base hover:bg-gray-50">
            Télécharger le rapport
          </button>
        </div>
      </div>

      {/* Première ligne de cartes */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {/* Carte Revenu */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="space-y-2 border-2 border-green-400 rounded-lg">
            <div className="flex items-center justify-center p-2 sm:p-3 text-green-500">
              <ShieldPlus size={32} className="sm:w-10 sm:h-10" />
            </div>
            <h3 className="font-bold text-gray-700 text-center text-lg sm:text-xl">Bien</h3>
            <p className="text-center text-gray-600 text-sm sm:text-base">Statut de l'inventaire</p>
            <button className="flex justify-center items-center w-full bg-green-300 text-gray-600 border border-green-400 py-2 px-1 rounded hover:text-white transition-colors text-sm lg:xs sm:text-base gap-1">
              Afficher le rapport détaillé <ChevronsRight size={16} />
            </button>
          </div>
        </div>       

        {/* Carte Inventaire */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="space-y-2 border-2 border-yellow-400 rounded-lg">
            <div className="flex items-center justify-center p-2 sm:p-3 text-yellow-500">
              <TabletSmartphone size={32} className="sm:w-10 sm:h-10" />
            </div>
            <h3 className="font-bold text-gray-700 text-center text-lg sm:text-xl">4.800.432</h3>
            <p className="text-center text-gray-600 text-sm sm:text-base"><b>revenu:</b> Janvier 2022</p>
            <button className="flex justify-center items-center w-full bg-yellow-300 text-gray-600 border border-yellow-400 py-2 px-1 rounded hover:text-white transition-colors text-sm sm:text-base gap-1">
              Afficher le rapport détaillé <ChevronsRight size={16} />
            </button>
          </div>
        </div>

        {/* Carte Médicaments disponibles */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="space-y-2 border-2 border-blue-400 rounded-lg">
            <div className="flex items-center justify-center p-2 sm:p-3 text-blue-500">
              <ClipboardPlus size={32} className="sm:w-10 sm:h-10" />
            </div>
            <h3 className="font-bold text-gray-700 text-center text-lg sm:text-xl">
              {stats.medicaments_disponibles}
            </h3>
            <p className="text-center text-gray-600 text-sm sm:text-base">Médicaments disponibles</p>
            <button className="flex justify-center items-center w-full bg-blue-300 text-gray-600 border border-blue-400 py-2 px-3 rounded hover:text-white transition-colors text-sm sm:text-base gap-1">
              Visiter l'inventaire <ChevronsRight size={16} />
            </button>
          </div>
        </div>

        {/* Carte Pénurie */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="space-y-2 border-2 border-red-400 rounded-lg">
            <div className="flex items-center justify-center p-2 sm:p-3 text-red-500">
              <TriangleAlert size={32} className="sm:w-10 sm:h-10" />
            </div>
            <h3 className="font-bold text-gray-700 text-center text-lg sm:text-xl">01</h3>
            <p className="text-center text-gray-600 text-sm sm:text-base">Pénurie de médicaments</p>
            <button className="flex justify-center items-center w-full bg-red-300 text-gray-600 border border-red-400 py-2 px-3 rounded hover:text-white transition-colors text-sm sm:text-base gap-1">
              Résoudre maintenant <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Deuxième ligne de cartes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Inventaire */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-400">
          <div className="flex flex-col sm:flex-row sm:justify-between p-4 sm:px-6 gap-2 border-b border-gray-400">
            <h3 className="text-lg font-bold text-gray-800">Inventaire</h3>
            <p className="text-sm text-gray-600 sm:text-right">Allez dans configuration</p>
          </div> 
          <div className="flex flex-col sm:flex-row justify-between p-4 sm:p-6 gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {stats.medicaments_total}
              </h3>
              <p className="text-sm text-gray-600">Nombre total de médicaments</p>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {stats.groupes_total}
              </h3>
              <p className="text-sm text-gray-600">Groupes de médicaments</p>
            </div>
          </div>
        </div>

        {/* Rapport rapide */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-400">
          <div className="flex flex-col sm:flex-row sm:justify-between p-4 sm:px-6 gap-2 border-b border-gray-400">
            <h3 className="text-lg font-bold text-gray-800">Rapport rapide</h3>
            <p className="text-sm text-gray-600 sm:text-right">Janvier 2022</p>
          </div> 
          <div className="flex flex-col sm:flex-row justify-between p-4 sm:p-6 gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">70 856</h3>
              <p className="text-sm text-gray-600">Quantité de médicaments vendus</p>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">5 288</h3>
              <p className="text-sm text-gray-600">Factures générées</p>
            </div>
          </div>
        </div>
      </div>

      {/* Troisième ligne */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Ma pharmacie */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-400">
          <div className="flex flex-col sm:flex-row sm:justify-between p-4 sm:px-6 gap-2 border-b border-gray-400">
            <h3 className="text-lg font-bold text-gray-800">Ma pharmacie</h3>
            <p className="text-sm text-gray-600 sm:text-right">Accédez à la gestion des utilisateurs</p>
          </div> 
          <div className="flex flex-col sm:flex-row justify-between p-4 sm:p-6 gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">04</h3>
              <p className="text-sm text-gray-600">Nombre total de fournisseurs</p>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {stats.utilisateurs_total}
              </h3>
              <p className="text-sm text-gray-600">Nombre total d'utilisateurs</p>
            </div>
          </div>
        </div>

        {/* Clients */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-400">
          <div className="flex flex-col sm:flex-row sm:justify-between p-4 sm:px-6 gap-2 border-b border-gray-400">
            <h3 className="text-lg font-bold text-gray-800">Clients</h3>
            <p className="text-sm text-gray-600 sm:text-right">Allez à la page clients</p>
          </div> 
          <div className="flex flex-col sm:flex-row justify-between p-4 sm:p-6 gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">845</h3>
              <p className="text-sm text-gray-600">Nombre total de clients</p>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Adalimumab</h3>
              <p className="text-sm text-gray-600">Article fréquemment acheté</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableauDeBord;