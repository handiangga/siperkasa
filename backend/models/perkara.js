"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Perkara extends Model {
    static associate(models) {
      // relasi ke SPDP
      Perkara.belongsTo(models.Spdp, {
        foreignKey: "spdp_id",
      });

      // relasi ke User (creator)
      Perkara.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });

      // relasi ke P16
      Perkara.hasMany(models.P16Assignment, {
        foreignKey: "perkara_id",
      });
    }
  }

  Perkara.init(
    {
      spdp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          msg: "SPDP sudah dipakai untuk perkara lain",
        },
      },

      status: {
        type: DataTypes.ENUM(
          "penyidikan",
          "tahap1",
          "p21",
          "sidang"
        ),
        defaultValue: "penyidikan",
        validate: {
          isIn: {
            args: [[
              "penyidikan",
              "tahap1",
              "p21",
              "sidang"
            ]],
            msg: "Status tidak valid",
          },
        },
      },

      created_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Perkara",
    }
  );

  return Perkara;
};