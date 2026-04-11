"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../json/_Users__202604102303.json").Users;

    await queryInterface.bulkInsert("Users", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
