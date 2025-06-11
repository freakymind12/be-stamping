const dbPool = require("../../config/knex");

const finalStatusModel = {
  getFinalStatus: (filters = {}) => {
    const { start, end, id_machine } = filters;
    return dbPool("final_status as fs")
      .select(
        "fs.id_final_status",
        "s.name as status",
        "p.name as stop_condition",
        "fs.id_machine",
        dbPool.raw(
          `CASE WHEN fs.power = 0 THEN 'OFF' 
        WHEN fs.power = 1 THEN 'ON' END as power`
        ),
        dbPool.raw("ROUND(fs.duration / 60, 1) as duration"),
        dbPool.raw("DATE_FORMAT(fs.start, '%Y-%m-%d %H:%i') as start"),
        dbPool.raw("DATE_FORMAT(fs.end, '%Y-%m-%d %H:%i') as end")
      )
      .join("status as s", "fs.id_status", "s.id_status")
      .join("problem as p", "fs.id_problem", "p.id_problem")
      .whereBetween(dbPool.raw("DATE(fs.start)"), [start, end])
      .andWhere("fs.id_machine", id_machine)
      .orderBy("fs.start", "desc");
  },
};

module.exports = finalStatusModel;
