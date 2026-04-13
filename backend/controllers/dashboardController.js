const { P16Assignment, Perkara, Spdp, Jaksa } = require("../models");

class DashboardController {
  static async fullStats(req, res, next) {
    try {
      const perkara = await Perkara.findAll({
        include: [
          {
            model: Spdp,
            as: "Spdp", // 🔥 WAJIB (SUDAH SESUAI MODEL KAMU)
          },
        ],
      });

      const spdp = await Spdp.findAll();

      const p16 = await P16Assignment.findAll({
        include: [
          {
            model: Jaksa,
            as: "Jaksa",
          },
        ],
      });

      const total = perkara.length;

      const hariIni = new Date();
      hariIni.setHours(0, 0, 0, 0);

      const perkaraBaru = perkara.filter(
        (p) => new Date(p.createdAt) >= hariIni,
      ).length;

      const proses = perkara.filter((p) => p.status === "penyidikan").length;

      const selesai = perkara.filter((p) => p.status === "sidang").length;

      const chartBulanan = Array(12).fill(0);

      spdp.forEach((s) => {
        if (s.tanggal_spdp) {
          const bulan = new Date(s.tanggal_spdp).getMonth();
          chartBulanan[bulan]++;
        }
      });

      const map = {};

      p16.forEach((item) => {
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

      const topJaksa = Object.values(map)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      res.json({
        total,
        perkaraBaru,
        proses,
        selesai,
        chartBulanan,
        topJaksa,
      });
    } catch (err) {
      next(err);
    }
  }

  static async jaksaStats(req, res, next) {
    try {
      const { Jaksa, P16Assignment, Perkara, Spdp } = require("../models");

      const userId = req.user.id;

      // 🔥 1. ambil jaksa dari user
      const jaksa = await Jaksa.findOne({
        where: { user_id: userId },
      });

      if (!jaksa) {
        return res.json({
          total: 0,
          aktif: 0,
          selesai: 0,
          perkara: [],
        });
      }

      // 🔥 2. ambil assignment
      const p16 = await P16Assignment.findAll({
        where: { jaksa_id: jaksa.id },
        include: [
          {
            model: Perkara,
            as: "Perkara", // 🔥 WAJIB (SESUI MODEL)
            include: [
              {
                model: Spdp,
                as: "Spdp", // ⚠️ pastikan ini juga ada di model Perkara
              },
            ],
          },
        ],
      });

      // 🔥 3. mapping perkara
      const perkara = p16.map((item) => item.Perkara).filter(Boolean);

      const total = perkara.length;

      const aktif = perkara.filter(
        (p) => p.status === "penyidikan" || p.status === "proses",
      ).length;

      const selesai = perkara.filter(
        (p) => p.status === "sidang" || p.status === "selesai",
      ).length;

      res.json({
        total,
        aktif,
        selesai,
        perkara,
      });
    } catch (err) {
      console.log("ERROR DASHBOARD JAKSA:", err);
      res.status(500).json({
        message: "Dashboard jaksa error",
        error: err.message,
      });
    }
  }
}

module.exports = DashboardController;
