import { useEffect, useState } from "react";
import api from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { ENDPOINT } from "../../constants/endpoint";

import Loading from "../../components/common/Loading";
import Empty from "../../components/common/Empty";

export default function SpdpPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // 🔥 SORT DEFAULT TERBARU
  const [sort, setSort] = useState("desc");

  const limit = 10;

  const navigate = useNavigate();
  const { isAdmin, isOperator } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINT.SPDP);
      setData(res.data || []);
    } catch (err) {
      console.log(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
  });

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 FILTER
  const filtered = data.filter((item) =>
    `${item.nomor_spdp} ${item.nama_tersangka} ${item.pasal || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // 🔥 SORT BY TANGGAL
  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.tanggal_spdp);
    const dateB = new Date(b.tanggal_spdp);

    return sort === "desc" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(sorted.length / limit);
  const paginatedData = sorted.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin hapus?",
      text: "Data tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await api.delete(`${ENDPOINT.SPDP}/${id}`);

          Toast.fire({
            icon: "success",
            title: "Data berhasil dihapus",
          });

          fetchData();
        } catch (err) {
          Toast.fire({
            icon: "error",
            title: "Gagal menghapus data",
          });
        }
      }
    });
  };

  if (loading) return <Loading />;
  if (!data.length) return <Empty text="Belum ada data SPDP" />;

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Data SPDP</h2>

        <div className="flex gap-2">
          {/* 🔥 SORT BUTTON */}
          <button
            type="button"
            onClick={() => setSort(sort === "desc" ? "asc" : "desc")}
            className="bg-gray-200 p-3 rounded-lg hover:bg-gray-300"
          >
            {sort === "desc" ? <FaSortAmountDown /> : <FaSortAmountUp />}
          </button>

          {(isAdmin || isOperator) && (
            <button
              type="button"
              onClick={() => navigate("/spdp/create")}
              className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900"
            >
              + Tambah SPDP
            </button>
          )}
        </div>
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
        <table className="w-full table-fixed text-center">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3 w-12">No</th>
              <th className="w-56">Nomor</th>
              <th className="w-32">Tanggal</th>
              <th className="w-64">Tersangka</th>
              <th>Pasal</th>
              <th className="w-32">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((item, i) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{(page - 1) * limit + i + 1}</td>

                <td className="px-3 py-2 text-sm break-words">
                  {item.nomor_spdp}
                </td>

                <td className="text-sm">{item.tanggal_spdp?.slice(0, 10)}</td>

                <td className="px-3 py-2 text-sm break-words">
                  {item.nama_tersangka}
                </td>

                <td className="px-3 py-2 text-sm break-words">{item.pasal}</td>

                <td>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/spdp/${item.id}`)}
                      className="bg-blue-500 text-white p-2 rounded hover:scale-110"
                    >
                      <FaEye />
                    </button>

                    {(isAdmin || isOperator) && (
                      <button
                        type="button"
                        onClick={() => navigate(`/spdp/edit/${item.id}`)}
                        className="bg-yellow-400 p-2 rounded hover:scale-110"
                      >
                        <FaEdit />
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white p-2 rounded hover:scale-110"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
