const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { jwtSign } = require("../helpers/jwt");

class UserController {
  // 🔹 REGISTER
  static async register(req, res, next) {
    try {
      const { name, email, password, role, jaksa_id } = req.body;

      const user = await User.create({
        name,
        email,
        password,
        role,
        jaksa_id,
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

      // validasi input
      if (!email || !password) {
        throw {
          name: "Unauthorized",
          message: "Email and password are required",
        };
      }

      // cari user (pakai scope null biar password ikut keambil)
      const user = await User.scope(null).findOne({
        where: { email },
      });

      // cek user & password
      if (!user || !comparePassword(password, user.password)) {
        throw {
          name: "Unauthorized",
          message: "Invalid email or password",
        };
      }

      // buat token
      const access_token = jwtSign({
        id: user.id,
        email: user.email,
        role: user.role,
        jaksa_id: user.jaksa_id,
      });

      res.status(200).json({
        access_token,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
