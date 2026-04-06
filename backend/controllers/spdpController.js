const { Spdp, Perkara } = require("../models");

class SpdpController {
  static async create(req, res, next) {
    try {
      const { nomor_spdp, tanggal_spdp, asal_instansi, nama_tersangka, pasal } =
        req.body;

      // 🔥 1. buat SPDP
      const spdp = await Spdp.create({
        nomor_spdp,
        tanggal_spdp,
        asal_instansi,
        nama_tersangka,
        pasal,
        created_by: req.user.id,
      });

      // 🔥 2. otomatis buat Perkara
      const perkara = await Perkara.create({
        spdp_id: spdp.id,
        status: "penyidikan",
        created_by: req.user.id,
      });

      res.status(201).json({
        message: "SPDP & Perkara berhasil dibuat",
        spdp,
        perkara,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req, res, next) {
    try {
      const data = await Spdp.findAll();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  // 🔍 DETAIL SPDP
  static async getById(req, res, next) {
    try {
      const { id } = req.params;

      const data = await Spdp.findByPk(id, {
        include: [
          {
            model: require("../models").Perkara,
            include: [
              {
                model: require("../models").P16Assignment,
                include: ["Jaksa"],
              },
            ],
          },
        ],
      });

      if (!data) {
        throw { name: "Not Found", message: "SPDP tidak ditemukan" };
      }

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SpdpController;
