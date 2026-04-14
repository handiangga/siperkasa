import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { ENDPOINT } from "../../constants/endpoint";

import Card from "../../components/ui/card";
import Box from "../../components/ui/box";

import { Pie } from "react-chartjs-2";

export default function DashboardJaksa() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      const res = await api.get(ENDPOINT.DASHBOARD_JAKSA);

      console.log("DASHBOARD JAKSA:", res.data);

      setData(res.data);
    } catch (err) {
      console.log("ERROR DASHBOARD:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!data) {
    return <p className="text-center mt-10 text-red-500">Data tidak ada</p>;
  }

  const pieData = {
    labels: ["Aktif", "Selesai"],
    datasets: [
      {
        data: [data?.aktif || 0, data?.selesai || 0],
        backgroundColor: ["#facc15", "#22c55e"],
      },
    ],
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-green-800">
        Dashboard Jaksa
      </h2>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card title="Total Perkara" value={data?.total || 0} />
        <Card title="Aktif" value={data?.aktif || 0} />
        <Card title="Selesai" value={data?.selesai || 0} />
      </div>

      {/* CHART */}
      <div className="grid md:grid-cols-2 gap-6">
        <Box title="Status Perkara">
          <div className="h-[300px] flex items-center justify-center">
            <Pie data={pieData} />
          </div>
        </Box>

        <Box title="Daftar Perkara Saya">
          <div className="max-h-[300px] overflow-auto">
            {data?.perkara?.length > 0 ? (
              data.perkara.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/p16/${p.id}`)}
                  className="p-3 border-b cursor-pointer hover:bg-gray-50"
                >
                  <p className="font-semibold">{p?.Spdp?.nomor_spdp || "-"}</p>

                  <p className="text-sm text-gray-500">
                    {p?.Spdp?.nama_tersangka || "-"}
                  </p>

                  {/* 🔥 STATUS + PERAN */}
                  <div className="flex gap-2 mt-1">
                    {/* STATUS */}
                    <span
                      className={`text-xs px-2 py-1 rounded
                      ${
                        p.status === "penyidikan" || p.status === "proses"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {p.status}
                    </span>

                    {/* 🔥 PERAN */}
                    {p.peran && (
                      <span
                        className={`text-xs px-2 py-1 rounded
                        ${
                          p.peran === "utama"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {p.peran === "utama" ? "Jaksa Utama" : "Jaksa Anggota"}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center mt-4">
                Tidak ada perkara
              </p>
            )}
          </div>
        </Box>
      </div>
    </div>
  );
}
