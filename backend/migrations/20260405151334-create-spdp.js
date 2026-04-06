"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Spdps", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      nomor_spdp: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      tanggal_spdp: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      asal_instansi: {
        type: Sequelize.STRING,
      },

      nama_tersangka: {
        type: Sequelize.STRING,
      },

      pasal: {
        type: Sequelize.TEXT,
      },

      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    await queryInterface.dropTable("Spdps");
  },
};