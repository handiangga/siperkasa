const { User, P16Assignment } = require("../models");
const { jwtVerify } = require("../helpers/jwt");

// 🔐 AUTHENTICATION
async function authentication(req, res, next) {
  try {
    const { access_token } = req.headers;

    if (!access_token) {
      throw {
        name: "Unauthorized",
        message: "You must login first",
      };
    }

    const payload = jwtVerify(access_token);

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
      jaksa_id: user.jaksa_id,
    };

    next();
  } catch (err) {
    next(err);
  }
}

// 🔥 ROLE FLEXIBLE
function hasRole(roles) {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      next({
        name: "Forbidden",
        message: "Tidak punya akses",
      });
    }
  };
}

// 🔥 AUTHORIZATION PERKARA
async function authorizationPerkara(req, res, next) {
  try {
    const { perkara_id } = req.params;

    // admin & kajari bebas akses
    if (req.user.role === "admin" || req.user.role === "kajari") {
      return next();
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
  hasRole,
  authorizationPerkara,
};
