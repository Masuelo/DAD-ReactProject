import { useEffect, useState } from "react";

export function useApi() {
  const [games, setGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async (query: string = '') => {
    try {
      const url = query 
        ? `https://api.rawg.io/api/games?key=badbe4de84ea4413a6dcd379d61ef541&page_size=20&search=${query}`
        : `https://api.rawg.io/api/games?key=badbe4de84ea4413a6dcd379d61ef541&page_size=20`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGames(data.results);
    } catch (err: any) {
      setError(`Error al obtener los juegos: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames(); // Llamar sin parámetros al inicio
  }, []);

  return { games, isLoading, error, fetchGames };
}
