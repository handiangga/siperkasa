const { Jaksa, P16Assignment } = require("../models");

class JaksaController {
  // 🔍 GET SEMUA JAKSA

  static async getAll(req, res, next) {
    try {
      const data = await Jaksa.findAll({
        include: [
          {
            model: P16Assignment,
          },
        ],
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  // ➕ TAMBAH JAKSA
  static async create(req, res, next) {
    try {
      const { nama, nip, jabatan, pangkat } = req.body;

      const data = await Jaksa.create({
        nama,
        nip,
        jabatan,
        pangkat,
      });

      res.status(201).json({
        message: "Jaksa berhasil dibuat",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  // 🔍 DETAIL JAKSA (optional tapi bagus)
  static async getById(req, res, next) {
    try {
      const { id } = req.params;

      const data = await Jaksa.findByPk(id);

      if (!data) {
        throw { name: "Not Found", message: "Jaksa tidak ditemukan" };
      }

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  // ✏️ UPDATE JAKSA (optional)
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nama, nip, jabatan, pangkat } = req.body;

      const data = await Jaksa.findByPk(id);

      if (!data) {
        throw { name: "Not Found", message: "Jaksa tidak ditemukan" };
      }

      await data.update({ nama, nip, jabatan, pangkat });

      res.status(200).json({
        message: "Jaksa berhasil diupdate",
      });
    } catch (err) {
      next(err);
    }
  }

  // ❌ DELETE JAKSA (optional)
  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const data = await Jaksa.findByPk(id);

      if (!data) {
        throw { name: "Not Found", message: "Jaksa tidak ditemukan" };
      }

      await data.destroy();

      res.status(200).json({
        message: "Jaksa berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = JaksaController;
