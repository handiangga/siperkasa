"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Jaksa extends Model {
    static associate(models) {
      // 🔥 relasi ke P16Assignment
      Jaksa.hasMany(models.P16Assignment, {
        foreignKey: "jaksa_id",
      });

      // 🔥 relasi ke User (akun login jaksa)
      Jaksa.hasOne(models.User, {
        foreignKey: "jaksa_id",
      });
    }
  }

  Jaksa.init(
    {
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Nama wajib diisi",
          },
          notEmpty: {
            msg: "Nama tidak boleh kosong",
          },
        },
      },

      nip: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "NIP sudah terdaftar",
        },
        validate: {
          notNull: {
            msg: "NIP wajib diisi",
          },
          notEmpty: {
            msg: "NIP tidak boleh kosong",
          },
        },
      },

      jabatan: {
        type: DataTypes.STRING,
      },

      pangkat: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Jaksa",
    },
  );

  return Jaksa;
};
