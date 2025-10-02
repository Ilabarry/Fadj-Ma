import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Inscription() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    genre: "",
    date_naissance: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await api.post("/register", form);
      alert("Compte créé avec succès !");
      navigate("/");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert("Erreur lors de l'inscription");
      }
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl p-4 sm:p-6 lg:p-8 my-4 sm:my-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          Vos Coordonnées
        </h1>

        <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
          {/* Genre - Corrigé pour alignement horizontal */}
          <div>
            <div className="flex flex-row justify-center space-x-8 sm:space-x-12">
              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="genre"
                  value="Homme"
                  checked={form.genre === "Homme"}
                  onChange={handleChange}
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-200 focus:ring-blue-200"
                />
                <span className="text-gray-700 text-base sm:text-lg font-bold">Homme</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="genre"
                  value="Femme"
                  checked={form.genre === "Femme"}
                  onChange={handleChange}
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-200 focus:ring-blue-200"
                />
                <span className="text-gray-700 text-base sm:text-lg font-bold">Femme</span>
              </label>
            </div>
            {errors.genre && (
              <p className="text-red-500 text-sm text-center mt-2">{errors.genre[0]}</p>
            )}
          </div>

          {/* Prénom & Nom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block mb-2 text-gray-700 text-sm sm:text-base font-bold">
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                placeholder="Votre prénom"
                value={form.prenom}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent text-sm sm:text-base"
              />
              {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom[0]}</p>}
            </div>
            <div>
              <label className="block mb-2 text-gray-700 text-sm sm:text-base font-bold">
                Nom
              </label>
              <input
                type="text"
                name="nom"
                placeholder="Votre nom"
                value={form.nom}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent text-sm sm:text-base"
              />
              {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom[0]}</p>}
            </div>
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-sm sm:text-base font-bold mb-2 text-gray-700">
              Date de naissance
            </label>
            <input
              type="date"
              name="date_naissance"
              value={form.date_naissance}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent text-sm sm:text-base"
            />
            {errors.date_naissance && <p className="text-red-500 text-sm mt-1">{errors.date_naissance[0]}</p>}
          </div>

          {/* Email & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm sm:text-base font-bold mb-2 text-gray-700">
                Adresse e-mail
              </label>
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent text-sm sm:text-base"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
            </div>
            <div>
              <label className="block text-sm sm:text-base font-bold mb-2 text-gray-700">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                placeholder="Votre mot de passe"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent text-sm sm:text-base"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
            </div>
          </div>

          {/* Password confirmation */}
          <div>
            <label className="block text-sm sm:text-base font-bold mb-2 text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirmez votre mot de passe"
              value={form.password_confirmation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 text-lg sm:text-base"
          >
            Créer mon compte
          </button>
        </form>
      </div>
    </div>
  );
}

export default Inscription;