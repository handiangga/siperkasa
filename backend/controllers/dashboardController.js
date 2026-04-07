const { P16Assignment, Perkara, Spdp, Jaksa } = require("../models");

class DashboardController {
  static async getStats(req, res, next) {
    try {
      // 🔥 INI YANG KAMU TANYA
      const { role, jaksa_id } = req.user;

      // 🔥 FILTER P16 BERDASARKAN ROLE
      let whereP16 = {};
      if (role === "jaksa") {
        whereP16.jaksa_id = jaksa_id;
      }

      const p16 = await P16Assignment.findAll({
        where: whereP16,
        include: [
          {
            model: Perkara,
            include: [Spdp],
          },
          {
            model: Jaksa,
          },
        ],
      });

      // 🔥 PERKARA (IKUT FILTER JAKSA)
      let perkara;
      if (role === "jaksa") {
        const perkaraIds = p16.map((p) => p.perkara_id);

        perkara = await Perkara.findAll({
          where: {
            id: perkaraIds,
          },
          include: [Spdp],
        });
      } else {
        perkara = await Perkara.findAll({
          include: [Spdp],
        });
      }

      // 🔥 SPDP
      const spdp = await Spdp.findAll();

      res.json({
        spdp,
        perkara,
        p16,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DashboardController;
