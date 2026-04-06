import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

export default function JaksaForm() {
  const [form, setForm] = useState({
    nama: "",
    nip: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) fetchDetail();
  }, []);

  const fetchDetail = async () => {
    const res = await api.get(`/jaksas/${id}`);
    setForm(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await api.put(`/jaksas/${id}`, form);
        Swal.fire("Berhasil", "Data diupdate", "success");
      } else {
        await api.post("/jaksas", form);
        Swal.fire("Berhasil", "Data ditambahkan", "success");
      }

      navigate("/jaksa");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-2xl font-bold text-green-800 mb-6">
        {id ? "Edit Jaksa" : "Tambah Jaksa"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
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

        <div className="flex gap-2">
          <button className="bg-green-800 text-white px-4 py-2 rounded">
            Simpan
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