import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

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
import {
  FaFileAlt,
  FaGavel,
  FaCheckCircle,
  FaUsers,
  FaBell,
} from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth(); // 🔥 ROLE

  const [stats, setStats] = useState({
    spdp: 0,
    perkara: 0,
    aktif: 0,
    selesai: 0,
    p16: 0,
  });

  const [monthly, setMonthly] = useState(Array(12).fill(0));
  const [topJaksa, setTopJaksa] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");

  // 🔔 NOTIF
  const [notif, setNotif] = useState({ spdp: [], p16: [] });

  useEffect(() => {
    fetchData();
    fetchNotif();

    const interval = setInterval(() => {
      fetchData();
      fetchNotif();
    }, 10000);

    return () => clearInterval(interval);
  }, [filterMonth]);

  const fetchData = async () => {
    try {
      const spdpRes = await api.get("/spdp");
      const perkaraRes = await api.get("/perkara");

      // 🔥 ROLE: beda endpoint
      const p16Res =
        user.role === "jaksa"
          ? await api.get("/p16/jaksa/" + user.jaksa_id)
          : await api.get("/p16");

      const spdp = spdpRes.data.data || spdpRes.data;
      const perkara = perkaraRes.data.data || perkaraRes.data;
      const p16 = p16Res.data.data || p16Res.data;

      // 🔥 FILTER SPDP
      const filteredSpdp = filterMonth
        ? spdp.filter((d) => {
            if (!d.tanggal_spdp) return false;
            return new Date(d.tanggal_spdp).getMonth() === Number(filterMonth);
          })
        : spdp;

      // 🔥 FILTER PERKARA
      const filteredPerkara = perkara.filter((p) =>
        filteredSpdp.some((s) => s.id === p.spdp_id),
      );

      // 🔥 FILTER P16
      const filteredP16 = filterMonth
        ? p16.filter((p) => {
            if (!p.tanggal_p16) return false;
            return new Date(p.tanggal_p16).getMonth() === Number(filterMonth);
          })
        : p16;

      const p16Utama = filteredP16.filter((p) => p.peran === "utama");

      // 🔥 STATS
      setStats({
        spdp: filteredSpdp.length,
        perkara: filteredPerkara.length,
        aktif: filteredPerkara.filter((p) => p.status === "penyidikan").length,
        selesai: filteredPerkara.filter((p) => p.status === "selesai").length,
        p16: p16Utama.length,
      });

      // 🔥 CHART BULAN
      const bulan = Array(12).fill(0);
      filteredSpdp.forEach((d) => {
        if (d.tanggal_spdp) {
          const m = new Date(d.tanggal_spdp).getMonth();
          bulan[m]++;
        }
      });
      setMonthly(bulan);

      // 🔥 TOP JAKSA (HANYA ADMIN/KAJARI)
      if (user.role !== "jaksa") {
        const map = {};

        p16Utama.forEach((item) => {
          const jaksa = item.Jaksa;
          if (!jaksa) return;

          if (!map[jaksa.id]) {
            map[jaksa.id] = {
              nama: jaksa.nama,
              total: 0,
              id: jaksa.id,
            };
          }

          map[jaksa.id].total++;
        });

        const sorted = Object.values(map).sort((a, b) => b.total - a.total);

        setTopJaksa(sorted.slice(0, 5));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchNotif = async () => {
    try {
      const res = await api.get("/notif");
      setNotif(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const pieData = {
    labels: ["Aktif", "Selesai"],
    datasets: [
      {
        data: [stats.aktif, stats.selesai],
        backgroundColor: ["#facc15", "#22c55e"],
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

  const jaksaChart = {
    labels: topJaksa.map((j) => j.nama),
    datasets: [
      {
        label: "P16 Utama",
        data: topJaksa.map((j) => j.total),
        backgroundColor: "#166534",
      },
    ],
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        Dashboard ({user.role})
      </h2>

      {/* 🔔 NOTIF
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FaBell /> <b>Notifikasi</b>
        </div>

        {notif.spdp.map((n) => (
          <p key={n.id}>📄 SPDP baru: {n.nomor_spdp}</p>
        ))}

        {notif.p16.map((n) => (
          <p key={n.id}>⚖️ P16 baru</p>
        ))}
      </div> */}

      {/* FILTER */}
      <select
        value={filterMonth}
        onChange={(e) => setFilterMonth(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="">Semua Bulan</option>
        {[
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
        ].map((b, i) => (
          <option key={i} value={i}>
            {b}
          </option>
        ))}
      </select>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card
          title="SPDP"
          value={stats.spdp}
          icon={<FaFileAlt />}
          onClick={() => navigate("/spdp")}
        />
        <Card title="Perkara" value={stats.perkara} icon={<FaGavel />} />
        <Card title="Aktif" value={stats.aktif} icon={<FaUsers />} />
        <Card title="Selesai" value={stats.selesai} icon={<FaCheckCircle />} />
        <Card
          title="P16"
          value={stats.p16}
          icon={<FaFileAlt />}
          onClick={() => navigate("/p16")}
        />
      </div>

      {/* CHART */}
      <div className="grid md:grid-cols-2 gap-6">
        <Box title="Status Perkara">
          <div className="h-[300px]">
            <Pie data={pieData} />
          </div>
        </Box>

        <Box title="SPDP per Bulan">
          <div className="h-[300px]">
            <Bar data={barData} />
          </div>
        </Box>
      </div>

      {/* 🔥 TOP JAKSA (HANYA KAJARI/ADMIN) */}
      {user.role !== "jaksa" && (
        <>
          <div className="bg-white p-6 mt-6 rounded shadow">
            <h3 className="font-semibold mb-4">Top Jaksa</h3>

            {topJaksa.map((j, i) => (
              <div
                key={j.id}
                onClick={() => navigate(`/jaksa/${j.id}`)}
                className={`flex justify-between items-center mb-2 cursor-pointer p-2 rounded 
                ${i === 0 ? "bg-yellow-50 font-semibold" : "hover:bg-gray-50"}`}
              >
                <span>
                  {i === 0 && "🥇 "}
                  {i === 1 && "🥈 "}
                  {i === 2 && "🥉 "}
                  {j.nama}
                </span>

                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  {j.total}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 mt-6 rounded shadow">
            <h3 className="font-semibold mb-4">Grafik Jaksa</h3>

            <div className="h-[300px]">
              <Bar data={jaksaChart} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* CARD */
function Card({ title, value, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 rounded-xl shadow flex justify-between items-center 
      ${onClick ? "cursor-pointer hover:shadow-lg transition" : ""}`}
    >
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-green-800">{value}</h3>
      </div>

      <div className="text-2xl text-green-700">{icon}</div>
    </div>
  );
}

/* BOX */
function Box({ title, children }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="mb-4 font-semibold text-green-800">{title}</h3>
      {children}
    </div>
  );
}
