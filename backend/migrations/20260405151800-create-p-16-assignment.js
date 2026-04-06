"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("P16Assignments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      perkara_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Perkaras",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      jaksa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Jaksas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      nomor_p16: {
        type: Sequelize.STRING,
      },

      tanggal_p16: {
        type: Sequelize.DATE,
      },

      peran: {
        type: Sequelize.ENUM("utama", "anggota"), // 🔥 penting
        allowNull: false,
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

    // 🔥 OPTIONAL (biar tidak double jaksa di perkara yang sama)
    await queryInterface.addConstraint("P16Assignments", {
      fields: ["perkara_id", "jaksa_id"],
      type: "unique",
      name: "unique_perkara_jaksa",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("P16Assignments");
  },
};
