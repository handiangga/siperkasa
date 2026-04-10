import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartPerkara({ data }) {
  const chartData = {
    labels: ["Aktif", "Selesai"],
    datasets: [
      {
        data: [data.aktif || 0, data.selesai || 0],
        backgroundColor: ["#facc15", "#22c55e"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-[300px] flex items-center justify-center">
      <Pie data={chartData} />
    </div>
  );
}
