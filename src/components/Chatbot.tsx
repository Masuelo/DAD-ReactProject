import React, { useState, useRef, useEffect } from "react";
import { 
  MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator 
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { MessageModel } from "@chatscope/chat-ui-kit-react";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<MessageModel[]>([
    { message: "¡Hola softófilo! Soy Wander, tu asistente personal ¿qué necesitas saber sobre videojuegos hoy?", sender: "Gemini", direction: "incoming", position: "single" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Para abrir o cerrar el chatbot
  const chatbotRef = useRef<HTMLDivElement>(null); // Referencia al chatbot

  // Detectar clic fuera del chatbot para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const sendMessage = async (text: string) => {
    const newMessage: MessageModel = { 
      message: text, 
      sender: "Usuario", 
      direction: "outgoing" as MessageModel["direction"], 
      position: "single" 
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/chat", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ message: text }) 
      });

      const data = await response.json();
      const botMessage: MessageModel = { 
        message: data.response, 
        sender: "Gemini", 
        direction: "incoming" as MessageModel["direction"], 
        position: "single" 
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setIsTyping(false);
  };

  const toggleChatbot = () => {
    setIsOpen(prevState => !prevState); // Cambiar el estado de abierto/cerrado
  };

  return (
    <div 
      id="chatbot-container" 
      ref={chatbotRef} 
      className={isOpen ? "open" : ""} 
      onClick={(e) => e.stopPropagation()} // Evitar que el clic en el chatbot cierre el componente
    >
      <div className="chatbox-header" onClick={toggleChatbot}>
       - Asistente de Inteligencia Artificial -
      </div>
      {isOpen && (
        <div className="chatbox-body">
          <MainContainer>
            <ChatContainer>
              <MessageList typingIndicator={isTyping ? <TypingIndicator content="Gemini está escribiendo..." /> : null}>
                {messages.map((msg, i) => (
                  <Message key={i} model={msg} />
                ))}
              </MessageList>
              <MessageInput placeholder="Escribe un mensaje..." onSend={sendMessage} />
            </ChatContainer>
          </MainContainer>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
