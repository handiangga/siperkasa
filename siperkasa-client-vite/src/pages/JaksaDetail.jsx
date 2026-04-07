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

      const resJaksa = await api.get(`/jaksas/${id}`);
      setJaksa(resJaksa.data);

      const resPerkara = await api.get(`/p16/jaksa/${id}`);
      setPerkara(resPerkara.data);

      console.log("PERKARA:", resPerkara.data); // debug
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 warna status
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";

    if (status === "penyidikan") return "bg-yellow-100 text-yellow-700";

    if (status === "penuntutan") return "bg-blue-100 text-blue-700";

    if (status === "selesai") return "bg-green-100 text-green-700";

    return "bg-gray-100 text-gray-600";
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

      {/* INFO */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <p>
          <b>Nama:</b> {jaksa.nama}
        </p>
        <p>
          <b>NIP:</b> {jaksa.nip}
        </p>
        <p>
          <b>Jabatan:</b> {jaksa.jabatan || "-"}
        </p>
        <p>
          <b>Pangkat:</b> {jaksa.pangkat || "-"}
        </p>

        <p className="mt-4">
          <b>Total P16:</b>{" "}
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
            {perkara.length}
          </span>
        </p>
      </div>

      {/* TABLE */}
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
                <th>Status</th> {/* 🔥 baru */}
              </tr>
            </thead>

            <tbody>
              {perkara.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    Belum ada perkara
                  </td>
                </tr>
              ) : (
                perkara.map((item, i) => {
                  const status = item.Perkara?.status?.toLowerCase();

                  return (
                    <tr
                      key={item.id}
                      className="text-center border-t hover:bg-gray-50"
                    >
                      <td>{i + 1}</td>

                      <td>{item.nomor_p16 || "-"}</td>

                      <td>{item.Perkara?.Spdp?.nama_tersangka || "-"}</td>

                      <td>{item.Perkara?.Spdp?.pasal || "-"}</td>

                      {/* 🔥 STATUS */}
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                            status,
                          )}`}
                        >
                          {status || "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
