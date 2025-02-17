import { useState } from "react";
import "regenerator-runtime/runtime";
import { useApi } from "./hooks/useApi";
import customDescriptions from "./hooks/customDescriptions";
import Navbar from "./components/Navbar";
import UnifiedComponent from "./components/UnifiedComponent";
import Login from "./components/Login";
import { UserProvider, useUser } from "./components/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import TaskManager from "./components/TaskManager";
import Chatbot from "./components/Chatbot";
import Reports from "./components/Reports"; // ✅ Importamos Informes

const AppContent = () => {
  const { user } = useUser();
  const { games, isLoading, error } = useApi();
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [view, setView] = useState("videojuegos");

  console.log("Vista actual en App.tsx:", view); // 🔍 Depuración

  const nextGame = () => {
    const nextIndex = (currentGameIndex + 1) % games.length;
    setCurrentGameIndex(nextIndex);
  };

  const prevGame = () => {
    const prevIndex =
      currentGameIndex === 0 ? games.length - 1 : (currentGameIndex - 1) % games.length;
    setCurrentGameIndex(prevIndex);
  };

  const game = games[currentGameIndex];
  const gameDescription = game
    ? customDescriptions[game.name] || "Descripción no disponible"
    : "Juego no disponible";

  if (!user) {
    return <Login />;
  }

  return (
    <div>
      <Navbar setView={setView} />
      <div>
        {view === "videojuegos" && (
          <div>
            {isLoading && <p>Cargando juegos...</p>}
            {error && <p>{error}</p>}
            {game && (
              <div>
                <div id="api">
                  <div id="image">
                    <img
                      id="img"
                      src={game.background_image}
                      alt={game.name}
                      style={{
                        width: "400px",
                        height: "600px",
                        objectFit: "cover",
                        marginBottom: "10px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div id="content">
                    <h2 id="gameName">{game.name}</h2>
                    <p>{gameDescription}</p>
                  </div>
                  <div id="platforms">
                    <h3>Plataformas</h3>
                    <ul>
                      {game.platforms &&
                        game.platforms.map((platform: { platform: { name: string } }) => (
                          <li key={platform.platform.name}>{platform.platform.name}</li>
                        ))}
                    </ul>
                  </div>
                </div>
                <hr id="hr1" />
                <button id="buttonStyle" onClick={prevGame}>
                  Anterior
                </button>
                <button id="buttonStyle" onClick={nextGame}>
                  Siguiente
                </button>
                <Chatbot />
              </div>
            )}
          </div>
        )}
        {view === "componentes" && <UnifiedComponent />}
        {view === "tareas" && <TaskManager />}
        {view === "informes" && <Reports />}
      </div>
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
