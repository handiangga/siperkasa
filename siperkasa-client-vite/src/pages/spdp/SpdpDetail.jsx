import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ENDPOINT } from "../../constants/endpoint";

import Loading from "../../components/common/Loading";
import Empty from "../../components/common/Empty";

export default function SpdpDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get(`${ENDPOINT.SPDP}/${id}`); // 🔥 FIX
      setData(res.data);
    } catch (err) {
      console.log(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (!data) return <Empty text="Data SPDP tidak ditemukan" />;

  const perkara = data.Perkara;

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";
    if (status === "proses") return "bg-yellow-100 text-yellow-700";
    if (status === "selesai") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-600";
  };

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

      {/* INFO */}
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

      {/* PERKARA */}
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
                <td colSpan="2" className="p-6">
                  <Empty text="Belum ada perkara" />
                </td>
              </tr>
            ) : (
              <tr className="border-t">
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      perkara.status,
                    )}`}
                  >
                    {perkara.status}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => navigate(`/p16/${perkara.id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:scale-105"
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
