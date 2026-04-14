const { P16Assignment, Perkara, Spdp, Jaksa, User } = require("../models");

class DashboardController {
  // =========================
  // 🔥 DASHBOARD ADMIN / KAJARI
  // =========================
  static async fullStats(req, res, next) {
    try {
      const perkara = await Perkara.findAll({
        include: [
          {
            model: Spdp,
            as: "Spdp",
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

  // =========================
  // 🔥 DASHBOARD JAKSA (FIX + PERAN)
  // =========================
  static async jaksaStats(req, res, next) {
    try {
      // 🔥 ambil user
      const user = await User.findByPk(req.user.id);

      if (!user || !user.jaksa_id) {
        throw { name: "Forbidden", message: "Tidak punya akses" };
      }

      const jaksa_id = user.jaksa_id;

      // 🔥 ambil P16 + perkara + spdp
      const p16 = await P16Assignment.findAll({
        where: { jaksa_id },
        include: [
          {
            model: Perkara,
            as: "Perkara",
            include: [
              {
                model: Spdp,
                as: "Spdp",
              },
            ],
          },
        ],
      });

      // 🔥 inject peran ke perkara
      const perkara = p16
        .map((p) => {
          if (!p.Perkara) return null;

          return {
            ...p.Perkara.toJSON(),
            peran: p.peran, // 🔥 INI YANG DIPAKAI DI FE
          };
        })
        .filter(Boolean);

      const total = perkara.length;

      const aktif = perkara.filter((p) => p.status === "penyidikan").length;

      const selesai = perkara.filter((p) => p.status === "sidang").length;

      res.json({
        total,
        aktif,
        selesai,
        perkara,
      });
    } catch (err) {
      console.log("ERROR JAKSA:", err);
      next(err);
    }
  }
}

module.exports = DashboardController;
