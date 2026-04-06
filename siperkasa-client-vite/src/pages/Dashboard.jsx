import { useEffect, useState } from "react";
import api from "../services/api";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    spdp: 0,
    aktif: 0,
    selesai: 0,
  });

  const [monthly, setMonthly] = useState(Array(12).fill(0));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/spdps");
      const data = res.data;

      setStats({
        spdp: data.length,
        aktif: data.filter((d) => d.status === "aktif").length,
        selesai: data.filter((d) => d.status === "selesai").length,
      });

      const bulan = Array(12).fill(0);
      data.forEach((d) => {
        if (d.tanggal_spdp) {
          const m = new Date(d.tanggal_spdp).getMonth();
          bulan[m]++;
        }
      });

      setMonthly(bulan);
    } catch (err) {
      console.log(err);
    }
  };

  const pieData = {
    labels: ["Aktif", "Selesai"],
    datasets: [
      {
        data: [stats.aktif, stats.selesai],
        backgroundColor: ["#166534", "#22c55e"],
      },
    ],
  };

  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
    datasets: [
      {
        label: "SPDP per bulan",
        data: monthly,
        backgroundColor: "#166534",
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Dashboard</h2>

      {/* CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Total SPDP" value={stats.spdp} />
        <Card title="Perkara Aktif" value={stats.aktif} />
        <Card title="Perkara Selesai" value={stats.selesai} />
      </div>

      {/* GRAFIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Box title="Status Perkara">
          <Pie data={pieData} />
        </Box>

        <Box title="SPDP per Bulan">
          <Bar data={barData} />
        </Box>
      </div>
    </div>
  );
}

/* CARD */
function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
      <p className="text-gray-500">{title}</p>
      <h3 className="text-4xl font-bold text-green-800 mt-2">{value}</h3>
    </div>
  );
}

/* BOX */
function Box({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="mb-4 font-semibold text-green-800">{title}</h3>
      {children}
    </div>
  );
}
