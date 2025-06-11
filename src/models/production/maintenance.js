const dbPool = require("../../config/knex");

const maintenanceModel = {
  getLatestMaintenancePart: (filters = {}) => {
    const { id_machine } = filters;
    return dbPool("log_maintenance_part as lmp")
      .select(
        "lmp.id_machine",
        "lmp.part",
        dbPool.raw(
          "DATE_FORMAT(lmp.created_at, '%Y-%m-%d %H:%i') as created_at"
        )
      )
      .join(
        dbPool("log_maintenance_part")
          .select("part")
          .max("created_at as latest_created_at")
          .groupBy("part")
          .as("latest"),
        function () {
          this.on("lmp.part", "=", "latest.part").andOn(
            "lmp.created_at",
            "=",
            "latest.latest_created_at"
          );
        }
      )
      .where("lmp.id_machine", id_machine)
      .orderBy("lmp.part", "asc");
  },

  getHistoryMaintenance: (filters = {}) => {
    const { start, end, id_machine, part } = filters;
    return dbPool("log_maintenance_part")
      .select(
        "id_machine",
        "part",
        dbPool.raw("DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at")
      )
      .where("id_machine", id_machine)

      .orderBy("created_at", "desc")
      .modify((query) => {
        if (part) {
          query.where("part", part);
        }
        if ((start, end)) {
          query.whereBetween("created_at", [
            start,
            dbPool.raw("DATE_ADD(?, INTERVAL 1 DAY)", [end]),
          ]);
        }
      });
  },
};

module.exports = maintenanceModel;
