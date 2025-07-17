const dayjs = require("dayjs");
const dbPool = require("../../config/knex");

const kanagataModel = {
  createKanagata: (data) => {
    return dbPool("kanagata").insert(data);
  },

  createKanagataResetCode: (data) => {
    return dbPool("kanagata_reset_code").insert(data)
  },

  updateKanagataResetCode: (code, data) => {
    return dbPool("kanagata_reset_code").where({code}).update(data)
  },

  updateKanagata: (id_kanagata, data) => {
    return dbPool("kanagata").where({ id_kanagata }).update(data);
  },

  deleteKanagataResetCode: (code) => {
    return dbPool("kanagata_reset_code").where({code}).del()
  },

  deleteKanagata: (id_kanagata) => {
    return dbPool("kanagata")
      .where({ id_kanagata })
      .update({ deleted_at: dayjs().format("YYYY-MM-DD HH:mm:ss") });
  },

  getKanagata: (filters = {}) => {
    const { id_kanagata } = filters;
    return dbPool("kanagata")
      .select("*")
      .where({ deleted_at: null })
      .modify((query) => {
        if (id_kanagata) query.where({ id_kanagata });
      });
  },

  getKanagataResetCode: (filters = {}) => {
    const { code } = filters
    return dbPool("kanagata_reset_code")
      .select("*")
      .modify((query) => {
        if (code) query.where({ code })
      })
  }
};

module.exports = kanagataModel