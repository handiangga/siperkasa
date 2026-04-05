function validateP16(req, res, next) {
  const { perkara_id, jaksa_id, peran } = req.body;

  if (!perkara_id || !jaksa_id || !peran) {
    return next({
      name: "Bad Request",
      message: "perkara_id, jaksa_id, dan peran wajib diisi",
    });
  }

  if (!["utama", "anggota"].includes(peran)) {
    return next({
      name: "Bad Request",
      message: "Peran harus 'utama' atau 'anggota'",
    });
  }

  next();
}

// 🔥 VALIDASI SPDP
function validateSpdp(req, res, next) {
  const { nomor_spdp, tanggal_spdp, asal_instansi, nama_tersangka, pasal } =
    req.body;

  if (
    !nomor_spdp ||
    !tanggal_spdp ||
    !asal_instansi ||
    !nama_tersangka ||
    !pasal
  ) {
    return next({
      name: "Bad Request",
      message: "Semua field SPDP wajib diisi",
    });
  }

  next();
}

// 🔥 VALIDASI JAKSA
function validateJaksa(req, res, next) {
  const { nama, nip, jabatan, pangkat } = req.body;

  if (!nama || !nip || !jabatan || !pangkat) {
    return next({
      name: "Bad Request",
      message: "Semua field jaksa wajib diisi",
    });
  }

  next();
}

// 🔥 VALIDASI LOGIN
function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next({
      name: "Bad Request",
      message: "Email dan password wajib diisi",
    });
  }

  next();
}

module.exports = {
  validateP16,
  validateSpdp,
  validateJaksa,
  validateLogin,
};
