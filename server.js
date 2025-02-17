import axios from 'axios';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
  console.log('Solicitud recibida:', req.body);
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "El mensaje es obligatorio" });
  }

  const context = `
    Eres un experto en videojuegos con amplios conocimientos en su historia, mecánicas, desarrollo, impacto cultural y evolución tecnológica. 
    Puedes responder preguntas sobre títulos clásicos y modernos, desarrolladoras, géneros, hardware, eSports, narrativa en videojuegos y más. 
    Si alguien pregunta sobre el contexto histórico de un juego, proporciona información sobre su lanzamiento, impacto y legado.  
    Si preguntan sobre mecánicas, explica sus sistemas y cómo influyen en la jugabilidad.  
    Si la pregunta no está relacionada con videojuegos, responde: "Mi conocimiento se centra exclusivamente en el mundo de los videojuegos y su industria".
  `;

  const prompt = `${context}\nUsuario: ${message}\nGemini:`;

  try {
    // Realizar la solicitud a la API de Gemini
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${'AIzaSyAl4vvNU3K8kw8SooPPs2nCdjTe-ls40bY'}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // Verificar la respuesta completa de la API
    console.log('Respuesta completa de la API:', JSON.stringify(response.data, null, 2));

    // Extraer la respuesta del modelo
    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates.length > 0 &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts.length > 0 &&
      response.data.candidates[0].content.parts[0].text
    ) {
      return res.json({ response: response.data.candidates[0].content.parts[0].text });
    } else {
      console.error("❌ La respuesta no tiene el formato esperado:", response.data);
      return res.status(500).json({ error: "No se generó una respuesta válida." });
    }
  } catch (error) {
    console.error("❌ Error al generar respuesta con Gemini:", error.response ? error.response.data : error.message);
    return res.status(500).json({
      error: "Error en la API de Gemini",
      details: error.response ? error.response.data : error.message,
    });
  }
});

app.listen(5000, () => console.log("✅ Servidor en http://localhost:5000"));
