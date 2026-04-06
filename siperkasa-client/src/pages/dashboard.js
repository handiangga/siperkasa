import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPerkara = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/perkaras?search=${search}&page=${page}&limit=5`,
      );

      setData(res.data.data.data);
      setTotalPage(res.data.data.total_page);
    } catch (err) {
      alert("Gagal ambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerkara();
  }, [search, page]);

  // 🔥 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      {/* 🔥 HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Dashboard SIPERKASA 🚀</h1>

        <div>
          <button onClick={() => navigate("/jaksas")}>Jaksa</button>
          <button onClick={() => navigate("/spdps")}>SPDP</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <hr />

      {/* 🔍 SEARCH */}
      <input
        placeholder="Cari tersangka..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "300px",
        }}
      />

      {/* 📊 INFO */}
      <h4>Total halaman: {totalPage}</h4>

      {/* ⏳ LOADING */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={cell}>ID</th>
              <th style={cell}>Tersangka</th>
              <th style={cell}>Pasal</th>
              <th style={cell}>Status</th>
              <th style={cell}>Jaksa Utama</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => navigate(`/perkara/${item.id}`)}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f9f9f9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
              >
                <td style={cell}>{item.id}</td>
                <td style={cell}>{item.spdp.tersangka}</td>
                <td style={cell}>{item.spdp.pasal}</td>
                <td style={cell}>{item.status}</td>
                <td style={cell}>{item.jaksa_utama?.nama || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 📄 PAGINATION */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          style={btn}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} / {totalPage}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPage}
          style={btn}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const cell = {
  border: "1px solid #ddd",
  padding: "10px",
};

const btn = {
  padding: "8px 12px",
  margin: "5px",
  cursor: "pointer",
};
