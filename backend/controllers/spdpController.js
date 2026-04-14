const { Spdp, Perkara, P16Assignment, Jaksa } = require("../models");

class SpdpController {
  static async create(req, res, next) {
    const t = await Spdp.sequelize.transaction();

    try {
      const { nomor_spdp, tanggal_spdp, asal_instansi, nama_tersangka, pasal } =
        req.body;

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
      const { role, jaksa_id } = req.user;

      let data;

      if (role === "jaksa") {
        data = await Spdp.findAll({
          include: [
            {
              model: Perkara,
              as: "Perkara",
              required: true,
              include: [
                {
                  model: P16Assignment,
                  as: "P16Assignments",
                  where: { jaksa_id },
                  required: true,
                },
              ],
            },
          ],
          order: [["id", "DESC"]],
        });
      } else {
        data = await Spdp.findAll({
          order: [["id", "DESC"]],
        });
      }

      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const { role, jaksa_id } = req.user;

      let data;

      if (role === "jaksa") {
        data = await Spdp.findOne({
          where: { id },
          include: [
            {
              model: Perkara,
              as: "Perkara",
              required: true,
              include: [
                {
                  model: P16Assignment,
                  as: "P16Assignments",
                  where: { jaksa_id },
                  required: true,
                  include: [
                    {
                      model: Jaksa,
                      as: "Jaksa",
                    },
                  ],
                },
              ],
            },
          ],
        });
      } else {
        data = await Spdp.findByPk(id, {
          include: [
            {
              model: Perkara,
              as: "Perkara",
              include: [
                {
                  model: P16Assignment,
                  as: "P16Assignments",
                  include: [
                    {
                      model: Jaksa,
                      as: "Jaksa",
                    },
                  ],
                },
              ],
            },
          ],
        });
      }

      if (!data) {
        return res.status(404).json({ message: "SPDP tidak ditemukan" });
      }

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

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
