// controllers/notifController.js
const { Spdp, P16Assignment } = require("../models");

class NotifController {
  static async getNotif(req, res, next) {
    try {
      const latestSpdp = await Spdp.findAll({
        order: [["createdAt", "DESC"]],
        limit: 5,
      });

      const latestP16 = await P16Assignment.findAll({
        order: [["createdAt", "DESC"]],
        limit: 5,
      });

      res.json({
        spdp: latestSpdp,
        p16: latestP16,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = NotifController;
