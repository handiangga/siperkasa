const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { jwtSign } = require("../helpers/jwt");
const bcrypt = require("bcryptjs");

class UserController {
  // 🔹 REGISTER
  static async register(req, res, next) {
    try {
      const { name, email, password, role, jaksa_id } = req.body;

      // 🔥 VALIDASI BASIC
      if (!name || !email || !password) {
        throw {
          name: "BadRequest",
          message: "Nama, email, dan password wajib diisi",
        };
      }

      // 🔥 VALIDASI ROLE JAKSA
      if (role === "jaksa" && !jaksa_id) {
        throw {
          name: "BadRequest",
          message: "Role jaksa wajib pilih jaksa",
        };
      }

      const user = await User.create({
        name,
        email,
        password,
        role,
        jaksa_id: jaksa_id || null, // 🔥 FIX penting
      });

      res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  // 🔹 LOGIN
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // 🔥 VALIDASI INPUT
      if (!email || !password) {
        throw {
          name: "Unauthorized",
          message: "Email dan password wajib diisi",
        };
      }

      // 🔍 CARI USER
      const user = await User.scope(null).findOne({
        where: { email },
      });

      // ❌ CEK USER
      if (!user) {
        throw {
          name: "Unauthorized",
          message: "Email atau password salah",
        };
      }

      // ❌ CEK PASSWORD
      const valid = comparePassword(password, user.password);

      if (!valid) {
        throw {
          name: "Unauthorized",
          message: "Email atau password salah",
        };
      }

      // 🔥 TOKEN
      const access_token = jwtSign({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        jaksa_id: user.jaksa_id,
      });

      res.status(200).json({
        access_token,
      });
    } catch (err) {
      next(err);
    }
  }

  // 🔹 GET ALL USER
  static async getAll(req, res, next) {
    try {
      const data = await User.findAll({
        attributes: { exclude: ["password"] }, // 🔥 SECURITY
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  // 🔥 GET BY ID
  static async getById(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        throw { name: "NotFound", message: "User tidak ditemukan" };
      }

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  // 🔥 UPDATE
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        throw { name: "NotFound", message: "User tidak ditemukan" };
      }

      await user.update({
        name,
        email,
        role,
      });

      res.status(200).json({
        message: "User berhasil diupdate",
      });
    } catch (err) {
      next(err);
    }
  }

  // 🔹 DELETE USER
  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        throw {
          name: "NotFound",
          message: "User tidak ditemukan",
        };
      }

      await user.destroy();

      res.status(200).json({
        message: "User berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  }

  // 🔥 PROFILE
  static async getProfile(req, res, next) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        attributes: ["id", "name", "email", "role"],
      });

      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;

      const user = await User.scope(null).findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Password lama salah" });
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      await user.update({ password: hashed });

      res.json({ message: "Password berhasil diubah" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
