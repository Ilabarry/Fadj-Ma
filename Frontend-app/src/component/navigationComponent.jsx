import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png"

function Navigation() {

  const[ActiveButton, SetActiveButton] = useState("connexion");

  const handleConnexiononclick = () =>{
    SetActiveButton("connexion");
  }

  const handleInscriptiononclick = () => {
    SetActiveButton("inscription");
  }

  return (
    <div>
      <header className="bg-gray-700 py-4 sm:py-6 text-center m-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-wide px-4 flex flex-col items-center gap-2">
          <b>Bienvenue chez votre pharmacie</b>
          <span className="flex items-center justify-center gap-2">
            <img src={Logo} alt="Logo" className="h-11 w-auto" />
            <b>Fadj-Ma</b>
          </span>
        </h1>

      </header>

      <nav className="bg-gray-100 m-0">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-center items-center pt-4 sm:pt-6 gap-3 sm:gap-8 lg:gap-20 px-4">
          <Link
            to="/"
            onClick={handleConnexiononclick}
            className={`text-gray-800 text-base sm:text-lg lg:text-xl font-medium active:text-teal-600 transition-colors duration-200 border-2 border-gray-500 px-10 sm:px-8 lg:px-16 py-2 sm:py-4 lg:py-3 rounded-lg text-center w-full sm:w-auto
            
              ${ActiveButton === "connexion"
                ? "bg-blue-200"
                : "bg-gray-100"
              }
            
            `}
          
          >
            Connectez-vous
          </Link>
          <Link
            to="/inscription"
            onClick={handleInscriptiononclick}
            className={`text-gray-800 text-base sm:text-lg lg:text-xl font-medium active:text-teal-600 transition-colors duration-200 border-2 border-gray-500 px-10 sm:px-8 lg:px-16 py-4 sm:py-3 lg:py-3 rounded-lg text-center w-full sm:w-auto
          
                  ${
                    ActiveButton === "inscription"
                    ? "bg-blue-200"
                    : "bg-gray-100"
                  }
              `}
            >
            Inscrivez-vous
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;