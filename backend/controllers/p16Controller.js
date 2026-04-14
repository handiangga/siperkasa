const { P16Assignment, Perkara, Jaksa, Spdp } = require("../models");
const { sequelize } = require("../models");

class P16Controller {
  // ➕ CREATE
  static async create(req, res, next) {
    try {
      const { perkara_id, nomor_p16, tanggal_p16, jaksa } = req.body;

      const perkara = await Perkara.findByPk(perkara_id);
      if (!perkara) {
        throw { name: "Not Found", message: "Perkara tidak ditemukan" };
      }

      if (!jaksa || jaksa.length === 0) {
        throw { name: "Bad Request", message: "Jaksa harus diisi" };
      }

      const utamaCount = jaksa.filter((j) => j.peran === "utama").length;
      if (utamaCount !== 1) {
        throw {
          name: "Bad Request",
          message: "Harus ada tepat 1 jaksa utama",
        };
      }

      const dataInsert = jaksa.map((j) => ({
        perkara_id,
        jaksa_id: j.id,
        nomor_p16,
        tanggal_p16,
        peran: j.peran,
        created_by: req.user.id,
      }));

      await P16Assignment.bulkCreate(dataInsert);

      res.status(201).json({
        message: "P16 berhasil dibuat",
      });
    } catch (err) {
      next(err);
    }
  }

  // 🔥 GET ALL (ROLE BASED)
  static async getAll(req, res, next) {
    try {
      const { role, jaksa_id } = req.user;

      let data;

      if (role === "jaksa") {
        data = await P16Assignment.findAll({
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
            {
              model: Jaksa,
              as: "Jaksa",
            },
          ],
          order: [["createdAt", "DESC"]],
        });
      } else {
        data = await P16Assignment.findAll({
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
            {
              model: Jaksa,
              as: "Jaksa",
            },
          ],
          order: [["createdAt", "DESC"]],
        });
      }

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  // 🔥 BY PERKARA (ROLE SAFE)
  static async getByPerkara(req, res, next) {
    try {
      const { id } = req.params;
      const { role, jaksa_id } = req.user;

      let data;

      if (role === "jaksa") {
        data = await P16Assignment.findAll({
          where: { perkara_id: id, jaksa_id },
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
            {
              model: Jaksa,
              as: "Jaksa",
            },
          ],
          order: [["createdAt", "DESC"]],
        });
      } else {
        data = await P16Assignment.findAll({
          where: { perkara_id: id },
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
            {
              model: Jaksa,
              as: "Jaksa",
            },
          ],
          order: [["createdAt", "DESC"]],
        });
      }

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  // 🔥 BY JAKSA
  static async getByJaksa(req, res, next) {
    try {
      const { id } = req.params;

      const data = await P16Assignment.findAll({
        where: { jaksa_id: id },
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
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  // 🔥 DETAIL (ROLE SAFE)
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const { role, jaksa_id } = req.user;

      let data;

      if (role === "jaksa") {
        data = await P16Assignment.findOne({
          where: { id, jaksa_id },
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
            {
              model: Jaksa,
              as: "Jaksa",
            },
          ],
        });
      } else {
        data = await P16Assignment.findByPk(id, {
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
            {
              model: Jaksa,
              as: "Jaksa",
            },
          ],
        });
      }

      if (!data) {
        throw {
          name: "Not Found",
          message: "Data P16 tidak ditemukan",
        };
      }

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  // 🔄 UPDATE
  static async update(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const perkara_id = req.params.perkara_id || req.params.id;
      const { jaksa_list } = req.body;

      if (!jaksa_list || jaksa_list.length === 0) {
        throw {
          name: "Bad Request",
          message: "Tim jaksa tidak boleh kosong",
        };
      }

      const utamaCount = jaksa_list.filter((j) => j.peran === "utama").length;
      if (utamaCount !== 1) {
        throw {
          name: "Bad Request",
          message: "Harus ada 1 jaksa utama",
        };
      }

      if (!perkara_id) {
        throw {
          name: "Bad Request",
          message: "perkara_id tidak ditemukan",
        };
      }

      await P16Assignment.destroy({
        where: { perkara_id },
        transaction: t,
      });

      const newData = await Promise.all(
        jaksa_list.map((j) =>
          P16Assignment.create(
            {
              perkara_id,
              jaksa_id: j.jaksa_id,
              peran: j.peran,
              created_by: req.user.id,
            },
            { transaction: t },
          ),
        ),
      );

      await t.commit();

      res.status(200).json({
        message: "P16 berhasil diupdate",
        data: newData,
      });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  }

  // ❌ DELETE
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
