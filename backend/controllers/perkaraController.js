const PerkaraService = require("../services/perkaraService");
const { success } = require("../helpers/response");

// 🔥 IMPORT MODEL
const { Perkara, Spdp, P16Assignment, Jaksa } = require("../models");

class PerkaraController {
  static async getAll(req, res, next) {
    try {
      const data = await Perkara.findAll({
        include: [
          {
            model: Spdp,
          },
          {
            model: P16Assignment,
            include: [
              {
                model: Jaksa,
              },
            ],
          },
        ],
      });

      success(res, data);
    } catch (err) {
      console.log(err); // 🔥 debug
      next(err);
    }
  }

  static async getDetail(req, res, next) {
    try {
      const { id } = req.params;

      const data = await Perkara.findByPk(id, {
        include: [
          {
            model: Spdp,
          },
        ],
      });

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  static async getMyPerkara(req, res, next) {
    try {
      const data = await PerkaraService.findMyPerkara(req.user.jaksa_id);
      success(res, data);
    } catch (err) {
      next(err);
    }
  }
  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const perkara = await Perkara.findByPk(id);

      if (!perkara) {
        throw { name: "Not Found", message: "Perkara tidak ditemukan" };
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
