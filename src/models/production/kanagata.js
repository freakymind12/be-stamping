const dayjs = require("dayjs");
const dbPool = require("../../config/knex");

const kanagataModel = {
  createKanagata: (data) => {
    return dbPool("kanagata").insert(data);
  },

  updateKanagata: (id_kanagata, data) => {
    return dbPool("kanagata").where({ id_kanagata }).update(data);
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
};

module.exports = kanagataModel