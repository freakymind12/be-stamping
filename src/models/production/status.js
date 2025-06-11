const dbPool = require("../../config/knex");

const statusModel = {
  createStatus: ({ name }) => {
    return dbPool("status").insert({
      name,
    });
  },

  updateStatus: (id_status, data) => {
    return dbPool("status").where({ id_status }).update(data);
  },

  deleteStatus: (id_status) => {
    return dbPool("status").where({ id_status }).del();
  },

  getStatus: () => {
    return dbPool("status").select("*");
  },
};

module.exports = statusModel;
