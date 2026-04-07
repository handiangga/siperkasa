import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";

export default function JaksaPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");

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
    `${item.nama} ${item.jabatan || ""} ${item.pangkat || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // 🔥 SORT
  const sorted = [...filtered].sort((a, b) => {
    const aCount = a.p16_count ?? a.P16Assignments?.length ?? 0;
    const bCount = b.p16_count ?? b.P16Assignments?.length ?? 0;
    return sort === "desc" ? bCount - aCount : aCount - bCount;
  });

  // 🔥 DASHBOARD DATA
  const totalJaksa = data.length;
  const totalP16 = data.reduce(
    (acc, j) => acc + (j.p16_count ?? j.P16Assignments?.length ?? 0),
    0,
  );

  const topJaksa = [...data].sort((a, b) => {
    const aCount = a.p16_count ?? a.P16Assignments?.length ?? 0;
    const bCount = b.p16_count ?? b.P16Assignments?.length ?? 0;
    return bCount - aCount;
  })[0];

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
        Swal.fire("Dihapus!", "Data berhasil dihapus", "success");
      }
    });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Data Jaksa</h2>

        {isAdmin && (
          <button
            onClick={() => navigate("/jaksa/create")}
            className="bg-green-800 text-white px-4 py-2 rounded-lg"
          >
            + Tambah Jaksa
          </button>
        )}
      </div>

      {/* 🔥 DASHBOARD */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Total Jaksa</p>
          <h3 className="text-2xl font-bold text-green-700">{totalJaksa}</h3>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Total P16</p>
          <h3 className="text-2xl font-bold text-blue-700">{totalP16}</h3>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Top Jaksa</p>
          <h3 className="text-lg font-bold text-yellow-600">
            {topJaksa?.nama || "-"}
          </h3>
        </div>
      </div>

      {/* SEARCH + SORT ICON */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="🔍 Cari jaksa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none mr-4"
        />

        {/* 🔥 SORT ICON */}
        <button
          onClick={() => setSort(sort === "desc" ? "asc" : "desc")}
          className="bg-gray-200 p-3 rounded-lg hover:bg-gray-300"
        >
          {sort === "desc" ? <FaSortAmountDown /> : <FaSortAmountUp />}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">No</th>
              <th>Nama</th>
              <th>Jabatan / Pangkat</th>
              <th>Jumlah P16</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((item, i) => {
              const count = item.p16_count ?? item.P16Assignments?.length ?? 0;

              const isTop =
                count ===
                (topJaksa?.p16_count ?? topJaksa?.P16Assignments?.length ?? 0);

              return (
                <tr
                  key={item.id}
                  className={`text-center border-t hover:bg-gray-50 ${
                    isTop ? "bg-yellow-50" : ""
                  }`}
                >
                  <td>{i + 1}</td>

                  {/* NAMA */}
                  <td
                    onClick={() => navigate(`/jaksa/${item.id}`)}
                    className="cursor-pointer text-green-700 hover:underline"
                  >
                    {item.nama}
                    {isTop && " 🔥"}
                  </td>

                  {/* JABATAN */}
                  <td>
                    {item.jabatan || "-"} ({item.pangkat || "-"})
                  </td>

                  {/* JUMLAH */}
                  <td>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {count}
                    </span>
                  </td>

                  {/* AKSI */}
                  <td className="space-x-2">
                    <button
                      onClick={() => navigate(`/jaksa/${item.id}`)}
                      className="bg-blue-500 text-white p-2 rounded hover:scale-110"
                    >
                      <FaEye />
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => navigate(`/jaksa/edit/${item.id}`)}
                        className="bg-yellow-400 p-2 rounded hover:scale-110"
                      >
                        <FaEdit />
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white p-2 rounded hover:scale-110"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
