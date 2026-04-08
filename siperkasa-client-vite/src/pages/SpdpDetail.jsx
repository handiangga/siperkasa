import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SpdpDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get(`/spdps/${id}`);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <p className="p-6">Loading...</p>;

  const perkara = data.Perkara;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-800">Detail SPDP</h2>

        <button
          onClick={() => navigate("/spdp")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Kembali
        </button>
      </div>

      {/* 🔥 INFO SPDP */}
      <div className="bg-white p-6 rounded-xl shadow mb-6 space-y-2">
        <p>
          <b>Nomor:</b> {data.nomor_spdp}
        </p>
        <p>
          <b>Tanggal:</b> {data.tanggal_spdp?.split("T")[0]}
        </p>
        <p>
          <b>Asal Instansi:</b> {data.asal_instansi || "-"}
        </p>
        <p>
          <b>Tersangka:</b> {data.nama_tersangka}
        </p>
        <p>
          <b>Pasal:</b> {data.pasal}
        </p>
      </div>

      {/* 🔥 DATA PERKARA */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <h3 className="p-4 font-semibold text-green-800 border-b">
          Data Perkara
        </h3>

        <table className="w-full text-center">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {!perkara ? (
              <tr>
                <td colSpan="2" className="p-4 text-center">
                  Belum ada perkara
                </td>
              </tr>
            ) : (
              <tr className="border-t">
                {/* STATUS */}
                <td>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                    {perkara.status}
                  </span>
                </td>

                {/* AKSI */}
                <td>
                  <button
                    onClick={() => navigate(`/p16/${perkara.id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:scale-105 transition"
                  >
                    Lihat P16
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
