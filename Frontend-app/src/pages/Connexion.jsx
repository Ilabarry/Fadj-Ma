import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { CheckCircle, X } from "lucide-react";

function Connexion() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.token);
      
      // Afficher le modal de succès
      setShowSuccessModal(true);
      
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="px-4 py-6">
      <div className="max-w-md mx-auto bg-white rounded-xl p-4 sm:p-6 lg:p-8 my-4 sm:my-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          Connexion
        </h1>

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm sm:text-base block font-bold mb-2 text-gray-700">
              Adresse e-mail
            </label>
            <input
              type="email"
              name="email"
              placeholder="votre@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="text-sm sm:text-base block font-bold mb-2 text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              placeholder="Votre mot de passe"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent text-sm sm:text-base"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-300 text-gray-800 py-3 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 disabled:opacity-50 text-lg font-bold sm:text-base"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>

      {/* Modal de succès */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
                <CheckCircle className="text-green-500 mr-2 sm:w-6 sm:h-6" size={20} />
                Connexion réussie !
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="text-center py-2 sm:py-4">
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Vous êtes maintenant connecté à votre compte.
              </p>
              
              <div className="space-y-2 sm:space-y-3">
                <Link
                  to="/mes-medicaments"
                  onClick={handleCloseModal}
                  className="w-full bg-blue-400 text-gray-800 font-semibold py-2 sm:py-3 px-4 sm:px-6 border-2 border-gray-400 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors duration-200 block text-center text-sm sm:text-base"
                >
                  Accéder à mes médicaments
                </Link>
                
                <button
                  onClick={handleCloseModal}
                  className="w-full border border-gray-400 text-gray-700 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 text-sm sm:text-base"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Connexion;