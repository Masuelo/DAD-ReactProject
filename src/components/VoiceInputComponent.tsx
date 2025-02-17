import React, { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const VoiceInputComponent: React.FC = () => {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const { transcript, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Tu navegador no soporta reconocimiento de voz.</p>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSend = () => {
    setSubmittedText(text);
    setText(""); // Limpia el input después de enviar
    resetTranscript();
  };

  const handleStartListening = () => {
    resetTranscript(); // Resetea el texto transcrito antes de comenzar a escuchar
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setText(transcript); // Inserta el texto transcrito en el input
  };

  const handleClearInput = () => {
    setText(""); // Limpia el campo de texto
    resetTranscript();
  };

  return (
    <div id="voiceInput">
      <h2>Input de Voz a Texto</h2>
      <input
        type="text"
        value={text || transcript}
        onChange={handleInputChange}
        id="voiceInputField"
        placeholder="Escribe o usa el micrófono"
      />
      <div id="voiceButtons" className="flex space-x-2">
        <button
          id="compButton"
          onClick={handleSend}
        >
          Enviar
        </button>
        <button
          id="compButton"
          onClick={handleStartListening}
        >
          Escuchar
        </button>
        <button
          id="compButton"
          onClick={handleStopListening}
        >
          Detener
        </button>
        {/* Botón para limpiar el campo de texto */}
        <button
          id="compButtonClean"
          onClick={handleClearInput}
        >
          Limpiar
        </button>
      </div>
      <div id="outputText">
        <h4 id="voiceResultText">Resultado:</h4>
        <p>{submittedText || "Nada enviado aún."}</p>
      </div>
    </div>
  );
};

export default VoiceInputComponent;
