const dayjs = require("dayjs");
const dbPool = require("../../config/knex");

const productModel = {
  createProduct: (data) => {
    return dbPool("product").insert(data);
  },
  updateProduct: (id_product, data) => {
    return dbPool("product").where({ id_product }).update(data);
  },
  deleteProduct: (id_product) => {
    return dbPool("product")
      .where({ id_product })
      .update({ deleted_at: dayjs().format("YYYY-MM-DD HH:mm:ss") });
  },
  getProduct: (filters = {}) => {
    const { id_product } = filters;
    return dbPool("product")
      .select("*")
      .where({ deleted_at: null })
      .modify((query) => {
        if (id_product) query.where({ id_product });
      })
      .orderBy("name", "asc");
  },
};

module.exports = productModel;
