import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

export default function SpdpPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const { isAdmin, isOperator } = useAuth();

  const fetchData = async () => {
    try {
      const res = await api.get("/spdps");
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
    `${item.nomor_spdp} ${item.nama_tersangka} ${item.pasal}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // ❌ DELETE
  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin hapus?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        await api.delete(`/spdps/${id}`);
        fetchData();
      }
    });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Data SPDP</h2>

        {/* 🔥 TOMBOL TAMBAH (ROLE BASED) */}
        {(isAdmin || isOperator) && (
          <button
            onClick={() => navigate("/spdp/create")}
            className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900"
          >
            + Tambah SPDP
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <input
          type="text"
          placeholder="🔍 Cari semua data SPDP..."
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
              <th>Nomor</th>
              <th>Tanggal</th>
              <th>Tersangka</th>
              <th>Pasal</th>
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
                <td>{item.nomor_spdp}</td>
                <td>{item.tanggal_spdp?.slice(0, 10)}</td>
                <td>{item.nama_tersangka}</td>
                <td>{item.pasal}</td>

                <td className="space-x-2">
                  {/* 👁 DETAIL (SEMUA BOLEH) */}
                  <button
                    onClick={() => navigate(`/spdp/${item.id}`)}
                    className="bg-blue-500 text-white p-2 rounded hover:scale-110 transition"
                    title="Detail"
                  >
                    <FaEye />
                  </button>

                  {/* ✏️ EDIT (ADMIN & OPERATOR) */}
                  {(isAdmin || isOperator) && (
                    <button
                      onClick={() => navigate(`/spdp/edit/${item.id}`)}
                      className="bg-yellow-400 p-2 rounded hover:scale-110 transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                  )}

                  {/* 🗑 DELETE (ADMIN ONLY) */}
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
