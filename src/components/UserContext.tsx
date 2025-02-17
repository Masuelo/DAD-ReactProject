import React, { createContext, useContext, useState, ReactNode } from "react";

// Definimos el tipo del contexto
interface UserContextType {
  user: string | null; // Usuario actual
  setUser: (user: string) => void; // Función para actualizar el usuario
}

// Creamos el contexto con un valor inicial
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};

// Definimos el proveedor del contexto
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
