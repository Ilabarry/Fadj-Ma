import React, { useState, useEffect } from "react";
import { 
  Home, 
  Package, 
  User,
  Search,
  Menu,
  FileOutput,
  X,
  Dot,
  Globe
} from "lucide-react";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom"; 
import TableauDeBord from "../pages/DashBord";
import Medicaments from "../pages/ListMedicamentPage";
import { authService } from "../services/authService";
import Logo from "../assets/Logo.png"

function NavMedicaments() {
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ infos utilisateur connecté
  const [user, setUser] = useState({ prenom: "", nom: "" });
  const [dashboardStats, setDashboardStats] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await authService.getUser();
        setUser(userData);
      } catch (error) {
        console.log("Erreur lors du chargement du profil utilisateur", error);
      }
    };

    const loadDashboardStats = async () => {
      try {
        const stats = await authService.getDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.log("Erreur lors du chargement des stats", error);
      }
    };

    loadUserData();
    loadDashboardStats();
  }, []);

  // ✅ langues disponibles
  const languages = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];
  const [language, setLanguage] = useState("fr");

  // ✅ gestion de la date et heure
  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Déconnexion avec confirmation
  const handleDeconnexion = async () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      try {
        await authService.logout();
      } catch (error) {
        console.log("Erreur lors de la déconnexion", error);
      } finally {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  // Fonction pour fermer la sidebar sur mobile
  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="px-4 py-2 sm:px-8 md:px-8 lg:px-12 xl:px-20 bg-gray-900">
      <div className="flex max-h-screen bg-gray-100">
        {/* Sidebar desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-52 bg-gray-700 border-r border-gray-700">
            <div className="flex items-center justify-center h-16 px-4 border-b bg-gray-800 border-gray-700">
              <h1 className="text-xl font-bold text-white">
                <span className="flex items-center justify-center gap-2">
                  <img src={Logo} alt="Logo" className="h-11 w-auto" />
                  <b>Fadj-Ma</b>
                </span>
              </h1>
            </div>

            {/* Profil */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.prenom} {user.nom}
                  </p>
                  <p className="text-xs text-yellow-400 truncate">Administrateur</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 space-y-2">
              <SidebarItem 
                icon={<Home size={20} />} 
                text="Tableau de bord" 
                to="/mes-medicaments" 
                active={location.pathname === "/mes-medicaments"}
                onClick={handleNavClick}
              />
              <SidebarItem 
                icon={<Package size={20} />} 
                text="Médicaments" 
                to="/mes-medicaments/medicaments" 
                active={location.pathname === "/mes-medicaments/medicaments"}
                onClick={handleNavClick}
              />
            </nav>

            {/* Déconnexion */}
            <div className="py-4 border-t border-gray-700">
              <div
                className="flex items-center justify-center space-x-3 cursor-pointer hover:bg-gray-600 py-2 rounded-lg transition-colors"
                onClick={handleDeconnexion}
              >
                <FileOutput size={20} className="text-white" />
                <button className="font-medium text-xl text-white">
                  Déconnexion
                </button>
              </div>
            </div>

            {/* copyright */}
            <div className="py-4 text-center border-t border-gray-700 bg-gray-800">
              <button className="font-medium text-xs text-gray-400">
                Propulsé par Red Teren © 2024 version 1.12
              </button>
            </div>
          </div>
        </div>

        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar mobile */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform lg:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
            <h1 className="text-xl font-bold text-white">Fadj-Ma</h1>
            <button onClick={() => setSidebarOpen(false)} className="text-white">
              <X size={24} />
            </button>
          </div>
          
          {/* Profil mobile */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-xs text-yellow-400 truncate">Administrateur</p>
              </div>
            </div>
          </div>

          <nav className="px-4 py-4 space-y-2">
            <SidebarItem 
              icon={<Home size={20} />} 
              text="Tableau de bord" 
              to="/mes-medicaments" 
              active={location.pathname === "/mes-medicaments"}
              onClick={handleNavClick}
            />
            <SidebarItem 
              icon={<Package size={20} />} 
              text="Médicaments" 
              to="/mes-medicaments/medicaments" 
              active={location.pathname === "/mes-medicaments/medicaments"}
              onClick={handleNavClick}
            />
          </nav>

          {/* Déconnexion mobile */}
          <div className="absolute bottom-0 left-0 right-0 py-2 border-t hover:bg-blue-400 border-gray-700">
            <div
              className="flex items-center space-x-3 cursor-pointer rounded-sm transition-colors"
              onClick={handleDeconnexion}
            >
              <FileOutput size={20} className="text-white" />
              <button className="font-semibold text-lg text-white">
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <header className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-3 sm:px-4">
              {/* Bouton mobile + recherche */}
              <div className="flex items-center flex-1 min-w-0">
                <button
                  className="lg:hidden p-2 rounded-md text-gray-600 mr-2"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={20} />
                </button>

                {/* Recherche */}
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full text-sm"
                  />
                </div>
              </div>

              {/* Contrôles de droite */}
              <div className="flex items-center space-x-10 sm:space-x-6">
                {/* Sélecteur de langue  */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe size={16} className="text-gray-400" />
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none appearance-none bg-white text-lg cursor-pointer shadow-xs"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Date et heure  */}
                <div className="hidden md:flex items-center">
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-700 flex items-center">
                      <Dot size={20} className="text-yellow-400 mx-1 bg-yellow-400  rounded-full" />
                      <span className="hidden sm:inline">Bonjour</span>
                    </p>
                    <p className="fles text-lg font-semibold text-gray-500">
                      {dateTime.toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      <span className="mx-1 text-yellow-400">.</span>
                      {dateTime.toLocaleTimeString("fr-FR", {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Routes */}
          <main className="flex-1 overflow-y-auto bg-gray-100">
            <Routes>
              <Route path="/" element={<TableauDeBord stats={dashboardStats} />} />
              <Route path="/medicaments" element={<Medicaments />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

// SidebarItem avec indication active - CORRIGÉ avec bg-blue-400
function SidebarItem({ icon, text, to, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 px-1 py-2 rounded-lg transition-colors mx-2 ${
        active 
          ? 'bg-blue-300 text-white border-r-2 border-blue-300' 
          : 'text-white hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="font-medium text-lg">{text}</span>
    </Link>
  );
}

export default NavMedicaments;