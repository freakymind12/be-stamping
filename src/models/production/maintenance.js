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

  get: (filters = {}) => {
    const { start, end, id_machine, part, id_kanagata } = filters;
    return dbPool("log_maintenance_part")
      .select(
        "id_machine",
        "id_kanagata",
        "part",
        "shot",
        dbPool.raw("DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at")
      )
      .where("id_machine", id_machine)

      .orderBy("created_at", "desc")
      .modify((query) => {
        part && query.where("part", part);
        id_kanagata && query.where("id_kanagata", id_kanagata);
        if ((start, end)) {
          query.whereBetween("created_at", [
            start,
            dbPool.raw("DATE_ADD(?, INTERVAL 1 DAY)", [end]),
          ]);
        }
      });
  },

  create: (data) => {
    return dbPool("log_maintenance_part").insert(data)
  },

  update: (id_log_maintenance, data) => {
    return dbPool("log_maintenance_part").where({ id_log_maintenance }).update(data)
  },

  delete: (id_log_maintenance) => {
    return dbPool("log_maintenance_part").where({ id_log_maintenance }).del()
  }
};

module.exports = maintenanceModel;
