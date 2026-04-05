const { P16Assignment, Perkara, Jaksa } = require("../models");

class P16Controller {
  // ➕ CREATE P16 (tunjuk jaksa)
  static async create(req, res, next) {
    try {
      const { perkara_id, jaksa_id, nomor_p16, tanggal_p16, peran } = req.body;

      // 🔥 validasi perkara ada
      const perkara = await Perkara.findByPk(perkara_id);
      if (!perkara) {
        throw { name: "Not Found", message: "Perkara tidak ditemukan" };
      }

      // 🔥 validasi jaksa ada
      const jaksa = await Jaksa.findByPk(jaksa_id);
      if (!jaksa) {
        throw { name: "Not Found", message: "Jaksa tidak ditemukan" };
      }

      // 🔥 validasi 1 jaksa utama
      if (peran === "utama") {
        const existing = await P16Assignment.findOne({
          where: {
            perkara_id,
            peran: "utama",
          },
        });

        if (existing) {
          throw {
            name: "Forbidden",
            message: "Jaksa utama sudah ada",
          };
        }
      }

      // 🔥 create data
      const data = await P16Assignment.create({
        perkara_id,
        jaksa_id,
        nomor_p16,
        tanggal_p16,
        peran,
        created_by: req.user.id,
      });

      res.status(201).json({
        message: "P16 berhasil dibuat",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  // 🔍 GET SEMUA P16
  static async getAll(req, res, next) {
    try {
      const data = await P16Assignment.findAll({
        include: [Perkara, Jaksa],
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  // 🔍 DETAIL P16
  static async getById(req, res, next) {
    try {
      const { id } = req.params;

      const data = await P16Assignment.findByPk(id, {
        include: [Perkara, Jaksa],
      });

      if (!data) {
        throw { name: "Not Found", message: "Data P16 tidak ditemukan" };
      }

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  // ❌ DELETE P16 (optional)
  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const data = await P16Assignment.findByPk(id);

      if (!data) {
        throw { name: "Not Found", message: "Data tidak ditemukan" };
      }

      await data.destroy();

      res.status(200).json({
        message: "P16 berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = P16Controller;
