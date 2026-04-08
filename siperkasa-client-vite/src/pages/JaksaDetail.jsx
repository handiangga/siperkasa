import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function JaksaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jaksa, setJaksa] = useState({});
  const [perkara, setPerkara] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 SEARCH & SORT
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const resJaksa = await api.get(`/jaksas/${id}`);
      setJaksa(resJaksa.data);

      const resPerkara = await api.get(`/p16/jaksa/${id}`);
      setPerkara(resPerkara.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 STATUS COLOR
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";
    if (status === "penyidikan") return "bg-yellow-100 text-yellow-700";
    if (status === "penuntutan") return "bg-blue-100 text-blue-700";
    if (status === "selesai") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-600";
  };

  // 🔥 FILTER
  const filterData = (items) => {
    return items.filter((item) =>
      `${item.Perkara?.Spdp?.nomor_spdp} 
       ${item.Perkara?.Spdp?.nama_tersangka} 
       ${item.Perkara?.Spdp?.pasal}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  };

  // 🔥 SORT
  const sortData = (items) => {
    if (sort === "name") {
      return [...items].sort((a, b) =>
        (a.Perkara?.Spdp?.nama_tersangka || "").localeCompare(
          b.Perkara?.Spdp?.nama_tersangka || "",
        ),
      );
    }

    if (sort === "status") {
      return [...items].sort((a, b) =>
        (a.Perkara?.status || "").localeCompare(b.Perkara?.status || ""),
      );
    }

    return items;
  };

  // 🔥 SPLIT DATA
  const utama = perkara.filter((p) => p.peran === "utama");
  const anggota = perkara.filter((p) => p.peran !== "utama");

  // 🔥 TABLE COMPONENT
  const renderTable = (title, items, color = "green") => {
    const finalData = sortData(filterData(items));

    return (
      <div className="bg-white rounded-xl shadow mb-6 overflow-hidden">
        <div
          className={`px-4 py-3 font-semibold text-white ${
            color === "green" ? "bg-green-800" : "bg-gray-700"
          }`}
        >
          {title}
        </div>

        <table className="w-full text-center">
          <thead
            className={`text-white ${
              color === "green" ? "bg-green-700" : "bg-gray-600"
            }`}
          >
            <tr>
              <th className="p-3">No</th>
              <th>Nomor Perkara</th>
              <th>Tersangka</th>
              <th>Pasal</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {finalData.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              finalData.map((item, i) => {
                const status = item.Perkara?.status?.toLowerCase();

                return (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/p16/${item.perkara_id}`)}
                    className="border-t hover:bg-green-50 cursor-pointer transition"
                  >
                    <td>{i + 1}</td>

                    <td className="text-left px-2">
                      {item.Perkara?.Spdp?.nomor_spdp || "-"}
                    </td>

                    <td className="text-left px-2">
                      {item.Perkara?.Spdp?.nama_tersangka || "-"}
                    </td>

                    <td className="text-left px-2">
                      {item.Perkara?.Spdp?.pasal || "-"}
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                          status,
                        )}`}
                      >
                        {status || "-"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Detail Jaksa</h2>

        <button
          onClick={() => navigate("/jaksa")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Kembali
        </button>
      </div>

      {/* INFO */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="grid grid-cols-[180px_1fr] gap-y-3 text-sm">
          <div className="font-semibold text-gray-600">Nama</div>
          <div>{jaksa.nama}</div>

          <div className="font-semibold text-gray-600">NIP</div>
          <div>{jaksa.nip}</div>

          <div className="font-semibold text-gray-600">Jabatan</div>
          <div>{jaksa.jabatan || "-"}</div>

          <div className="font-semibold text-gray-600">Pangkat</div>
          <div>{jaksa.pangkat || "-"}</div>
        </div>

        {/* TOTAL */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-green-50 border p-4 rounded-xl text-center">
            <p className="text-sm text-gray-500">P16 Utama</p>
            <p className="text-2xl font-bold text-green-700">{utama.length}</p>
          </div>

          <div className="bg-gray-100 border p-4 rounded-xl text-center">
            <p className="text-sm text-gray-500">P16 Anggota</p>
            <p className="text-2xl font-bold text-gray-700">{anggota.length}</p>
          </div>
        </div>
      </div>

      {/* SEARCH + SORT */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex gap-3">
        <input
          type="text"
          placeholder="🔍 Cari perkara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-3 border rounded-lg"
        >
          <option value="latest">Terbaru</option>
          <option value="name">Nama</option>
          <option value="status">Status</option>
        </select>
      </div>

      {/* TABLE */}
      {renderTable("Jaksa Utama", utama, "green")}
      {renderTable("Jaksa Anggota", anggota, "gray")}
    </div>
  );
}
