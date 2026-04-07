"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const jaksas = await queryInterface.sequelize.query(
      `SELECT id, nip, nama FROM "Jaksas";`,
      { type: Sequelize.QueryTypes.SELECT },
    );

    const users = jaksas.map((jaksa) => {
      return {
        name: jaksa.nama, // ✅ ambil nama asli
        email: `${jaksa.nama}@jaksa.id`,
        password: bcrypt.hashSync("123456", 10),
        role: "jaksa",
        jaksa_id: jaksa.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert("Users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { role: "jaksa" }, {});
  },
};
