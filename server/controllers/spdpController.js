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
}

module.exports = SpdpController;
