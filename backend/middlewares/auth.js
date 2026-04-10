const { User, P16Assignment } = require("../models");
const { jwtVerify } = require("../helpers/jwt");

// =========================
// 🔐 AUTHENTICATION
// =========================
async function authentication(req, res, next) {
  try {
    let token = req.headers.authorization;

    if (!token) {
      throw {
        name: "Unauthorized",
        message: "You must login first",
      };
    }

    // 🔥 support Bearer token
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const payload = jwtVerify(token);

    const user = await User.findByPk(payload.id);

    if (!user) {
      throw {
        name: "Unauthorized",
        message: "Invalid token",
      };
    }

    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      jaksa_id: user.jaksa_id,
    };

    next();
  } catch (err) {
    next(err);
  }
}

// =========================
// 🔥 AUTHORIZATION ROLE
// =========================
function authorization(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next({
        name: "Forbidden",
        message: "Tidak punya akses",
      });
    }
    next();
  };
}

// =========================
// 🔥 AUTHORIZATION PERKARA
// =========================
async function authorizationPerkara(req, res, next) {
  try {
    const { perkara_id } = req.params;

    // 🔥 admin, kajari, operator bebas
    if (["admin", "kajari", "operator"].includes(req.user.role)) {
      return next();
    }

    // 🔥 jaksa hanya punya dia
    const data = await P16Assignment.findOne({
      where: {
        perkara_id,
        jaksa_id: req.user.jaksa_id,
      },
    });

    if (!data) {
      throw {
        name: "Forbidden",
        message: "Tidak punya akses ke perkara ini",
      };
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  authentication,
  authorization,
  authorizationPerkara,
};
