"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../json/_Spdps__202604102303.json").Spdps;

    await queryInterface.bulkInsert("Spdps", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Spdps", null, {});
  },
};
