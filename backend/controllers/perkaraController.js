const PerkaraService = require("../services/perkaraService");
const { success } = require("../helpers/response");

const { Perkara, Spdp, P16Assignment, Jaksa } = require("../models");
const { Op } = require("sequelize");

class PerkaraController {
  // 🔥 GET ALL (ROLE BASED)
  static async getAll(req, res, next) {
    try {
      let { search = "", status } = req.query;
      const { role, jaksa_id } = req.user;

      const whereSpdp = search
        ? {
            [Op.or]: [
              { nomor_spdp: { [Op.iLike]: `%${search}%` } },
              { nama_tersangka: { [Op.iLike]: `%${search}%` } },
              { pasal: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {};

      const wherePerkara = status ? { status } : {};

      let data;

      if (role === "jaksa") {
        data = await Perkara.findAll({
          where: wherePerkara,
          include: [
            {
              model: Spdp,
              as: "Spdp",
              where: whereSpdp,
              required: true,
            },
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
          order: [["createdAt", "DESC"]],
        });
      } else {
        data = await Perkara.findAll({
          where: wherePerkara,
          include: [
            {
              model: Spdp,
              as: "Spdp",
              where: whereSpdp,
              required: true,
            },
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
          order: [["createdAt", "DESC"]],
        });
      }

      res.status(200).json({
        data,
        total: data.length,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  // 🔍 DETAIL (ROLE SAFE)
  static async getDetail(req, res, next) {
    try {
      const { id } = req.params;
      const { role, jaksa_id } = req.user;

      let data;

      if (role === "jaksa") {
        data = await Perkara.findOne({
          where: { id },
          include: [
            {
              model: Spdp,
              as: "Spdp",
            },
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
        });
      } else {
        data = await Perkara.findByPk(id, {
          include: [
            {
              model: Spdp,
              as: "Spdp",
            },
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
        });
      }

      if (!data) {
        return res.status(404).json({ message: "Perkara tidak ditemukan" });
      }

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  // 🔍 PERKARA JAKSA LOGIN
  static async getMyPerkara(req, res, next) {
    try {
      const data = await PerkaraService.findMyPerkara(req.user.jaksa_id);
      success(res, data);
    } catch (err) {
      next(err);
    }
  }

  // 🔄 UPDATE STATUS
  static async updateStatus(req, res, next) {
    try {
      const { perkara_id } = req.params;
      const { status } = req.body;

      const perkara = await Perkara.findByPk(perkara_id);

      if (!perkara) {
        throw {
          name: "Not Found",
          message: "Perkara tidak ditemukan",
        };
      }

      await perkara.update({ status });

      res.status(200).json({
        message: "Status berhasil diupdate",
        data: perkara,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PerkaraController;
