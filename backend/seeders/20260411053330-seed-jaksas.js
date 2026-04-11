"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../json/_Jaksas__202604102302.json").Jaksas;

    await queryInterface.bulkInsert("Jaksas", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Jaksas", null, {});
  },
};
