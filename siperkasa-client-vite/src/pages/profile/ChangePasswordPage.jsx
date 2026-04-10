import { useState } from "react";
import api from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 VALIDASI FE
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      return Swal.fire("Error", "Semua field wajib diisi", "error");
    }

    if (form.newPassword.length < 5) {
      return Swal.fire("Error", "Password minimal 5 karakter", "error");
    }

    if (form.newPassword !== form.confirmPassword) {
      return Swal.fire("Error", "Konfirmasi password tidak sama", "error");
    }

    try {
      await api.patch("/users/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Password berhasil diubah, silakan login ulang",
      }).then(() => {
        localStorage.removeItem("access_token");
        navigate("/");
      });
    } catch (err) {
      const message = err.response?.data?.message || "Gagal ubah password";

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: message,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold text-green-800 mb-4">Ganti Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          name="oldPassword"
          placeholder="Password Lama"
          value={form.oldPassword}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="Password Baru"
          value={form.newPassword}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Konfirmasi Password Baru"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <button className="w-full bg-green-800 text-white py-2 rounded-lg hover:bg-green-900">
          Simpan
        </button>
      </form>
    </div>
  );
}
