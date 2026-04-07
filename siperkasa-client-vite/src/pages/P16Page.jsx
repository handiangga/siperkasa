import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";

export default function P16Page() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.get("/perkaras");
      setData(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getJaksaUtama = (assignments) => {
    if (!assignments) return "-";
    const utama = assignments.find((j) => j.peran === "utama");
    return utama?.Jaksa?.nama || "-";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        Data P16 (Penunjukan Jaksa)
      </h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">No</th>
              <th>No Perkara</th>
              <th>Tersangka</th>
              <th>Pasal</th>
              <th>Jaksa Utama</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, i) => (
              <tr key={item.id} className="text-center border-t">
                <td>{i + 1}</td>
                <td>{item.Spdp?.nomor_spdp}</td>
                <td>{item.Spdp?.nama_tersangka}</td>
                <td>{item.Spdp?.pasal}</td>
                <td>{getJaksaUtama(item.P16Assignments)}</td>
                <td>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                    {item.status}
                  </span>
                </td>

                {/* AKSI */}
                <td className="space-x-2">
                  <button
                    onClick={() => navigate(`/p16/${item.id}`)}
                    className="bg-blue-500 text-white p-2 rounded hover:scale-110 transition"
                  >
                    <FaEye />
                  </button>

                  <button
                    onClick={() => navigate(`/p16/edit/${item.id}`)}
                    className="bg-yellow-400 p-2 rounded hover:scale-110 transition"
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
