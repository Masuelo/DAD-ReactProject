import React, { useState, useEffect } from "react";
import VoiceInputComponent from "./VoiceInputComponent";
import Chatbot from "./Chatbot";

// Sección del contador
const CounterWithHooks: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div id="counter">
      <h2>Contador</h2>
      <p>Cuenta: {count}</p>
      <button id="compButton" onClick={() => setCount((prev) => prev + 1)}>
        Incrementar
      </button>
      <button id="compButton" onClick={() => setCount((prev) => prev - 1)}>
        Decrementar
      </button>
      <button id="compButtonClean" onClick={() => setCount(0)}>
        Reiniciar
      </button>
    </div>
  );
};

// Sección del generador de mensajes
const MessageInput: React.FC = () => {
  const [input, setInput] = useState("");

  return (
    <div id="messageInput">
      <h2>Sorpresita divertida</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe tu nombre..."
        id="inputField"
      />
      {input && <p>Eres un poco tonto {input}</p>}
    </div>
  );
};

// Sección del cronómetro
const Stopwatch: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning) {
      interval = window.setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }

    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div id="stopwatch">
      <h2>Cronómetro</h2>
      <p>Tiempo: {formatTime(seconds)}</p>
      <button id="compButton" onClick={() => setIsRunning(true)} disabled={isRunning}>
        Iniciar
      </button>
      <button id="compButton" onClick={() => setIsRunning(false)} disabled={!isRunning}>
        Pausar
      </button>
      <button id="compButtonClean" onClick={() => setSeconds(0)}>
        Reiniciar
      </button>
    </div>
  );
};

// Componente unificado
const UnifiedComponent: React.FC = () => {
  const [showCounter, setShowCounter] = useState(true);
  const [showMessageInput, setShowMessageInput] = useState(true);
  const [showStopwatch, setShowStopwatch] = useState(true);
  const [showVoiceInput, setShowVoiceInput] = useState(true);

  return (
    <div id="central">
      <h1 id="title">Componentes</h1>

      {/* Botones para mostrar u ocultar componentes */}
      <div>
        <button id="shButton" onClick={() => setShowCounter((prev) => !prev)}>
          {showCounter ? "Ocultar Contador" : "Mostrar Contador"}
        </button>
        <button
          id="shButton"
          onClick={() => setShowMessageInput((prev) => !prev)}
        >
          {showMessageInput
            ? "Ocultar Sorpresita Divertida"
            : "Mostrar Sorpresita Divertida"}
        </button>
        <button id="shButton" onClick={() => setShowStopwatch((prev) => !prev)}>
          {showStopwatch ? "Ocultar Cronómetro" : "Mostrar Cronómetro"}
        </button>
        <button id="shButton" onClick={() => setShowVoiceInput((prev) => !prev)}>
          {showVoiceInput ? "Ocultar Voz a Texto" : "Mostrar Voz a Texto"}
        </button>
      </div>
      <hr id="hr1" />

      {/* Contenedor flex */}
      <div id="components">
        {showCounter && <CounterWithHooks />}
        {showMessageInput && <MessageInput />}
        {showStopwatch && <Stopwatch />}
        {showVoiceInput && <VoiceInputComponent />} {/* Aquí se muestra el VoiceInputComponent */}
      </div>
      <Chatbot />
    </div>
  );
};

export default UnifiedComponent;