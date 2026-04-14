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

    // 🔥 handle Bearer
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // 🔥 guard token aneh
    if (!token || token === "undefined" || token === "null") {
      throw {
        name: "Unauthorized",
        message: "Invalid token",
      };
    }

    const payload = jwtVerify(token);

    const user = await User.findByPk(payload.id);

    if (!user) {
      throw {
        name: "Unauthorized",
        message: "Invalid token",
      };
    }

    // 🔥 FIX FINAL (normalize role)
    const role = user.role?.toLowerCase().trim();

    req.user = {
      id: user.id,
      role,
      email: user.email,
      name: user.name,
      jaksa_id: user.jaksa_id || null,
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
    const role = req.user.role;

    if (!allowedRoles.includes(role)) {
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
    const perkara_id = req.params.perkara_id || req.params.id;

    // 🔥 bypass role tinggi
    if (["admin", "kajari", "operator"].includes(req.user.role)) {
      return next();
    }

    // 🔥 wajib punya jaksa_id
    if (!req.user.jaksa_id) {
      throw {
        name: "Forbidden",
        message: "Tidak punya akses",
      };
    }

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
