"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class P16Assignment extends Model {
    static associate(models) {
      // 🔥 ke Perkara
      P16Assignment.belongsTo(models.Perkara, {
        foreignKey: "perkara_id",
        as: "Perkara", // 🔥 WAJIB
      });

      // 🔥 ke Jaksa
      P16Assignment.belongsTo(models.Jaksa, {
        foreignKey: "jaksa_id",
        as: "Jaksa", // 🔥 WAJIB
      });

      // 🔥 ke User
      P16Assignment.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
    }
  }

  P16Assignment.init(
    {
      perkara_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      jaksa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      nomor_p16: DataTypes.STRING,
      tanggal_p16: DataTypes.DATE,

      peran: {
        type: DataTypes.ENUM("utama", "anggota"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["utama", "anggota"]],
            msg: "Peran harus utama atau anggota",
          },
        },
      },

      created_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "P16Assignment",
    },
  );

  return P16Assignment;
};
