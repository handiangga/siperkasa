const { Perkara, Spdp, P16Assignment, Jaksa } = require("../models");
const { Op } = require("sequelize");

class PerkaraService {
  static async findAll(query) {
    let {
      page = 1,
      limit = 10,
      status,
      jaksa_id,
      search,
      sort_by = "createdAt",
      order = "DESC",
    } = query;

    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    let where = {};

    // filter status
    if (status) {
      where.status = status;
    }

    let include = [
      {
        model: Spdp,
        where: {},
      },
      {
        model: P16Assignment,
        include: [Jaksa],
      },
    ];

    // search nama tersangka
    if (search) {
      include[0].where = {
        nama_tersangka: {
          [Op.iLike]: `%${search}%`,
        },
      };
    }

    // filter jaksa
    if (jaksa_id) {
      include[1].where = { jaksa_id };
    }

    const { count, rows } = await Perkara.findAndCountAll({
      where,
      include,
      limit,
      offset,
      distinct: true,
      order: [[sort_by, order.toUpperCase()]],
    });

    const data = rows.map((item) => {
      const utama = item.P16Assignments.find((p) => p.peran === "utama");
      const anggota = item.P16Assignments.filter((p) => p.peran === "anggota");

      return {
        id: item.id,
        status: item.status,
        spdp: {
          nomor: item.Spdp.nomor_spdp,
          tersangka: item.Spdp.nama_tersangka,
          pasal: item.Spdp.pasal,
        },
        jaksa_utama: utama
          ? {
              id: utama.Jaksa.id,
              nama: utama.Jaksa.nama,
            }
          : null,
        jaksa_anggota: anggota.map((a) => ({
          id: a.Jaksa.id,
          nama: a.Jaksa.nama,
        })),
      };
    });

    return {
      total: count,
      page,
      total_page: Math.ceil(count / limit),
      data,
    };
  }

  static async findById(perkara_id) {
    const item = await Perkara.findByPk(perkara_id, {
      include: [
        { model: Spdp },
        {
          model: P16Assignment,
          include: [Jaksa],
        },
      ],
    });

    if (!item) {
      throw { name: "Not Found", message: "Perkara not found" };
    }

    const utama = item.P16Assignments.find((p) => p.peran === "utama");
    const anggota = item.P16Assignments.filter((p) => p.peran === "anggota");

    return {
      id: item.id,
      status: item.status,
      spdp: {
        nomor: item.Spdp.nomor_spdp,
        tersangka: item.Spdp.nama_tersangka,
        pasal: item.Spdp.pasal,
      },
      jaksa_utama: utama
        ? {
            id: utama.Jaksa.id,
            nama: utama.Jaksa.nama,
          }
        : null,
      jaksa_anggota: anggota.map((a) => ({
        id: a.Jaksa.id,
        nama: a.Jaksa.nama,
      })),
    };
  }

  static async findMyPerkara(jaksa_id) {
    const data = await P16Assignment.findAll({
      where: { jaksa_id },
      include: [
        {
          model: Perkara,
          include: [Spdp],
        },
      ],
    });

    return data;
  }
}

module.exports = PerkaraService;
