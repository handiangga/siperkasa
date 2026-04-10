import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Swal from "sweetalert2";
import { ENDPOINT } from "../../constants/endpoint";

import Loading from "../../components/common/Loading";

export default function JaksaForm() {
  const [form, setForm] = useState({
    nama: "",
    nip: "",
    jabatan: "",
    pangkat: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${ENDPOINT.JAKSA}/${id}`);
      setForm({
        nama: res.data.nama || "",
        nip: res.data.nip || "",
        jabatan: res.data.jabatan || "",
        pangkat: res.data.pangkat || "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama || !form.nip) {
      Swal.fire("Error", "Nama & NIP wajib diisi", "error");
      return;
    }

    try {
      setLoading(true);

      if (id) {
        await api.put(`${ENDPOINT.JAKSA}/${id}`, form);
        Swal.fire("Berhasil", "Data diupdate", "success");
      } else {
        await api.post(ENDPOINT.JAKSA, form);
        Swal.fire("Berhasil", "Data ditambahkan", "success");
      }

      navigate("/jaksa");
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Gagal menyimpan data", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) return <Loading />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        {id ? "Edit Jaksa" : "Tambah Jaksa"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md bg-white p-6 rounded-xl shadow"
      >
        <input
          name="nama"
          placeholder="Nama Jaksa"
          value={form.nama}
          onChange={handleChange}
          className="p-3 border rounded w-full"
        />

        <input
          name="nip"
          placeholder="NIP"
          value={form.nip}
          onChange={handleChange}
          className="p-3 border rounded w-full"
        />

        <input
          name="jabatan"
          placeholder="Jabatan"
          value={form.jabatan}
          onChange={handleChange}
          className="p-3 border rounded w-full"
        />

        <input
          name="pangkat"
          placeholder="Pangkat"
          value={form.pangkat}
          onChange={handleChange}
          className="p-3 border rounded w-full"
        />

        <div className="flex gap-2">
          <button
            disabled={loading}
            className="bg-green-800 text-white px-4 py-2 rounded"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/jaksa")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
