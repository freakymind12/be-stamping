const dayjs = require("dayjs");
const dbPool = require("../../config/knex");

const machineModel = {
  createMachine: (data) => {
    return dbPool("machine").insert(data);
  },

  updateMachine: (id_machine, data) => {
    return dbPool("machine").where({ id_machine }).update(data);
  },

  deleteMachine: (id_machine) => {
    return dbPool("machine")
      .where({ id_machine })
      .update({ deleted_at: dayjs().format("YYYY-MM-DD HH:mm:ss") });
  },

  getMachine: (filters = {}) => {
    const { id_machine, address } = filters;
    return dbPool("machine")
      .select("*")
      .modify((query) => {
        if (!id_machine && !address) query.where({ deleted_at: null });
        if (id_machine) query.where({ id_machine });
        if (address) query.where({ address });
      });
  },
};

module.exports = machineModel;
