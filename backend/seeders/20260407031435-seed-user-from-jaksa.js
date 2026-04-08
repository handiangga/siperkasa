"use strict";

const bcrypt = require("bcrypt");

const generateEmail = (nama) => {
  return (
    nama
      .toLowerCase()
      .replace(/,?\s*s\.h\.?/g, "")
      .replace(/,?\s*m\.h\.?/g, "")
      .replace(/,?\s*m\.hum\.?/g, "")
      .replace(/,?\s*m\.hli\.?/g, "")
      .replace(/[^a-z\s]/g, "")
      .trim()
      .replace(/\s+/g, ".") + "@jaksa.id"
  );
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const jaksas = await queryInterface.sequelize.query(
      `SELECT id, nama FROM "Jaksas";`,
      { type: Sequelize.QueryTypes.SELECT },
    );

    const usedEmails = new Set(); // 🔥 anti duplicate

    const users = jaksas.map((jaksa) => {
      let email = generateEmail(jaksa.nama);

      let counter = 1;
      while (usedEmails.has(email)) {
        email = email.replace("@jaksa.id", `${counter}@jaksa.id`);
        counter++;
      }

      usedEmails.add(email);

      return {
        name: jaksa.nama,
        email,
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
