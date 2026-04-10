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

export default function JaksaPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINT.JAKSA);
      setData(res.data || []);
    } catch (err) {
      console.log(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCount = (item) =>
    item.P16Assignments?.filter((p) => p.peran === "utama").length ?? 0;

  const filtered = data.filter((item) =>
    `${item.nama} ${item.jabatan || ""} ${item.pangkat || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const sorted = [...filtered].sort((a, b) => {
    const aCount = getCount(a);
    const bCount = getCount(b);
    return sort === "desc" ? bCount - aCount : aCount - bCount;
  });

  const totalJaksa = data.length;

  const perkaraIds = new Set();
  data.forEach((j) => {
    j.P16Assignments?.forEach((p) => {
      if (p.peran === "utama") perkaraIds.add(p.perkara_id);
    });
  });
  const totalP16 = perkaraIds.size;

  const topJaksa = [...data].sort((a, b) => getCount(b) - getCount(a))[0];
  const topCount = getCount(topJaksa || {});

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin hapus?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        await api.delete(`${ENDPOINT.JAKSA}/${id}`);
        fetchData();
        Swal.fire("Dihapus!", "Data berhasil dihapus", "success");
      }
    });
  };

  if (loading) return <Loading />;
  if (!data.length) return <Empty text="Belum ada data jaksa" />;

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

      {/* DASHBOARD */}
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

      {/* SEARCH + SORT */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex gap-4">
        <input
          type="text"
          placeholder="🔍 Cari jaksa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
        />

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
              const count = getCount(item);
              const isTop = count === topCount && count > 0;

              return (
                <tr
                  key={item.id}
                  className={`text-center border-t hover:bg-gray-50 ${
                    isTop ? "bg-yellow-50" : ""
                  }`}
                >
                  <td>{i + 1}</td>

                  <td
                    onClick={() => navigate(`/jaksa/${item.id}`)}
                    className="cursor-pointer text-green-700 hover:underline"
                  >
                    {item.nama} {isTop && "🔥"}
                  </td>

                  <td>
                    {item.jabatan || "-"} ({item.pangkat || "-"})
                  </td>

                  <td>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {count}
                    </span>
                  </td>

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
