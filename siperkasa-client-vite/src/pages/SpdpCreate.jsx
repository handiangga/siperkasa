import { useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function SpdpCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nomor_spdp: "",
    tanggal_spdp: "",
    nama_tersangka: "",
    pasal: "",
  });

  const [errors, setErrors] = useState({});

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // realtime validation clear
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // 🔥 VALIDASI
  const validate = () => {
    let err = {};

    if (!form.nomor_spdp) err.nomor_spdp = "Nomor wajib diisi";
    if (!form.tanggal_spdp) err.tanggal_spdp = "Tanggal wajib diisi";
    if (!form.nama_tersangka) err.nama_tersangka = "Tersangka wajib diisi";
    if (!form.pasal) err.pasal = "Pasal wajib diisi";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    Swal.fire({
      title: "Menyimpan...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await api.post("/spdps", form);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "SPDP berhasil ditambahkan",
        confirmButtonColor: "#166534",
      });

      navigate("/spdp");
    } catch (err) {
      Swal.fire("Error", "Gagal menyimpan", "error");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10 px-4">
      <div className="w-full max-w-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">Tambah SPDP</h2>

          <button
            onClick={() => navigate("/spdp")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Kembali
          </button>
        </div>

        {/* CARD FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-lg space-y-5 transition-all duration-300"
        >
          {/* NOMOR */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Nomor SPDP</label>
            <input
              name="nomor_spdp"
              value={form.nomor_spdp}
              onChange={handleChange}
              className={`p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none transition ${
                errors.nomor_spdp ? "border-red-500" : ""
              }`}
            />
            {errors.nomor_spdp && (
              <span className="text-red-500 text-sm mt-1">
                {errors.nomor_spdp}
              </span>
            )}
          </div>

          {/* TANGGAL */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Tanggal SPDP</label>
            <input
              type="date"
              name="tanggal_spdp"
              value={form.tanggal_spdp}
              onChange={handleChange}
              className={`p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none transition ${
                errors.tanggal_spdp ? "border-red-500" : ""
              }`}
            />
            {errors.tanggal_spdp && (
              <span className="text-red-500 text-sm mt-1">
                {errors.tanggal_spdp}
              </span>
            )}
          </div>

          {/* TERSANGKA */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Nama Tersangka</label>
            <input
              name="nama_tersangka"
              value={form.nama_tersangka}
              onChange={handleChange}
              className={`p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none transition ${
                errors.nama_tersangka ? "border-red-500" : ""
              }`}
            />
            {errors.nama_tersangka && (
              <span className="text-red-500 text-sm mt-1">
                {errors.nama_tersangka}
              </span>
            )}
          </div>

          {/* PASAL */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Pasal</label>
            <input
              name="pasal"
              value={form.pasal}
              onChange={handleChange}
              className={`p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none transition ${
                errors.pasal ? "border-red-500" : ""
              }`}
            />
            {errors.pasal && (
              <span className="text-red-500 text-sm mt-1">{errors.pasal}</span>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition"
          >
            Simpan
          </button>
        </form>
      </div>
    </div>
  );
}
