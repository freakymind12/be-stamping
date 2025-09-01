const dayjs = require("dayjs")
const dbPool = require("../../config/knex")

const supplierModel = {
  createSupplier: (data) => {
    return dbPool("supplier").insert(data)
  },

  updateSupplier: (id_supplier, data) => {
    return dbPool("supplier").where({ id_supplier }).update(data)
  },

  deleteSupplier: (id_supplier) => {
    return dbPool("supplier").where({ id_supplier }).del()
  },

  getSupplier: (filters = {}) => {
    const { id_supplier, location } = filters
    return dbPool("supplier")
      .select("*")
      .modify((query) => {
        if (id_supplier) query.where({ id_supplier })
        if (location) query.where({ location })
      })
  }
}

module.exports = supplierModel