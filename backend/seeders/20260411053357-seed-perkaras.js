"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../json/_Perkaras__202604102302.json").Perkaras;

    await queryInterface.bulkInsert("Perkaras", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Perkaras", null, {});
  },
};
