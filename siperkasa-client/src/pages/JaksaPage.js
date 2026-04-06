import { useEffect, useState } from "react";
import api from "../services/api";

export default function JaksaPage() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    nip: "",
    jabatan: "",
    pangkat: "",
  });
  const [editId, setEditId] = useState(null);

  const fetchJaksa = async () => {
    try {
      const res = await api.get("/jaksas");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchJaksa();
  }, []);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/jaksas/${editId}`, form);
        alert("Update berhasil");
      } else {
        await api.post("/jaksas", form);
        alert("Tambah berhasil");
      }

      setForm({ nama: "", nip: "", jabatan: "", pangkat: "" });
      setEditId(null);
      fetchJaksa();
    } catch (err) {
      alert("Gagal");
    }
  };

  // 🔥 EDIT
  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus?")) return;

    try {
      await api.delete(`/jaksas/${id}`);
      alert("Hapus berhasil");
      fetchJaksa();
    } catch (err) {
      alert("Gagal hapus");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Data Jaksa</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input name="nama" value={form.nama} onChange={handleChange} placeholder="Nama" />
        <br /><br />

        <input name="nip" value={form.nip} onChange={handleChange} placeholder="NIP" />
        <br /><br />

        <input name="jabatan" value={form.jabatan} onChange={handleChange} placeholder="Jabatan" />
        <br /><br />

        <input name="pangkat" value={form.pangkat} onChange={handleChange} placeholder="Pangkat" />
        <br /><br />

        <button type="submit">
          {editId ? "Update" : "Tambah"}
        </button>
      </form>

      <hr />

      {/* TABLE */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>NIP</th>
            <th>Jabatan</th>
            <th>Pangkat</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((j) => (
            <tr key={j.id}>
              <td>{j.id}</td>
              <td>{j.nama}</td>
              <td>{j.nip}</td>
              <td>{j.jabatan}</td>
              <td>{j.pangkat}</td>
              <td>
                <button onClick={() => handleEdit(j)}>Edit</button>
                <button onClick={() => handleDelete(j.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}