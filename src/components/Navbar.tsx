import React, { useState } from "react";
import { useUser } from "./UserContext";
import SearchBar from "./SearchBar";

interface NavbarProps {
  setView: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setView }) => {
  const { user, setUser } = useUser();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  const handleLogout = () => {
    setUser("");
    setView("login");
  };

  return (
    <nav id="navbar">
      <div id="navbar-left">
        <h1 id="navbar-title">Proyecto Superdivertido</h1>
        <div
          id="navbar-buttons"
          className={`navbar-menu ${menuOpen ? "open" : ""}`}
        >
          <button
            className="navbar-button"
            onClick={() => {
              setView("videojuegos");
              setMenuOpen(false);
            }}
          >
            Videojuegos
          </button>
          <button
            className="navbar-button"
            onClick={() => {
              setView("componentes");
              setMenuOpen(false);
            }}
          >
            Componentes
          </button>
          <button
            className="navbar-button"
            onClick={() => {
              setView("tareas");
              setMenuOpen(false);
            }}
          >
            Tareas
          </button>
          <button
            className="navbar-button"
            onClick={() => {
              setView("informes");
              setMenuOpen(false);
            }}
          >
            Informes
          </button>
        </div>
      </div>

      {user && (
        <div id="user-section">
          <SearchBar />
          <button id="user-menu-button" onClick={handleLogout}>
            Usuario: {user} - Logout
          </button>
          <button
            id="dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
