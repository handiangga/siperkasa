import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { FaEdit, FaTrash } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

export default function UserPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const fetchData = async () => {
    try {
      const res = await api.get("/users");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  // 🔥 BLOCK AKSES
  if (!isAdmin) {
    return (
      <div className="text-center mt-10 text-gray-500">Tidak punya akses</div>
    );
  }

  // 🔍 FILTER
  const filtered = data.filter((item) =>
    `${item.name} ${item.email} ${item.role}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // ❌ DELETE
  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin hapus user?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        await api.delete(`/users/${id}`);
        fetchData();
      }
    });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Manajemen User</h2>

        <button
          onClick={() => navigate("/users/create")}
          className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900"
        >
          + Tambah User
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <input
          type="text"
          placeholder="🔍 Cari user..."
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
              <th>Email</th>
              <th>Role</th>
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
                <td>{item.name}</td>
                <td>{item.email}</td>

                <td>
                  <span className="px-3 py-1 rounded bg-gray-200 text-sm">
                    {item.role}
                  </span>
                </td>

                <td className="space-x-2">
                  {/* ✏️ EDIT */}
                  <button
                    onClick={() => navigate(`/users/edit/${item.id}`)}
                    className="bg-yellow-400 p-2 rounded hover:scale-110 transition"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>

                  {/* 🗑 DELETE */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white p-2 rounded hover:scale-110 transition"
                    title="Hapus"
                  >
                    <FaTrash />
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
