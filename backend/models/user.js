"use strict";
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // relasi ke Perkara
      User.hasMany(models.Perkara, {
        foreignKey: "created_by",
      });

      // relasi ke P16Assignment
      User.hasMany(models.P16Assignment, {
        foreignKey: "created_by",
      });

      // 🔥 relasi ke Jaksa (login jaksa)
      User.belongsTo(models.Jaksa, {
        foreignKey: "jaksa_id",
      });
    }

    // method untuk login
    comparePassword(inputPassword) {
      return comparePassword(inputPassword, this.password);
    }
  }

  User.init(
    {
      name: DataTypes.STRING,

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email already registered",
        },
        validate: {
          notNull: {
            msg: "Email cannot be null",
          },
          notEmpty: {
            msg: "Email cannot be empty",
          },
          isEmail: {
            msg: "Format email must be valid",
          },
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password cannot be null",
          },
          notEmpty: {
            msg: "Password cannot be empty",
          },
          len: {
            args: [5, 100],
            msg: "Minimum 5 characters required",
          },
        },
      },

      role: {
        type: DataTypes.ENUM("admin", "kajari", "operator", "jaksa"), // 🔥 tambah jaksa
        defaultValue: "operator",
        validate: {
          isIn: {
            args: [["admin", "kajari", "operator", "jaksa"]],
            msg: "Role tidak valid",
          },
        },
      },

      // 🔥 relasi ke jaksa
      jaksa_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",

      // 🔐 hash password
      hooks: {
        beforeCreate: (user) => {
          user.password = hashPassword(user.password);
        },
      },

      // 🙈 sembunyikan password
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    },
  );

  return User;
};
