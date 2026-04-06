import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

export default function JaksaPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const fetchData = async () => {
    try {
      const res = await api.get("/jaksas");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔍 FILTER
  const filtered = data.filter((item) =>
    `${item.nama} ${item.nip}`.toLowerCase().includes(search.toLowerCase()),
  );

  // ❌ DELETE
  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin hapus?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        await api.delete(`/jaksas/${id}`);
        fetchData();
      }
    });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Data Jaksa</h2>

        {/* 🔥 HANYA ADMIN */}
        {isAdmin && (
          <button
            onClick={() => navigate("/jaksa/create")}
            className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900"
          >
            + Tambah Jaksa
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <input
          type="text"
          placeholder="🔍 Cari jaksa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">No</th>
              <th>Nama</th>
              <th>NIP</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item, i) => (
              <tr
                key={item.id}
                className="text-center border-t hover:bg-gray-50"
              >
                <td>{i + 1}</td>

                <td
                  onClick={() => navigate(`/jaksa/${item.id}`)}
                  className="cursor-pointer text-green-700 hover:underline"
                >
                  {item.nama}
                </td>

                <td>{item.nip}</td>

                <td className="space-x-2">
                  {/* 👁 DETAIL */}
                  <button
                    onClick={() => navigate(`/jaksa/${item.id}`)}
                    className="bg-blue-500 text-white p-2 rounded hover:scale-110 transition"
                    title="Detail"
                  >
                    <FaEye />
                  </button>

                  {/* ✏️ EDIT (ADMIN) */}
                  {isAdmin && (
                    <button
                      onClick={() => navigate(`/jaksa/edit/${item.id}`)}
                      className="bg-yellow-400 p-2 rounded hover:scale-110 transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                  )}

                  {/* 🗑 DELETE (ADMIN) */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white p-2 rounded hover:scale-110 transition"
                      title="Hapus"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
