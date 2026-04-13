const { Spdp, Perkara } = require("../models");

class SpdpController {
  static async create(req, res, next) {
    const t = await Spdp.sequelize.transaction();

    try {
      const { nomor_spdp, tanggal_spdp, asal_instansi, nama_tersangka, pasal } =
        req.body;

      // 🔥 1. create SPDP
      const spdp = await Spdp.create(
        {
          nomor_spdp,
          tanggal_spdp,
          asal_instansi,
          nama_tersangka,
          pasal,
          created_by: req.user.id,
        },
        { transaction: t },
      );

      // 🔥 2. create Perkara
      const perkara = await Perkara.create(
        {
          spdp_id: spdp.id,
          status: "penyidikan",
          created_by: req.user.id,
        },
        { transaction: t },
      );

      await t.commit();

      res.status(201).json({
        message: "SPDP & Perkara berhasil dibuat",
        spdp,
        perkara,
      });
    } catch (err) {
      await t.rollback();
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

      const { Spdp, Perkara, P16Assignment, Jaksa } = require("../models");

      const data = await Spdp.findByPk(id, {
        include: [
          {
            model: Perkara,
            as: "Perkara", // ✅ WAJIB (sesuai model kamu)
            include: [
              {
                model: P16Assignment,
                as: "P16Assignments", // ⚠️ cek ini di model perkara kamu
                include: [
                  {
                    model: Jaksa,
                    as: "Jaksa", // ⚠️ cek ini di model P16Assignment
                  },
                ],
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

  // ✏️ UPDATE SPDP
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nomor_spdp, tanggal_spdp, asal_instansi, nama_tersangka, pasal } =
        req.body;

      const spdp = await Spdp.findByPk(id);

      if (!spdp) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      await spdp.update({
        nomor_spdp,
        tanggal_spdp,
        asal_instansi,
        nama_tersangka,
        pasal,
      });

      res.status(200).json({
        message: "SPDP berhasil diupdate",
        data: spdp,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const spdp = await Spdp.findByPk(id);

      if (!spdp) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      await spdp.destroy();

      res.json({ message: "Berhasil dihapus" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = SpdpController;
