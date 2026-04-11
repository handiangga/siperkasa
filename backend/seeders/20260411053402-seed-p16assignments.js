"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const data =
      require("../json/_P16Assignments__202604102302.json").P16Assignments;

    await queryInterface.bulkInsert("P16Assignments", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("P16Assignments", null, {});
  },
};
