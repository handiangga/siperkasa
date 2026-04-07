const { P16Assignment, Perkara, Jaksa, Spdp } = require("../models");
const { sequelize } = require("../models");

class P16Controller {
  // ➕ CREATE / ASSIGN JAKSA KE PERKARA (MULTI)
  static async create(req, res, next) {
    try {
      const { perkara_id, nomor_p16, tanggal_p16, jaksa } = req.body;

      // 🔥 validasi perkara
      const perkara = await Perkara.findByPk(perkara_id);
      if (!perkara) {
        throw { name: "Not Found", message: "Perkara tidak ditemukan" };
      }

      // 🔥 validasi input jaksa
      if (!jaksa || jaksa.length === 0) {
        throw { name: "Bad Request", message: "Jaksa harus diisi" };
      }

      // 🔥 validasi hanya 1 jaksa utama
      const utamaCount = jaksa.filter((j) => j.peran === "utama").length;
      if (utamaCount > 1) {
        throw {
          name: "Forbidden",
          message: "Hanya boleh 1 jaksa utama",
        };
      }

      // 🔥 validasi jaksa exist
      for (let j of jaksa) {
        const cek = await Jaksa.findByPk(j.id);
        if (!cek) {
          throw { name: "Not Found", message: "Jaksa tidak ditemukan" };
        }
      }

      // 🔥 mapping bulk insert
      const dataInsert = jaksa.map((j) => ({
        perkara_id,
        jaksa_id: j.id,
        nomor_p16,
        tanggal_p16,
        peran: j.peran,
        created_by: req.user.id,
      }));

      await P16Assignment.bulkCreate(dataInsert);

      res.status(201).json({
        message: "P16 berhasil dibuat",
      });
    } catch (err) {
      next(err);
    }
  }

  // 🔍 GET SEMUA P16 (OPTIONAL - biasanya tidak dipakai)
  static async getAll(req, res, next) {
    try {
      const data = await P16Assignment.findAll({
        include: [
          {
            model: Perkara,
            include: [Spdp],
          },
          {
            model: Jaksa,
          },
        ],
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  // 🔍 DETAIL P16 PER PERKARA
  static async getByPerkara(req, res, next) {
    try {
      const { id } = req.params;

      const data = await P16Assignment.findAll({
        where: {
          perkara_id: id,
        },
        include: [
          {
            model: Perkara,
            include: [
              {
                model: Spdp, // 🔥 INI YANG WAJIB ADA
              },
            ],
          },
          {
            model: Jaksa,
          },
        ],
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  // 🔥 GET P16 BY JAKSA (UNTUK HALAMAN DETAIL JAKSA)
  static async getByJaksa(req, res, next) {
    try {
      const { id } = req.params;

      const data = await P16Assignment.findAll({
        where: { jaksa_id: id },
        include: [
          {
            model: Perkara,
            include: [Spdp], // 🔥 ini penting
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  // ✏️ UPDATE STATUS PERKARA (DARI P16 PAGE)
  static async updateStatus(req, res, next) {
    try {
      const { perkara_id } = req.params;
      const { status } = req.body;

      const perkara = await Perkara.findByPk(perkara_id);

      if (!perkara) {
        throw { name: "Not Found", message: "Perkara tidak ditemukan" };
      }

      perkara.status = status;
      await perkara.save();

      res.status(200).json({
        message: "Status berhasil diupdate",
      });
    } catch (err) {
      next(err);
    }
  }
  // 🔍 DETAIL P16
  static async getById(req, res, next) {
    try {
      const { id } = req.params;

      const data = await P16Assignment.findByPk(id, {
        include: [
          {
            model: Perkara,
            include: [{ model: require("../models").Spdp }],
          },
          {
            model: Jaksa,
          },
        ],
      });

      if (!data) {
        throw { name: "Not Found", message: "Data P16 tidak ditemukan" };
      }

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
  // 🔥 UPDATE P16 (REPLACE TIM JAKSA)

  static async update(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { perkara_id } = req.params;
      const { jaksa_list } = req.body;

      console.log("BODY:", req.body);

      // 🔥 VALIDASI
      if (!jaksa_list || jaksa_list.length === 0) {
        throw {
          name: "Bad Request",
          message: "Tim jaksa tidak boleh kosong",
        };
      }

      const utamaCount = jaksa_list.filter((j) => j.peran === "utama").length;
      if (utamaCount !== 1) {
        throw {
          name: "Bad Request",
          message: "Harus ada 1 jaksa utama",
        };
      }

      const perkara = await Perkara.findByPk(perkara_id);
      if (!perkara) {
        throw {
          name: "Not Found",
          message: "Perkara tidak ditemukan",
        };
      }

      // 🔥 DELETE DALAM TRANSACTION
      await P16Assignment.destroy({
        where: { perkara_id },
        transaction: t,
      });

      // 🔥 INSERT ULANG
      const newData = await Promise.all(
        jaksa_list.map((j) =>
          P16Assignment.create(
            {
              perkara_id,
              jaksa_id: j.jaksa_id,
              peran: j.peran,
              created_by: req.user.id,
            },
            { transaction: t },
          ),
        ),
      );

      await t.commit();

      res.status(200).json({
        message: "P16 berhasil diupdate",
        data: newData,
      });
    } catch (err) {
      await t.rollback();
      console.log("ERROR UPDATE P16:", err);
      next(err);
    }
  }

  // ❌ DELETE P16
  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const data = await P16Assignment.findByPk(id);

      if (!data) {
        throw { name: "Not Found", message: "Data tidak ditemukan" };
      }

      await data.destroy();

      res.status(200).json({
        message: "P16 berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = P16Controller;
