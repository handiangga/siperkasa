import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

export default function P16Page() {
  const navigate = useNavigate();
  const { isAdmin, isOperator } = useAuth();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  // 🔥 FETCH DATA
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

  // 🔍 FILTER
  const filtered = data.filter((item) =>
    `${item.Spdp?.nomor_spdp} ${item.Spdp?.nama_tersangka} ${item.Spdp?.pasal} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // 🔥 PAGINATION
  const totalPages = Math.ceil(filtered.length / limit);

  const paginatedData = filtered.slice((page - 1) * limit, page * limit);

  // 🔁 RESET PAGE SAAT SEARCH
  useEffect(() => {
    setPage(1);
  }, [search]);

  // 🔥 AMBIL JAKSA UTAMA
  const getJaksaUtama = (assignments) => {
    if (!assignments) return "-";
    const utama = assignments.find((j) => j.peran === "utama");
    return utama?.Jaksa?.nama || "-";
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Data P16</h2>

        {(isAdmin || isOperator) && (
          <button
            onClick={() => navigate("/p16/create")}
            className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900"
          >
            + Tambah P16
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <input
          type="text"
          placeholder="🔍 Cari perkara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full table-fixed text-center">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3 w-12">No</th>
              <th className="w-56">No Perkara</th>
              <th className="w-64">Tersangka</th>
              <th>Pasal</th>
              <th className="w-48">Jaksa Utama</th>
              <th className="w-32">Status</th>
              <th className="w-32">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              paginatedData.map((item, i) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{(page - 1) * limit + i + 1}</td>

                  <td className="px-3 py-2 text-sm break-words">
                    {item.Spdp?.nomor_spdp}
                  </td>

                  <td className="px-3 py-2 text-sm break-words">
                    {item.Spdp?.nama_tersangka}
                  </td>

                  <td className="px-3 py-2 text-sm break-words">
                    {item.Spdp?.pasal}
                  </td>

                  <td className="text-sm">
                    {getJaksaUtama(item.P16Assignments)}
                  </td>

                  <td>
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/p16/${item.id}`)}
                        className="bg-blue-500 text-white p-2 rounded hover:scale-110 transition"
                      >
                        <FaEye />
                      </button>

                      {(isAdmin || isOperator) && (
                        <button
                          onClick={() => navigate(`/p16/edit/${item.id}`)}
                          className="bg-yellow-400 p-2 rounded hover:scale-110 transition"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        {/* PREV */}
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {/* ANGKA */}
        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;

          return (
            <button
              key={i}
              onClick={() => setPage(pageNumber)}
              className={`px-3 py-1 rounded ${
                page === pageNumber ? "bg-green-800 text-white" : "bg-gray-200"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* NEXT */}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* INFO */}
      <p className="text-center text-sm text-gray-500 mt-2">
        Total data: {filtered.length}
      </p>
    </div>
  );
}
