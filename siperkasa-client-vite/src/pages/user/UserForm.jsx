import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Swal from "sweetalert2";

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "operator",
  });

  const [loading, setLoading] = useState(false);

  // 🔥 FETCH DETAIL (EDIT)
  const fetchDetail = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      const data = res.data;

      setForm({
        name: data.name || "",
        email: data.email || "",
        password: "",
        role: data.role || "operator",
      });
    } catch (err) {
      Swal.fire("Error", "User tidak ditemukan", "error");
      navigate("/users");
    }
  };

  useEffect(() => {
    if (isEdit) fetchDetail();
  }, [id]);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEdit) {
        await api.put(`/users/${id}`, form);
        Swal.fire("Berhasil", "User berhasil diupdate", "success");
      } else {
        await api.post("/users/register", form);
        Swal.fire("Berhasil", "User berhasil ditambahkan", "success");
      }

      navigate("/users");
    } catch (err) {
      Swal.fire("Error", "Gagal simpan user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-green-800">
        {isEdit ? "Edit User" : "Tambah User"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama"
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 border rounded-lg"
          required
        />

        {/* 🔥 PASSWORD (optional kalau edit) */}
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder={
            isEdit ? "Kosongkan Password jika tidak diubah" : "Password"
          }
          className="w-full p-3 border rounded-lg"
          required={!isEdit}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        >
          <option value="admin">Admin</option>
          <option value="kajari">Kajari</option>
          <option value="operator">Operator</option>
          <option value="jaksa">Jaksa</option>
        </select>

        <button
          disabled={loading}
          className="w-full bg-green-800 text-white p-3 rounded-lg"
        >
          {loading ? "Loading..." : isEdit ? "Update" : "Simpan"}
        </button>
      </form>
    </div>
  );
}
