import { useEffect, useState } from "react";
import api from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { FaEdit, FaTrash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { ENDPOINT } from "../../constants/endpoint";

import Loading from "../../components/common/Loading";
import Empty from "../../components/common/Empty";

export default function UserPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users"); // tetap (login pakai ini juga)
      setData(res.data || []);
    } catch (err) {
      console.log(err);
      setData([]);
    } finally {
      setLoading(false);
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

  if (loading) return <Loading />;
  if (!data.length) return <Empty text="Belum ada user" />;

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
        try {
          await api.delete(`/users/${id}`);
          fetchData();

          Swal.fire("Berhasil", "User dihapus", "success");
        } catch (err) {
          Swal.fire("Error", "Gagal hapus user", "error");
        }
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
        <table className="w-full text-center">
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
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>

                <td>
                  <span className="px-3 py-1 rounded bg-gray-200 text-sm capitalize">
                    {item.role}
                  </span>
                </td>

                <td className="space-x-2">
                  <button
                    onClick={() => navigate(`/users/edit/${item.id}`)}
                    className="bg-yellow-400 p-2 rounded hover:scale-110"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white p-2 rounded hover:scale-110"
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
