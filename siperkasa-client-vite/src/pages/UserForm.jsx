import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function UserForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "operator",
    jaksa_id: "",
  });

  const [jaksaList, setJaksaList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH DATA JAKSA
  useEffect(() => {
    fetchJaksa();
  }, []);

  const fetchJaksa = async () => {
    try {
      const res = await api.get("/jaksas");
      setJaksaList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 VALIDASI
    if (!form.name || !form.email || !form.password) {
      return Swal.fire("Error", "Semua field wajib diisi", "warning");
    }

    if (form.role === "jaksa" && !form.jaksa_id) {
      return Swal.fire("Error", "Jaksa wajib dipilih", "warning");
    }

    setLoading(true);

    try {
      await api.post("/users/register", {
        ...form,
        jaksa_id: form.jaksa_id || null, // 🔥 fix
      });

      Swal.fire("Berhasil", "User berhasil dibuat", "success");

      navigate("/users");
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Gagal membuat user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* CARD */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold text-green-800 mb-6">Tambah User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAMA */}
          <input
            name="name"
            placeholder="Nama"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
          />

          {/* EMAIL */}
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
          />

          {/* PASSWORD */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
          />

          {/* ROLE */}
          <select
            name="role"
            onChange={handleChange}
            value={form.role}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
          >
            <option value="admin">Admin</option>
            <option value="kajari">Kajari</option>
            <option value="operator">Operator</option>
            <option value="jaksa">Jaksa</option>
          </select>

          {/* 🔥 JAKSA (HANYA MUNCUL JIKA ROLE JAKSA) */}
          {form.role === "jaksa" && (
            <select
              name="jaksa_id"
              onChange={handleChange}
              value={form.jaksa_id}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
            >
              <option value="">-- Pilih Jaksa --</option>
              {jaksaList.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nama}
                </option>
              ))}
            </select>
          )}

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 transition font-semibold"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
}
