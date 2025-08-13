const dbPool = require("../../config/knex");

const kanagataPartModel = {
  createKanagataPart: (data) => {
    return dbPool("kanagata_part").insert(data)
  },

  createCategory: (data) => {
    return dbPool("kanagata_part_category").insert(data)
  },

  createPartRequest: (data) => {
    return dbPool("kanagata_part_request").insert({ ...data, id_request: dbPool.raw("uuid()") })
  },

  createNccPart: (data) => {
    return dbPool("kanagata_part_ncc").insert(data)
  },

  updateKanagataPart: (id_kanagata_part, data) => {
    return dbPool("kanagata_part").where({ id_kanagata_part }).update(data)
  },

  updateCategory: (id_part_category, data) => {
    return dbPool("kanagata_part_category").where({ id_part_category }).update(data)
  },

  updatePartRequest: (id_request, data) => {
    return dbPool("kanagata_part_request").where({ id_request }).update(data)
  },

  updateNccPart: (id_ncc, data) => {
    return dbPool("kanagata_part_ncc").where({ id_ncc }).update(data)
  },

  deleteKanagataPart: (id_kanagata_part) => {
    return dbPool("kanagata_part").where({ id_kanagata_part }).del()
  },

  deleteCategory: (id_part_category) => {
    return dbPool("kanagata_part_category").where({ id_part_category }).del()
  },

  deletePartRequest: (id_request) => {
    return dbPool("kanagata_part_request").where({ id_request }).del()
  },

  deleteNccPart: (id_ncc) => {
    return dbPool("kanagata_part_ncc").where({ id_ncc }).del()
  },

  getKanagataPart: (filters = {}) => {
    const { id_product, id_kanagata_part } = filters
    return dbPool("kanagata_part as kp")
      .select("kp.*", "k.id_kanagata", "kpc.name as part_category")
      .join("kanagata as k", "kp.id_kanagata", "k.id_kanagata")
      .join("kanagata_part_category as kpc", "kp.id_part_category", "kpc.id_part_category")
      .modify((query) => {
        id_product && query.where("kp.id_product", id_product)
        id_kanagata_part && query.where("kp.id_kanagata_part", id_kanagata_part)
      })
  },

  getCategory: (filters = {}) => {
    const { id_part_category } = filters
    return dbPool("kanagata_part_category as kpc")
      .select("kpc.*")
      .modify((query) => {
        id_part_category && query.where("kpc.id_part_category", id_part_category)
      })
  },

  getPartRequest: (filters = {}) => {
    const { id_kanagata, id_part_category, is_final, yearmonth } = filters
    return dbPool("kanagata_part_request as kpr")
      .select("kpr.*", "kp.name", "kp.id_kanagata", "kpc.name as category", "kpn.id_ncc", "kpn.note")
      .join("kanagata_part as kp", "kpr.id_kanagata_part", "kp.id_kanagata_part")
      .join("kanagata_part_category as kpc", "kp.id_part_category", "kpc.id_part_category")
      .leftJoin("kanagata_part_ncc as kpn", "kpr.id_request", "kpn.id_request")
      .modify((query) => {
        if (id_kanagata && id_kanagata !== 'ALL') {
          query.where("kp.id_kanagata", id_kanagata)
        }
        if (id_part_category && id_part_category !== 'ALL') {
          query.where("kpc.id_part_category", id_part_category)
        }
        if (is_final) {
          query.where("kpr.is_final", is_final)
        }
        if (yearmonth) {
          query.whereRaw("DATE_FORMAT(kpr.po, '%Y-%m') = ?", [yearmonth])
        }
      })
  },

  getInventoryPart: async (filters = {}) => {
    const { id_kanagata, id_part_category } = filters

    const flatData = await dbPool("kanagata_part as kp")
      .select(
        "kp.id_kanagata",
        "kp.name as part_name",
        "kp.id_kanagata_part",
        "kp.safety_stock",
        "kpc.name as category",
        dbPool.raw("COUNT(kpr.id_request) as stock")
      )
      .leftJoin("kanagata_part_category as kpc", "kp.id_part_category", "kpc.id_part_category")
      .leftJoin("kanagata_part_request as kpr", function () {
        this.on("kp.id_kanagata_part", "=", "kpr.id_kanagata_part")
          .andOn("kpr.is_final", "=", dbPool.raw("1"))
          .andOn("kpr.is_used", "=", dbPool.raw("0"));
      })
      .groupBy("kp.id_kanagata_part", "kpc.name")
      .modify((query) => {
        if (id_kanagata && id_kanagata !== 'ALL') {
          query.where("kp.id_kanagata", id_kanagata);
        }
        if (id_part_category && id_part_category !== 'ALL') {
          query.where("kp.id_part_category", id_part_category);
        }
      });

    return flatData
  }
}

module.exports = kanagataPartModel