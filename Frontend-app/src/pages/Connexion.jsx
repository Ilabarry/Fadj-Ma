import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { CheckCircle, X } from "lucide-react";

function Connexion() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // État pour "mot de passe oublié"
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetForm, setResetForm] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [resetMessage, setResetMessage] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

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
      // Navigation directe vers la page mes-medicaments
      navigate("/mes-medicaments");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  // Réinitialisation directe du mot de passe
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMessage("");
    try {
      const res = await api.post("/reset-password-direct", resetForm);
      setResetMessage(res.data.message);
      setResetSuccess(true);
    } catch (err) {
      setResetMessage(err.response?.data?.message || "Erreur lors de la réinitialisation");
      setResetSuccess(false);
    }
  };

  const closeResetModal = () => {
    setShowForgotModal(false);
    setResetForm({ email: "", password: "", password_confirmation: "" });
    setResetMessage("");
    setResetSuccess(false);
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm p-8 sm:p-10 lg:p-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 sm:mb-8 text-gray-800">
          Connexion
        </h1>

        <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
          <div>
            <label className="block text-lg font-bold mb-3 text-gray-700">Adresse e-mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-3 focus:ring-blue-200 focus:border-blue-400 transition duration-200"
              required
            />
          </div>
          
          <div>
            <label className="block text-lg font-bold mb-3 text-gray-700">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-3 focus:ring-blue-200 focus:border-blue-400 transition duration-200"
              required
            />
            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-base font-semibold text-gray-800 hover:text-gray-600 transition duration-200 no-underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-center font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-300 text-gray-800 py-4 rounded-xl hover:bg-blue-400 font-bold text-lg transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-600">
              Pas de compte ?{" "}
              <Link 
                to="/inscription" 
                className="text-blue-500 font-semibold hover:text-blue-600 transition duration-200"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Modal mot de passe oublié avec réinitialisation complète */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Réinitialiser le mot de passe</h2>
              <button 
                onClick={closeResetModal}
                className="text-gray-400 hover:text-gray-600 transition duration-200 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={28} />
              </button>
            </div>

            {!resetSuccess ? (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-lg font-semibold mb-2 text-gray-700">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={resetForm.email}
                    onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
                    placeholder="Votre email"
                    className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:ring-3 focus:ring-blue-200 focus:border-blue-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2 text-gray-700">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={resetForm.password}
                    onChange={(e) => setResetForm({ ...resetForm, password: e.target.value })}
                    placeholder="Nouveau mot de passe"
                    className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:ring-3 focus:ring-blue-200 focus:border-blue-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2 text-gray-700">
                    Confirmation du mot de passe
                  </label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={resetForm.password_confirmation}
                    onChange={(e) =>
                      setResetForm({ ...resetForm, password_confirmation: e.target.value })
                    }
                    placeholder="Confirmez le mot de passe"
                    className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:ring-3 focus:ring-blue-200 focus:border-blue-400"
                    required
                  />
                </div>

                {resetMessage && (
                  <div className={`rounded-xl p-4 ${
                    resetSuccess ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                  }`}>
                    <p className={`text-center font-medium ${
                      resetSuccess ? "text-green-600" : "text-red-600"
                    }`}>
                      {resetMessage}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeResetModal}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition duration-200 font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-blue-400 text-white hover:bg-blue-500 transition duration-200 font-semibold"
                  >
                    Réinitialiser
                  </button>
                </div>
              </form>
            ) : (
              // Message de succès après réinitialisation
              <div className="text-center py-6">
                <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Mot de passe réinitialisé !</h3>
                <p className="text-gray-600 mb-8 text-lg">Votre mot de passe a été modifié avec succès.</p>
                <button
                  onClick={closeResetModal}
                  className="w-full bg-blue-400 text-white py-4 rounded-xl hover:bg-blue-500 transition duration-200 font-bold text-lg"
                >
                  Se connecter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Connexion;