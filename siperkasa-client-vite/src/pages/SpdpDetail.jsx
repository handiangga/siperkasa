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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-800">Detail SPDP</h2>

        <button
          onClick={() => navigate("/spdp")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Kembali
        </button>
      </div>

      {/* INFO SPDP */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <p>
          <b>Nomor:</b> {data.nomor_spdp}
        </p>
        <p>
          <b>Tanggal:</b> {data.tanggal_spdp?.split("T")[0]}
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
        <h3 className="p-4 font-semibold text-green-800">Data Perkara</h3>

        <table className="w-full">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">Status</th>
              <th>Jaksa</th>
              <th>Nomor P16</th>
            </tr>
          </thead>

          <tbody>
            {!data.Perkara ? (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  Belum ada perkara
                </td>
              </tr>
            ) : data.Perkara.P16Assignments?.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  Belum ada jaksa ditugaskan
                </td>
              </tr>
            ) : (
              data.Perkara.P16Assignments.map((p16) => (
                <tr key={p16.id} className="text-center border-t">
                  <td>{data.Perkara.status}</td>
                  <td>{p16.Jaksa?.nama}</td>
                  <td>{p16.nomor_p16}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
