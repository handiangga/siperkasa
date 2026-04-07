import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function P16DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get(`/p16/perkara/${id}`);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  // 🔥 ambil data dasar
  const perkara = data[0]?.Perkara;
  const spdp = perkara?.Spdp;

  // 🔥 pisahin jaksa
  const jaksaUtama = data.find((j) => j.peran === "utama");
  const jaksaAnggota = data.filter((j) => j.peran === "anggota");

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-800">Detail P16</h2>

        <button
          onClick={() => navigate("/p16")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Kembali
        </button>
      </div>

      {/* INFO PERKARA */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <p>
          <strong>No Perkara:</strong> {spdp?.nomor_spdp || "-"}
        </p>
        <p>
          <strong>Tersangka:</strong> {spdp?.nama_tersangka || "-"}
        </p>
        <p>
          <strong>Pasal:</strong> {spdp?.pasal || "-"}
        </p>
        <p>
          <strong>Status:</strong> {perkara?.status || "-"}
        </p>
      </div>

      {/* JAKSA UTAMA */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="font-bold mb-3 text-green-800">Jaksa Utama</h3>

        {jaksaUtama ? (
          <div className="p-3 bg-green-100 rounded">
            {jaksaUtama.Jaksa?.nama}
          </div>
        ) : (
          <p>-</p>
        )}
      </div>

      {/* JAKSA ANGGOTA */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-3 text-green-800">Jaksa Anggota</h3>

        {jaksaAnggota.length === 0 ? (
          <p>-</p>
        ) : (
          <ul className="space-y-2">
            {jaksaAnggota.map((j) => (
              <li key={j.id} className="p-3 bg-gray-100 rounded">
                {j.Jaksa?.nama}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
