const dbPool = require("../../config/knex");
const dayjs = require("dayjs");

const pcaModel = {
  createPca: (data) => {
    return dbPool("pca").insert(data);
  },
  updatePca: (id_pca, data) => {
    return dbPool("pca").where({ id_pca }).update(data);
  },
  deletePca: (id_pca) => {
    return dbPool("pca")
      .where({ id_pca })
      .update({ deleted_at: dayjs().format("YYYY-MM-DD HH:mm:ss") });
  },
  getPca: async (filters = {}) => {
    const { id_pca, id_machine, id_kanagata, id_product } = filters;
    let query = dbPool("pca")
      .select(
        "pca.id_pca",
        "pca.id_machine",
        "pca.id_product",
        "pca.id_kanagata",
        "pca.speed",
        "pca.created_at",
        "pca.updated_at",
        "product.name as name",
        "kanagata.cavity"
      )
      .join("product", "pca.id_product", "product.id_product")
      .join("kanagata", "pca.id_kanagata", "kanagata.id_kanagata")
      .whereNull("pca.deleted_at")
      .orderBy("pca.id_machine");

    // Jika ada filter by id_pca
    if (id_pca) {
      query = query.where("pca.id_pca", id_pca);
    }

    // Jika ada filter by id_product
    if (id_product) {
      query = query.where("pca.id_product", id_product);
    }

    if (id_machine) {
      query = query.where("pca.id_machine", id_machine);
    }

    if (id_kanagata) {
      query = query.where("pca.id_kanagata", id_kanagata);
    }

    return await query;
  },
};

module.exports = pcaModel;
