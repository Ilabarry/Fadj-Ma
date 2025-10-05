import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Pill,
} from "lucide-react";
import { medicamentService } from "../services/medicamentService";

function Medicaments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGroupe, setFilterGroupe] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMedicament, setSelectedMedicament] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    dosage: "",
    prix: "",
    groupe: "",
    stock: "",
    images: [],
  });

  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtrer les médicaments
  const filteredMedicaments = useMemo(() => {
    return medicaments.filter(med => {
      const matchesSearch = med.nom?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const matchesFilter = filterGroupe === "" || med.groupe?.toLowerCase().includes(filterGroupe.toLowerCase()) || false;
      return matchesSearch && matchesFilter;
    });
  }, [medicaments, searchQuery, filterGroupe]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicaments = filteredMedicaments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMedicaments.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Réinitialiser la pagination quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterGroupe]);

  // Charger la liste des médicaments depuis API
  const fetchMedicaments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await medicamentService.getAll();
      console.log("Données reçues:", data);
      
      if (data.data) {
        setMedicaments(data.data);
      } else if (Array.isArray(data)) {
        setMedicaments(data);
      } else {
        setMedicaments([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      setError("Erreur lors du chargement des médicaments");
      setMedicaments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicaments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFormSubmitting(true);

    try {
      const form = new FormData();
      
      Object.keys(formData).forEach((key) => {
        if (key !== "images" && formData[key] !== null && formData[key] !== "") {
          form.append(key, formData[key]);
        }
      });

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          form.append("images[]", image);
        });
      }

      await medicamentService.create(form);

      setShowForm(false);
      setFormData({
        nom: "",
        description: "",
        dosage: "",
        prix: "",
        groupe: "",
        stock: "",
        images: [],
      });

      fetchMedicaments();
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      setError(error.message || "Erreur lors de l'ajout du médicament");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleShowDetails = (medicament) => {
    setSelectedMedicament(medicament);
    setCurrentImageIndex(0);
    setShowDetailsModal(true);
  };

  const handlePrevImage = () => {
    if (selectedMedicament?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedMedicament.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedMedicament?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === selectedMedicament.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = 'https://fadj-ma-production.up.railway.app';
    return `${baseUrl}/storage/${imagePath}`;
  };
 

  const selectedFilesText = formData.images.length > 0 
    ? `${formData.images.length} fichier(s) sélectionné(s)`
    : "Aucun fichier sélectionné";

  if (error && medicaments.length === 0) {
    return (
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={fetchMedicaments}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Médicaments ({filteredMedicaments.length})
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Liste des médicaments disponibles à la vente.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center space-x-2 bg-white border px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 w-full sm:w-auto"
        >
          <Plus size={18} />
          <span>Nouveau médicament</span>
        </button>
      </div>

      {error && medicaments.length > 0 && (
        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Recherche et filtre */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 gap-4">
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Rechercher par nom de médicament..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            size={18}
            className="absolute left-3 top-2.5 text-gray-400"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter size={18} className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Filtrer par groupe"
            className="w-full border-2 border-gray-400 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 text-sm sm:text-base"
            value={filterGroupe}
            onChange={(e) => setFilterGroupe(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Chargement des médicaments...
          </div>
        ) : currentMedicaments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {medicaments.length === 0 
              ? "Aucun médicament trouvé" 
              : "Aucun médicament ne correspond aux critères de recherche"
            }
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-gray-700 font-bold text-sm sm:text-base">
                      Nom du médicament
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-gray-700 font-bold text-sm sm:text-base">ID</th>
                    <th className="px-3 sm:px-4 py-3 text-gray-700 font-bold text-sm sm:text-base">Groupe</th>
                    <th className="px-3 sm:px-4 py-3 text-gray-700 font-bold text-sm sm:text-base">Stock</th>
                    <th className="px-3 sm:px-4 py-3 text-gray-700 font-bold text-sm sm:text-base">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMedicaments.map((med) => (
                    <tr
                      key={med.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-3 sm:px-4 py-3 font-medium text-sm sm:text-base">
                        {med.nom || "N/A"}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-sm font-medium">{med.id}</td>
                      <td className="px-3 sm:px-4 py-3 text-sm font-medium">{med.groupe || "N/A"}</td>
                      <td className="px-3 sm:px-4 py-3 text-sm font-medium">{med.stock || 0}</td>
                      <td
                        className="px-3 sm:px-4 py-3 text-blue-600 font-bold cursor-pointer hover:text-blue-800 text-sm"
                        onClick={() => handleShowDetails(med)}
                      >
                        Voir détails »
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 py-3 border-t bg-gray-50 gap-3">
              <p className="text-sm text-gray-700 text-center sm:text-left">
                Affichage de {indexOfFirstItem + 1} à{" "}
                {Math.min(indexOfLastItem, filteredMedicaments.length)} sur{" "}
                {filteredMedicaments.length}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* STRUCTURE PRINCIPALE POUR LE FORMULAIRE  */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-2 sm:p-2 border-b sticky top-0 bg-white">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Nouveau médicament
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              {/* Section Upload images */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ajouter des images
                </label>
                <div className="shadow-lg border-2 border-gray-300 rounded-lg p-2 sm:p-2 text-center cursor-pointer hover:bg-gray-50 transition-colors w-full">
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleInputChange}
                    className="hidden"
                    id="images-upload"
                  />
                  <label htmlFor="images-upload" className="cursor-pointer block">
                    <div className="text-gray-400 mb-3">
                      <Plus size={24} className="sm:w-8 sm:h-8 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Cliquez pour ajouter des images ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-500">
                      Formats supportés: JPG, PNG, WEBP (max 6 images)
                    </p>
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-200 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">
                      {selectedFilesText}
                    </p>
                    <ul className="mt-2 text-xs text-blue-600">
                      {formData.images.map((file, index) => (
                        <li key={index}>• {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Section obligatoire */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  obligatoires
                </h3>
                <p className="text-lg text-gray-600 mb-2">
                  Donnez plus de details possible
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du médicament
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage
                    </label>
                    <input
                      type="text"
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (FCFA)
                    </label>
                    <input
                      type="number"
                      name="prix"
                      value={formData.prix}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Groupe
                    </label>
                    <input
                      type="text"
                      name="groupe"
                      value={formData.groupe}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock initial
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-around space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 lg:px-8 sm:px-6 py-2 font-bold border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-xl xl:text-base"
                  disabled={formSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 bg-blue-300 text-gray-800 rounded-lg hover:bg-blue-300 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STRUCTURE PRINCIPALE POUR LES DÉTAILS  */}
      {showDetailsModal && selectedMedicament && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] mt-20 p-2 md:px-4 lg:px-8 sm:px-12 bg-black bg-opacity-50">
          <div className="bg-gray-100 rounded-lg w-full h-full sm:h-[92vh] sm:max-w-screen-xl xl:max-w-screen-2xl flex flex-col m-0 sm:m-4">
            
            {/* En-tête */}
            <div className="flex items-center justify-between p-2 sm:p-4 border-b bg-gray-50 rounded-t-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                Détails du médicament
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 sm:p-2"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto p-1 sm:p-4 lg:p-6 space-y-6">
              
              {/* ✅ LIGNE 1 : Section image + Section informations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Section image */}
                <div className="bg-white rounded-lg border p-6 flex items-center justify-center">
                  {selectedMedicament.images && selectedMedicament.images.length > 0 ? (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePrevImage}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="w-64 h-64 flex items-center justify-center">
                        <img
                          src={getImageUrl(selectedMedicament.images[currentImageIndex])}
                          alt={selectedMedicament.nom}
                          className="max-w-full max-h-full object-contain rounded"
                        />
                      </div>

                      <button
                        onClick={handleNextImage}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-12">
                      <Pill size={28} className="mx-auto mb-2" />
                      <p className="text-sm">Aucune image disponible</p>
                    </div>
                  )}
                </div>

                {/* Section informations */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-xl font-bold mb-4">{selectedMedicament.nom}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-sm">Composition</p>
                      <p className="text-gray-700">{selectedMedicament.dosage}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-sm">Prix</p>
                      <p className="text-gray-700">{selectedMedicament.prix} FCFA</p>
                    </div>

                    <div>
                      <p className="font-semibold text-sm">Stock</p>
                      <p className="text-gray-700">{selectedMedicament.stock}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-sm">Groupe</p>
                      <p className="text-gray-700">{selectedMedicament.groupe}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-sm">Fabriquant / commerçant</p>
                      <p className="text-gray-700">{selectedMedicament.fabricant || "Non renseigné"}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-sm">Type de consommation</p>
                      <p className="text-gray-700">{selectedMedicament.type_consommation || "Non renseigné"}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-sm">Date d'expiration</p>
                      <p className="text-gray-700">{selectedMedicament.expiration || "Non renseignée"}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/*  Section description */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-semibold mb-2">Description :</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedMedicament.description || "Pas de description disponible."}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Medicaments;