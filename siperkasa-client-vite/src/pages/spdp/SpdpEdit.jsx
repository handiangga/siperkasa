import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Swal from "sweetalert2";
import { ENDPOINT } from "../../constants/endpoint";

import Loading from "../../components/common/Loading";

export default function SpdpEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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
      setFetching(true);

      const res = await api.get(`${ENDPOINT.SPDP}/${id}`); // 🔥 FIX

      setForm({
        nomor_spdp: res.data.nomor_spdp || "",
        tanggal_spdp: res.data.tanggal_spdp?.split("T")[0] || "",
        asal_instansi: res.data.asal_instansi || "",
        nama_tersangka: res.data.nama_tersangka || "",
        pasal: res.data.pasal || "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

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

      await api.put(`${ENDPOINT.SPDP}/${id}`, {
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

  if (fetching) return <Loading />;

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

      {/* FORM */}
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="nomor_spdp"
            placeholder="Nomor SPDP"
            value={form.nomor_spdp}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="date"
            name="tanggal_spdp"
            value={form.tanggal_spdp}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            name="asal_instansi"
            placeholder="Asal Instansi"
            value={form.asal_instansi}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            name="nama_tersangka"
            placeholder="Nama Tersangka"
            value={form.nama_tersangka}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            name="pasal"
            placeholder="Pasal"
            value={form.pasal}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white py-3 rounded-lg"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}
