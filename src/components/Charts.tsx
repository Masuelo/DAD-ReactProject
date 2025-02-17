import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Registrar módulos de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const csvUrl = "/200125_LoL_champion_data.csv";

const Charts: React.FC = () => {
  const [roleData, setRoleData] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  });
  const [positionData, setPositionData] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  });

  useEffect(() => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result: Papa.ParseResult<any>) => {
        const data = result.data;

        // Contar cantidad de campeones por rol
        const roleCounts: Record<string, number> = {};
        const positionCounts: Record<string, number> = {};

        data.forEach((champ: any) => {
          if (champ.role) {
            roleCounts[champ.role] = (roleCounts[champ.role] || 0) + 1;
          }
          if (champ.client_positions) {
            positionCounts[champ.client_positions] = (positionCounts[champ.client_positions] || 0) + 1;
          }
        });

        setRoleData({
          labels: Object.keys(roleCounts),
          values: Object.values(roleCounts),
        });

        setPositionData({
          labels: Object.keys(positionCounts),
          values: Object.values(positionCounts),
        });
      },
      error: (error) => console.error("Error al cargar el CSV:", error),
    });
}, []);

return (
    <div id="graph-layout">
        { /* Gráfico Circular - Posiciones */}
        <div id="graph-content1">
            <h3>Distribución de Campeones por Posición</h3>
            <Pie
                data={{
                    labels: positionData.labels,
                    datasets: [
                    {
                        label: "Cantidad",
                        data: positionData.values,
                        backgroundColor: [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(54, 162, 235, 0.5)",
                        "rgba(255, 206, 86, 0.5)",
                        "rgba(75, 192, 192, 0.5)",
                        "rgba(153, 102, 255, 0.5)",
                        ],
                        borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        ],
                        borderWidth: 1,
                    },
                    ],
                }}
                options={{
                    responsive: true,
                    plugins: {
                        title: { display: true, text: "Distribución de Campeones por Posición" },
                    },
                }}
            />
        </div>

        {/* Gráfico de Barras - Roles */}
        <div id="graph-content2">
            <h3>Cantidad de Campeones según Rol</h3>
                <Bar
                data={{
                    labels: roleData.labels,
                    datasets: [
                    {
                        label: "Cantidad de Campeones",
                        data: roleData.values,
                        backgroundColor: "rgba(54, 162, 235, 0.5)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    },
                    ],
                }}
                options={{
                    responsive: true,
                    plugins: {
                    legend: { display: false },
                        title: { display: true, text: "Cantidad de Campeones por Rol" },
                    },
                }}
                />
        </div>
      
    </div>
  );
};

export default Charts;
