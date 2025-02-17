import React, { useState } from "react";
import { useUser } from "./UserContext";

const Login: React.FC = () => {
  const { setUser } = useUser();
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() !== "") {
      setUser(username); // Guarda el usuario en el contexto
    }
  };

  return (
    <div id="central">
      <div id="loginBox">
        <h1 id="login-title">Inicia Sesión</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            maxLength={10}
          />
          <button id="loginButton" type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;