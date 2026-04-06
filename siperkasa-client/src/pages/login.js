import { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/users/login", {
        email,
        password,
      });

      // simpan token
      localStorage.setItem("access_token", data.access_token);

      alert("Login berhasil!");

      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Login SIPERKASA</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />

        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
