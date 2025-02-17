import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import Papa from "papaparse";
import Charts from "./Charts";

const csvUrl = "/200125_LoL_champion_data.csv";

interface Stats {
  hp_base?: number;
  mp_base?: number;
  arm_base?: number;
  mr_base?: number;
  dam_base?: number;
  as_base?: number;
  range?: number;
  hp5_base?: number;
  mp5_base?: number;
  ms?: number;
}

interface Champion {
  apiname: string;
  fullname: string;
  nickname: string;
  title: string;
  difficulty: number;
  herotype: string;
  altType: string;
  resource: string;
  rangetype: string;
  role: string;
  damage: string;
  toughness: string;
  control: string;
  mobility: string;
  utility: string;
  style: string;
  adaptivetype: string;
  be: number;
  rp: number;
  skill_i: string;
  skill_q: string;
  skill_w: string;
  skill_e: string;
  skill_r: string;
  stats: Stats;
}

const parseJSON = (data: string) => {
  try {
    const parsed = JSON.parse(data.replace(/'/g, '"'));
    return Object.values(parsed).join(", ");
  } catch {
    return data && data !== "NaN" ? data : "N/A";
  }
};

const Reports = () => {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [difficulty, setDifficulty] = useState<string>("");
  const [heroType, setHeroType] = useState<string>("");
  const [filteredChampions, setFilteredChampions] = useState<Champion[]>([]);
  const [, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result: Papa.ParseResult<any>) => {
        const validChampions = result.data
          .filter((champ: any) => champ.apiname && champ.title && champ.stats)
          .map((champ: any) => {
            let statsObject: Stats = {};
            try {
              statsObject = JSON.parse(champ.stats.replace(/'/g, '"'));
            } catch (error) {
              console.error(`Error parsing stats for ${champ.apiname}`, error);
            }

            return {
              apiname: champ.apiname,
              fullname: champ.fullname && champ.fullname !== "NaN" ? champ.fullname : champ.apiname,
              nickname: champ.nickname && champ.nickname !== "NaN" ? champ.nickname : champ.fullname ?? champ.apiname,
              title: champ.title,
              difficulty: champ.difficulty ?? "N/A",
              herotype: champ.herotype ?? "N/A",
              altType: champ.altType ?? "N/A",
              resource: champ.resource ?? "N/A",
              rangetype: champ.rangetype ?? "N/A",
              role: parseJSON(champ.role),
              damage: champ.damage ?? "N/A",
              toughness: champ.toughness ?? "N/A",
              control: champ.control ?? "N/A",
              mobility: champ.mobility ?? "N/A",
              utility: champ.utility ?? "N/A",
              style: champ.style ?? "N/A",
              adaptivetype: champ.adaptivetype ?? "N/A",
              be: champ.be ?? "N/A",
              rp: champ.rp ?? "N/A",
              skill_i: parseJSON(champ.skill_i),
              skill_q: parseJSON(champ.skill_q),
              skill_w: parseJSON(champ.skill_w),
              skill_e: parseJSON(champ.skill_e),
              skill_r: parseJSON(champ.skill_r),
              stats: statsObject,
            };
          });
        setChampions(validChampions);
        setFilteredChampions(validChampions);
        setLoading(false);
      },
      error: (error) => {
        console.error("Error al cargar el CSV:", error);
        setLoading(false);
      },
    });
  }, []);

  useEffect(() => {
    const filtered = champions.filter(
      (champ) =>
        (difficulty === "" || champ.difficulty.toString() === difficulty) &&
        (heroType === "" || champ.herotype === heroType)
    );
    setFilteredChampions(filtered);
  }, [difficulty, heroType, champions]);

  const generatePDF = () => {
    if (filteredChampions.length === 0) {
      alert("No hay campeones que coincidan con los filtros seleccionados.");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    let y = 20;

    filteredChampions.forEach((champion, index) => {
      if (index > 0) {
        doc.addPage();
        y = 20;
      }

      const stats = champion.stats || {};
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Samuel Jiménez Delgado - Estudio en profundidad sobre personajes de League of Legends", 10, y);
      y += 18;

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(17);
      doc.text(`Datos sobre personajes de tipo: "${champion.herotype}" y dificultad: "${champion.difficulty}"`, 10, y);
      y += 20;

      // TÍTULO
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(30);
      doc.text(champion.fullname, 10, y);
      y += 10;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(20);
      doc.text(`"${champion.title}"`, 10, y);
      y += 16;

      // INFORMACIÓN GENERAL
      doc.setTextColor(0, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.text("Información General:", 10, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.text(`Rol: ${champion.role} | Rango: ${champion.rangetype}`, 10, y);
      y += 7;
      doc.text(`Tipo de daño: ${champion.adaptivetype} | Recurso: ${champion.resource}`, 10, y);
      y += 14;

      // ATRIBUTOS
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 0, 0);
      doc.text("Atributos:", 10, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.text(`Dificultad: ${champion.difficulty} | Tipo: ${champion.herotype}`, 10, y);
      y += 14;

      // ESTADÍSTICAS BASE
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 100);
      doc.text("Estadísticas Base:", 10, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.text(
        `HP: ${stats.hp_base ?? "N/A"} | Mana: ${stats.mp_base ?? "N/A"}`,
        10,
        y
      );
      y += 7;
      doc.text(
        `Daño base: ${stats.dam_base ?? "N/A"} | Rango de ataque: ${stats.range ?? "N/A"}`,
        10,
        y
      );
      y += 7;
      doc.text(
        `Armadura: ${stats.arm_base ?? "N/A"} | Resistencia Mágica: ${stats.mr_base ?? "N/A"}`,
        10,
        y
      );
      y += 14;

      // HABILIDADES
      doc.setTextColor(0, 100, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Habilidades:", 10, y);
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`Pasiva: ${champion.skill_i}`, 10, y);
      y += 7;
      doc.text(`Q: ${champion.skill_q}`, 10, y);
      y += 7;
      doc.text(`W: ${champion.skill_w}`, 10, y);
      y += 7;
      doc.text(`E: ${champion.skill_e}`, 10, y);
      y += 7;
      doc.text(`R: ${champion.skill_r}`, 10, y);
      y += 14;

      // RESUMEN
      doc.setTextColor(100, 100, 0);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Resumen de personaje:", 10, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.text(
        `Daño: ${champion.damage ?? "N/A"} | Resistencia: ${champion.toughness ?? "N/A"}`,
        10,
        y
      );
      y += 7;
      doc.text(
        `Control: ${champion.control ?? "N/A"} | Movilidad: ${champion.mobility ?? "N/A"}`,
        10,
        y
      );
      y += 7;
      doc.text(
        `Utilidad: ${champion.utility ?? "N/A"} | Estilo: ${champion.utility ?? "N/A"}`,
        10,
        y
      );
      y += 14;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Fuente: League of Legends Wiki | Reporte Generado Automáticamente", 10, 280);
    });

    doc.save("informe_champions.pdf");
  };

  return (
    <div id="central">
      <h2 id="title">Informe de Campeones de League of Legends</h2>

      <div id="info-menu">
        <div id="info-content">
          <label id="info-label">Dificultad:</label>
          <select id="info-Button" onChange={(e) => setDifficulty(e.target.value)} value={difficulty}>
            <option value="">Todas</option>
            {[...new Set(champions.map((champion) => champion.difficulty).filter(Boolean))].map((level) => (
              <option key={level} value={level?.toString() ?? ""}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div id="info-content">
          <label id="info-label">Tipo de Héroe:</label>
          <select id="info-Button" onChange={(e) => setHeroType(e.target.value)} value={heroType}>
            <option value="">Todos</option>
            {[...new Set(champions.map((champion) => champion.herotype).filter(Boolean))].map((type) => (
              <option key={type} value={type ?? ""}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <button id="pdf-print" onClick={generatePDF}>Imprimir Informe</button>

      {filteredChampions.length === 0 && (
        <p id="no-results" style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>
          No hay campeones que coincidan con los filtros seleccionados.
        </p>
      )}

      <hr id="hr1" />

      {/* 📊 Agregamos los gráficos debajo de los informes */}
      <Charts />
    </div>
  );
};

export default Reports;
