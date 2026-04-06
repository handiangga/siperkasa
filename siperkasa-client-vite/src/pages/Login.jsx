import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔥 AUTO REDIRECT
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined") {
      navigate("/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Email dan password wajib diisi!",
        confirmButtonColor: "#166534",
      });
      return;
    }

    setLoading(true);

    Swal.fire({
      title: "Loading...",
      text: "Sedang login",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await api.post("/users/login", form);

      // ✅ FIX TOKEN
      localStorage.setItem("token", res.data.access_token);

      Swal.close();

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Login berhasil",
        confirmButtonColor: "#166534",
      });

      // ✅ FIX REDIRECT
      navigate("/dashboard");
    } catch (err) {
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Email atau password salah",
        confirmButtonColor: "#166534",
      });

      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="hidden md:flex w-1/2 bg-green-900 text-white items-center justify-center">
        <div className="text-center px-10">
          <img src="/logo.png" alt="logo" className="w-24 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-yellow-400 mb-3">SIPERKASA</h1>
          <p className="text-gray-300">Sistem Informasi Perkara Jaksa</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-green-800">
            Login
          </h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full mb-6 p-3 border rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Loading..." : "Masuk"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            © Kejaksaan Republik Indonesia
          </p>
        </form>
      </div>
    </div>
  );
}
