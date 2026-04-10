import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

import Card from "../../components/ui/card";
import Box from "../../components/ui/box";

import ChartBulanan from "../../components/dashboard/chartBulanan";
import ChartPerkara from "../../components/dashboard/chartPerkara";
import TopJaksa from "../../components/dashboard/topJaksa";

export default function DashboardKajari() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    spdp: 0,
    perkara: 0,
    aktif: 0,
    selesai: 0,
    p16: 0,
  });

  const [monthly, setMonthly] = useState(Array(12).fill(0));
  const [topJaksa, setTopJaksa] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    fetchData();
  }, [filterMonth]);

  async function fetchData() {
    try {
      const spdpRes = await api.get("/spdp");
      const perkaraRes = await api.get("/perkara");
      const p16Res = await api.get("/p16");

      const spdp = spdpRes.data.data || spdpRes.data;
      const perkara = perkaraRes.data.data || perkaraRes.data;
      const p16 = p16Res.data.data || p16Res.data;

      // 🔥 FILTER BULAN
      const filteredSpdp = filterMonth
        ? spdp.filter(
            (d) =>
              d.tanggal_spdp &&
              new Date(d.tanggal_spdp).getMonth() === Number(filterMonth),
          )
        : spdp;

      const filteredPerkara = perkara.filter((p) =>
        filteredSpdp.some((s) => s.id === p.spdp_id),
      );

      const filteredP16 = filterMonth
        ? p16.filter(
            (p) =>
              p.tanggal_p16 &&
              new Date(p.tanggal_p16).getMonth() === Number(filterMonth),
          )
        : p16;

      const p16Utama = filteredP16.filter((p) => p.peran === "utama");

      // 🔥 KPI
      setStats({
        spdp: filteredSpdp.length,
        perkara: filteredPerkara.length,
        aktif: filteredPerkara.filter((p) => p.status === "penyidikan").length,
        selesai: filteredPerkara.filter((p) => p.status === "selesai").length,
        p16: p16Utama.length,
      });

      // 🔥 CHART BULANAN
      const bulan = Array(12).fill(0);
      filteredSpdp.forEach((d) => {
        if (d.tanggal_spdp) {
          const m = new Date(d.tanggal_spdp).getMonth();
          bulan[m]++;
        }
      });
      setMonthly(bulan);

      // 🔥 TOP JAKSA
      const map = {};

      p16Utama.forEach((item) => {
        const jaksa = item.Jaksa;
        if (!jaksa) return;

        if (!map[jaksa.id]) {
          map[jaksa.id] = {
            id: jaksa.id,
            nama: jaksa.nama,
            total: 0,
          };
        }

        map[jaksa.id].total++;
      });

      const sorted = Object.values(map).sort((a, b) => b.total - a.total);
      setTopJaksa(sorted.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        Dashboard Kajari
      </h2>

      {/* 🔥 FILTER BULAN */}
      <select
        value={filterMonth}
        onChange={(e) => setFilterMonth(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="">Semua Bulan</option>
        {[
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ].map((b, i) => (
          <option key={i} value={i}>
            {b}
          </option>
        ))}
      </select>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card
          title="SPDP"
          value={stats.spdp}
          onClick={() => navigate("/spdp")}
        />
        <Card title="Perkara" value={stats.perkara} />
        <Card title="Aktif" value={stats.aktif} />
        <Card title="Selesai" value={stats.selesai} />
        <Card title="P16" value={stats.p16} onClick={() => navigate("/p16")} />
      </div>

      {/* CHART */}
      <div className="grid md:grid-cols-2 gap-6">
        <Box title="Status Perkara">
          <ChartPerkara data={stats} />
        </Box>

        <Box title="Perkara per Bulan">
          <ChartBulanan data={{ chartBulanan: monthly }} />
        </Box>
      </div>

      {/* TOP JAKSA */}
      <TopJaksa data={topJaksa} navigate={navigate} />
    </div>
  );
}
