const PerkaraService = require("../services/perkaraService");
const { success } = require("../helpers/response");

class PerkaraController {
  static async getAll(req, res, next) {
    try {
      const data = await PerkaraService.findAll(req.query);
      success(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async getDetail(req, res, next) {
    try {
      const { perkara_id } = req.params;

      const data = await PerkaraService.findById(perkara_id);
      success(res, data);
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
}

module.exports = PerkaraController;
