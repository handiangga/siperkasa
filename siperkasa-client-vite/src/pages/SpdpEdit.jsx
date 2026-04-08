import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

export default function SpdpEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nomor_spdp: "",
    tanggal_spdp: "",
    asal_instansi: "",
    nama_tersangka: "",
    pasal: "",
  });

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await api.get(`/spdps/${id}`);

      setForm({
        nomor_spdp: res.data.nomor_spdp || "",
        tanggal_spdp: res.data.tanggal_spdp?.split("T")[0] || "",
        asal_instansi: res.data.asal_instansi || "", // 🔥 FIX
        nama_tersangka: res.data.nama_tersangka || "",
        pasal: res.data.pasal || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // 🔥 AUTO UPPERCASE KHUSUS NAMA
    if (name === "nama_tersangka") {
      newValue = value.toUpperCase();
    }

    setForm({
      ...form,
      [name]: newValue,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 VALIDASI
    if (
      !form.nomor_spdp ||
      !form.tanggal_spdp ||
      !form.asal_instansi ||
      !form.nama_tersangka ||
      !form.pasal
    ) {
      Swal.fire("Oops", "Semua field wajib diisi", "warning");
      return;
    }

    try {
      setLoading(true);

      await api.put(`/spdps/${id}`, {
        nomor_spdp: form.nomor_spdp.trim(),
        tanggal_spdp: form.tanggal_spdp,
        asal_instansi: form.asal_instansi.trim(),
        nama_tersangka: form.nama_tersangka.trim(),
        pasal: form.pasal.trim(),
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data SPDP berhasil diupdate",
      });

      navigate("/spdp");
    } catch (err) {
      console.log(err);

      Swal.fire("Error", "Gagal update data", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Edit SPDP</h2>

        <button
          onClick={() => navigate("/spdp")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Kembali
        </button>
      </div>

      {/* CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NOMOR */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nomor SPDP
            </label>
            <input
              type="text"
              name="nomor_spdp"
              value={form.nomor_spdp}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
            />
          </div>

          {/* TANGGAL */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Tanggal SPDP
            </label>
            <input
              type="date"
              name="tanggal_spdp"
              value={form.tanggal_spdp}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
            />
          </div>

          {/* 🔥 ASAL INSTANSI (WAJIB) */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Asal Instansi
            </label>
            <input
              type="text"
              name="asal_instansi"
              value={form.asal_instansi}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
            />
          </div>

          {/* NAMA */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nama Tersangka
            </label>
            <input
              type="text"
              name="nama_tersangka"
              value={form.nama_tersangka}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
            />
          </div>

          {/* PASAL */}
          <div>
            <label className="block text-sm font-semibold mb-1">Pasal</label>
            <input
              type="text"
              name="pasal"
              value={form.pasal}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}
