import React, { useState, useEffect, useCallback, useRef } from "react";
import { TextField, MenuItem, Menu } from "@mui/material";
import algoliasearch from 'algoliasearch'; // Forma correcta para la mayoría de las versiones
import debounce from "lodash.debounce";
import axios from "axios";

// Crear el cliente de Algolia
const client = algoliasearch('YI8LXMB538', '02942801bb948da5973e63c4af9d5783');
const index = client.initIndex('games_index'); // Usamos un índice llamado 'games_index'

// Interfaz para la respuesta de la API de videojuegos
interface ApiResponse {
  results: Array<{
    id: number;
    name: string;
    background_image: string;
  }>;
}

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<{ objectID: string; name: string; background_image: string }[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Debounce para reducir las llamadas a la API
  const fetchGamesFromApi = useCallback(
    debounce(async (query: string) => {
      if (query.length > 2) {
        try {
          // Llamada a la API de RAWG para obtener los juegos
          const response = await axios.get<ApiResponse>(
            `https://api.rawg.io/api/games?key=badbe4de84ea4413a6dcd379d61ef541&search=${query}&page_size=20`
          );
          
          // Mostramos los resultados obtenidos
          setResults(response.data.results.map(game => ({
            objectID: game.id.toString(),
            name: game.name,
            background_image: game.background_image,
          })));
          
          setMenuOpen(true);

          // Indexamos los resultados en Algolia (si no están indexados ya)
          await index.saveObjects(response.data.results.map(game => ({
            objectID: game.id.toString(),
            name: game.name,
            background_image: game.background_image,
          })));
        } catch (err) {
          setMenuOpen(false);
        }
      } else {
        setResults([]);
        setMenuOpen(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (searchTerm) {
      fetchGamesFromApi(searchTerm);
    }
    return () => {
      fetchGamesFromApi.cancel();
    };
  }, [searchTerm, fetchGamesFromApi]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelect = (id: string) => {
    window.location.href = `/game/${id}`;
    setMenuOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setMenuOpen(false); // Cierra el menú al hacer clic fuera
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mantener el foco en el input si el menú está abierto
  useEffect(() => {
    if (menuOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [menuOpen]);

  return (
    <div id="searchBar">
      <TextField
        id="searchField"
        label="Busca un título..."
        variant="outlined"
        fullWidth
        inputRef={inputRef}
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => {
          if (results.length > 0) setMenuOpen(true);
        }}
        InputLabelProps={{
          style: { color: "#333", display: searchTerm ? "none" : "block" },
          shrink: false,
        }}
        placeholder="Buscar juegos..."
      />
      
      <Menu
        anchorEl={inputRef.current}
        open={menuOpen && results.length > 0}
        onClose={() => setMenuOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        disableAutoFocus
        disableEnforceFocus
      >
        {results.map((game) => (
          <MenuItem key={game.objectID} onClick={() => handleSelect(game.objectID)}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={game.background_image}
                alt={game.name}
                style={{ width: "120px", height: "70px", marginRight: "10px" }}
              />
              {game.name}
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default SearchBar;