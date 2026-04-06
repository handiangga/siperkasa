import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function DetailPerkara() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [jaksas, setJaksas] = useState([]);
  const [loading, setLoading] = useState(false);

  // form
  const [jaksaId, setJaksaId] = useState("");
  const [peran, setPeran] = useState("anggota");

  // 🔥 fetch detail
  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/perkaras/${id}`);
      setData(res.data.data);
    } catch (err) {
      alert("Gagal ambil detail");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 fetch jaksa list
  const fetchJaksa = async () => {
    try {
      const res = await api.get("/jaksas");
      setJaksas(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 submit P16
  const handleAssign = async (e) => {
    e.preventDefault();

    try {
      await api.post("/p16", {
        perkara_id: id,
        jaksa_id: jaksaId,
        nomor_p16: "AUTO-" + Date.now(),
        tanggal_p16: new Date(),
        peran,
      });

      alert("Jaksa berhasil ditambahkan");

      fetchDetail(); // refresh
    } catch (err) {
      alert("Gagal assign jaksa");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDetail();
    fetchJaksa();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Tidak ada data</p>;

  return (
    <div style={{ padding: "30px" }}>
      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <h1>Detail Perkara</h1>

      <h3>Tersangka: {data.spdp.tersangka}</h3>
      <p>Pasal: {data.spdp.pasal}</p>
      <p>Status: {data.status}</p>

      <hr />

      <h3>Jaksa Utama</h3>
      <p>{data.jaksa_utama?.nama || "-"}</p>

      <h3>Jaksa Anggota</h3>
      <ul>
        {data.jaksa_anggota.map((j, i) => (
          <li key={i}>{j.nama}</li>
        ))}
      </ul>

      <hr />

      {/* 🔥 FORM ASSIGN */}
      <h3>Tambah Jaksa (P16)</h3>

      <form onSubmit={handleAssign}>
        <select
          value={jaksaId}
          onChange={(e) => setJaksaId(e.target.value)}
          required
        >
          <option value="">-- pilih jaksa --</option>
          {jaksas.map((j) => (
            <option key={j.id} value={j.id}>
              {j.nama}
            </option>
          ))}
        </select>

        <br />
        <br />

        <select value={peran} onChange={(e) => setPeran(e.target.value)}>
          <option value="utama">utama</option>
          <option value="anggota">anggota</option>
        </select>

        <br />
        <br />

        <button type="submit">Assign Jaksa</button>
      </form>
    </div>
  );
}
