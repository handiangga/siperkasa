import { useEffect, useState } from "react";
import api from "../services/api";

export default function SpdpPage() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    nomor_spdp: "",
    tanggal_spdp: "",
    asal_instansi: "",
    nama_tersangka: "",
    pasal: "",
  });

  const [editId, setEditId] = useState(null);

  // 🔥 FETCH
  const fetchSpdp = async () => {
    try {
      const res = await api.get("/spdps");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSpdp();
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
        await api.put(`/spdps/${editId}`, form);
        alert("Update berhasil");
      } else {
        await api.post("/spdps", form);
        alert("Tambah berhasil");
      }

      setForm({
        nomor_spdp: "",
        tanggal_spdp: "",
        asal_instansi: "",
        nama_tersangka: "",
        pasal: "",
      });

      setEditId(null);
      fetchSpdp();
    } catch (err) {
      alert("Gagal");
    }
  };

  // 🔥 EDIT
  const handleEdit = (item) => {
    setForm({
      ...item,
      tanggal_spdp: item.tanggal_spdp?.split("T")[0], // fix format date
    });
    setEditId(item.id);
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus?")) return;

    try {
      await api.delete(`/spdps/${id}`);
      alert("Hapus berhasil");
      fetchSpdp();
    } catch (err) {
      alert("Gagal hapus");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Data SPDP</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          name="nomor_spdp"
          value={form.nomor_spdp}
          onChange={handleChange}
          placeholder="Nomor SPDP"
        />
        <br />
        <br />

        <input
          type="date"
          name="tanggal_spdp"
          value={form.tanggal_spdp}
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          name="asal_instansi"
          value={form.asal_instansi}
          onChange={handleChange}
          placeholder="Asal Instansi"
        />
        <br />
        <br />

        <input
          name="nama_tersangka"
          value={form.nama_tersangka}
          onChange={handleChange}
          placeholder="Nama Tersangka"
        />
        <br />
        <br />

        <input
          name="pasal"
          value={form.pasal}
          onChange={handleChange}
          placeholder="Pasal"
        />
        <br />
        <br />

        <button type="submit">{editId ? "Update" : "Tambah"}</button>
      </form>

      <hr />

      {/* TABLE */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nomor</th>
            <th>Tanggal</th>
            <th>Instansi</th>
            <th>Tersangka</th>
            <th>Pasal</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.nomor_spdp}</td>
              <td>{s.tanggal_spdp?.split("T")[0]}</td>
              <td>{s.asal_instansi}</td>
              <td>{s.nama_tersangka}</td>
              <td>{s.pasal}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
