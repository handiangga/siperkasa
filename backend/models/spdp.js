"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Spdp extends Model {
    static associate(models) {
      // 🔥 ke User
      Spdp.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });

      // 🔥 ke Perkara
      Spdp.hasOne(models.Perkara, {
        foreignKey: "spdp_id",
        as: "Perkara", // 🔥 WAJIB
      });
    }
  }

  Spdp.init(
    {
      nomor_spdp: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Nomor SPDP sudah ada",
        },
        validate: {
          notNull: { msg: "Nomor SPDP wajib diisi" },
          notEmpty: { msg: "Nomor SPDP tidak boleh kosong" },
        },
      },

      tanggal_spdp: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Tanggal SPDP wajib diisi" },
        },
      },

      asal_instansi: DataTypes.STRING,
      nama_tersangka: DataTypes.STRING,
      pasal: DataTypes.TEXT,
      created_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Spdp",
    },
  );

  return Spdp;
};
