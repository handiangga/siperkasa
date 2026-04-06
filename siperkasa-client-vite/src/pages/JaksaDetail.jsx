import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function JaksaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jaksa, setJaksa] = useState({});
  const [perkara, setPerkara] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 🔥 detail jaksa
      const resJaksa = await api.get(`/jaksas/${id}`);
      setJaksa(resJaksa.data);

      // 🔥 perkara P16 berdasarkan jaksa
      const resPerkara = await api.get(`/p16/jaksa/${id}`);
      console.log("DATA P16:", resPerkara.data); // debug
      setPerkara(resPerkara.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Detail Jaksa</h2>

        <button
          onClick={() => navigate("/jaksa")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Kembali
        </button>
      </div>

      {/* INFO JAKSA */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <p>
          <b>Nama:</b> {jaksa.nama}
        </p>
        <p>
          <b>NIP:</b> {jaksa.nip}
        </p>
      </div>

      {/* TABLE P16 */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="p-4 text-center">Loading...</p>
        ) : (
          <table className="w-full">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="p-3">No</th>
                <th>Nomor P16</th>
                <th>Tersangka</th>
                <th>Pasal</th>
              </tr>
            </thead>

            <tbody>
              {perkara.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center">
                    Belum ada perkara
                  </td>
                </tr>
              ) : (
                perkara.map((item, i) => (
                  <tr key={item.id} className="text-center border-t">
                    <td>{i + 1}</td>

                    {/* 🔥 dari P16Assignment */}
                    <td>{item.nomor_p16}</td>

                    {/* 🔥 dari relasi Perkara */}
                    <td>{item.Perkara?.Spdp?.nama_tersangka || "-"}</td>
                    <td>{item.Perkara?.Spdp?.pasal || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
