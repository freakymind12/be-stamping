const dbPool = require("../../config/knex");
const dayjs = require("dayjs");

const problemModel = {
  createProblem: (data) => {
    return dbPool("problem").insert(data);
  },
  updateProblem: (id_problem, data) => {
    return dbPool("problem").where({ id_problem }).update(data);
  },
  deleteProblem: (id_problem) => {
    return dbPool("problem")
      .where({ id_problem })
      .update({ deleted_at: dayjs().format("YYYY-MM-DD HH:mm:ss") });
  },
  getProblem: () => {
    return dbPool("problem").select("*").where({ deleted_at: null });
  },
};

module.exports = problemModel;