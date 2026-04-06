function errorHandler(err, req, res, next) {
  console.log(err); // 🔥 penting buat debug

  switch (err.name) {
    case "SequelizeValidationError":
      res.status(400).json({
        message: err.errors[0].message,
      });
      break;

    case "SequelizeUniqueConstraintError":
      res.status(400).json({
        message: err.errors[0].message,
      });
      break;

    case "SequelizeForeignKeyConstraintError":
      res.status(400).json({
        message: "Relasi data tidak valid",
      });
      break;

    case "Unauthorized":
      res.status(401).json({
        message: err.message || "Unauthorized",
      });
      break;

    case "Forbidden":
      res.status(403).json({
        message: err.message || "Forbidden",
      });
      break;

    case "Not Found":
      res.status(404).json({
        message: err.message || "Data not found",
      });
      break;

    case "JsonWebTokenError":
      res.status(401).json({
        message: "Invalid access_token",
      });
      break;

    case "TokenExpiredError":
      res.status(401).json({
        message: "Token expired",
      });
      break;

    default:
      res.status(500).json({
        message: "Internal Server Error",
      });
  }
}

module.exports = errorHandler;
