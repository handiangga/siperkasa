import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

export default function P16EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [timJaksa, setTimJaksa] = useState([]);
  const [jaksaList, setJaksaList] = useState([]);
  const [perkara, setPerkara] = useState(null);
  const [status, setStatus] = useState("penyidikan");
  const [loading, setLoading] = useState(false);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const [p16Res, jaksaRes] = await Promise.all([
        api.get(`/p16/perkara/${id}`),
        api.get("/jaksas"),
      ]);

      setJaksaList(jaksaRes.data);

      if (p16Res.data.length > 0) {
        // ✅ kalau sudah ada P16
        setPerkara(p16Res.data[0].Perkara);

        setTimJaksa(
          p16Res.data.map((j) => ({
            jaksa_id: j.jaksa_id,
            peran: j.peran,
          }))
        );
      } else {
        // 🔥 FIX: ambil data perkara langsung
        const perkaraRes = await api.get(`/perkaras/${id}`);
        setPerkara(perkaraRes.data);

        // 🔥 kasih 1 slot kosong biar langsung bisa pilih
        setTimJaksa([{ jaksa_id: "", peran: "utama" }]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= TAMBAH JAKSA =================
  const addJaksa = () => {
    setTimJaksa([...timJaksa, { jaksa_id: "", peran: "anggota" }]);
  };

  // ================= UPDATE =================
  const updateJaksa = (index, field, value) => {
    const newData = [...timJaksa];
    newData[index][field] = value;
    setTimJaksa(newData);
  };

  // ================= DELETE =================
  const handleDeleteJaksa = (index) => {
    Swal.fire({
      title: "Yakin hapus jaksa?",
      icon: "warning",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        setTimJaksa((prev) => prev.filter((_, i) => i !== index));
      }
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      const utamaCount = timJaksa.filter((j) => j.peran === "utama").length;

      if (utamaCount !== 1) {
        Swal.fire("Error", "Harus ada 1 jaksa utama", "error");
        return;
      }

      setLoading(true);

      await api.put(`/p16/${id}`, {
        jaksa_list: timJaksa,
      });

      await api.patch(`/perkaras/status/${id}`, {
        status,
      });

      Swal.fire("Berhasil", "P16 berhasil diupdate", "success");
      navigate("/p16");
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Gagal update", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!perkara) return <div className="p-6">Loading...</div>;

  const spdp = perkara?.Spdp;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-800">Edit P16</h2>

        <button
          onClick={() => navigate("/p16")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Kembali
        </button>
      </div>

      {/* 🔥 INFO SPDP (INI YANG KAMU MAU) */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <p>
          <strong>No Perkara:</strong> {spdp?.nomor_spdp || "-"}
        </p>
        <p>
          <strong>Tersangka:</strong> {spdp?.nama_tersangka || "-"}
        </p>
        <p>
          <strong>Pasal:</strong> {spdp?.pasal || "-"}
        </p>
      </div>

      {/* STATUS */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <label className="block mb-2 font-semibold">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="penyidikan">Penyidikan</option>
          <option value="penuntutan">Penuntutan</option>
          <option value="selesai">Selesai</option>
        </select>
      </div>

      {/* TIM JAKSA */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="font-bold mb-4">Tim Jaksa</h3>

        {timJaksa.map((j, i) => (
          <div key={i} className="flex gap-2 mb-3">
            <select
              className="border p-2 w-full rounded"
              value={j.jaksa_id}
              onChange={(e) => updateJaksa(i, "jaksa_id", e.target.value)}
            >
              <option value="">Pilih Jaksa</option>
              {jaksaList.map((jk) => (
                <option
                  key={jk.id}
                  value={jk.id}
                  disabled={timJaksa.some(
                    (t, idx) => t.jaksa_id == jk.id && idx !== i
                  )}
                >
                  {jk.nama}
                </option>
              ))}
            </select>

            <select
              value={j.peran}
              onChange={(e) => updateJaksa(i, "peran", e.target.value)}
              className="border p-2 rounded"
            >
              <option value="utama">Utama</option>
              <option value="anggota">Anggota</option>
            </select>

            <button
              onClick={() => handleDeleteJaksa(i)}
              className="bg-red-500 text-white px-3 rounded"
            >
              X
            </button>
          </div>
        ))}

        <button
          onClick={addJaksa}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Tambah Jaksa
        </button>

        {!timJaksa.some((j) => j.peran === "utama") && (
          <p className="text-red-500 text-sm mt-2">
            Harus ada 1 jaksa utama
          </p>
        )}
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-700 text-white px-6 py-2 rounded"
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </div>
  );
}