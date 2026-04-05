function success(res, data, message = "Success", status = 200) {
  res.status(status).json({
    status: "success",
    message,
    data,
  });
}

function error(res, message = "Error", status = 500) {
  res.status(status).json({
    status: "error",
    message,
  });
}

module.exports = { success, error };
