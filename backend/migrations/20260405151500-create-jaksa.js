"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Jaksas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      nama: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      nip: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // 🔥 biar tidak double
      },

      jabatan: {
        type: Sequelize.STRING,
      },

      pangkat: {
        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Jaksas");
  },
};
