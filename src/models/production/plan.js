const dbPool = require("../../config/knex");
const dayjs = require("dayjs");

const planModel = {
  createPlan: (data) => {
    return dbPool("plan").insert(data);
  },
  updatePlan: (id_plan, data) => {
    return dbPool("plan").where({ id_plan }).update(data);
  },
  deletePlan: (id_plan) => {
    return dbPool("plan").where({ id_plan }).delete();
  },

  getPlan: async (filters = {}) => {
    const { id_plan, id_pca, year, month, id_machine, mode } = filters;
    let query = dbPool("plan as p")
      .select(
        "p.id_plan",
        "p.id_pca",
        "p.qty",
        "p.shift",
        "p.time_plan",
        dbPool.raw("DATE_FORMAT(p.start, '%Y-%m-%d %H:%i') as start"),
        dbPool.raw("DATE_FORMAT(p.end, '%Y-%m-%d %H:%i') as end"),
        "pca.id_kanagata",
        "pca.id_machine",
        "pca.id_product",
        "product.name"
      )
      .join("pca", "p.id_pca", "pca.id_pca")
      .join("product", "pca.id_product", "product.id_product")
      .orderBy("p.start", "asc")
      .modify((query) => {
        if (id_plan) query.where("p.id_plan", id_plan);
        if (id_pca) query.where("p.id_pca", id_pca);
        if (year) query.where(dbPool.raw("YEAR(p.start)"), year);
        if (month) query.where(dbPool.raw("MONTH(p.start)"), month);
        if (id_machine) query.where("pca.id_machine", id_machine);
        if (mode === "unlinked") {
          query.whereNotExists(function () {
            this.select("*")
              .from("production as pr")
              .whereRaw("pr.id_plan = p.id_plan");
          });
        }
      });
    return await query;
  },

  // query untuk validasi data plan baru
  validationNewPlan: (filters = {}) => {
    const { start, end, id_pca, shift, id_plan } = filters;
    return dbPool("plan as p")
      .select(
        "p.id_plan",
        "pca.id_machine",
        "pca.id_product",
        "pca.id_kanagata",
        "p.qty",
        "p.shift",
        dbPool.raw("DATE_FORMAT(p.start, '%Y-%m-%d %H:%i') as start"),
        dbPool.raw("DATE_FORMAT(p.end, '%Y-%m-%d %H:%i') as end")
      )
      .join("pca", "p.id_pca", "pca.id_pca")
      .where("p.start", "like", `${start.split(" ")[0]}%`)
      .where("p.end", "like", `${end.split(" ")[0]}%`)
      .where("p.shift", shift)
      .where("p.id_pca", id_pca)
      .modify((query) => {
        if (id_plan) query.where("p.id_plan", id_plan);
      });
  },

  getPlanByShift: (filters = {}) => {
    const { id_pca, shift, start } = filters;
    const startDate = `${start} 00:00:00`;
    const endDate = `${dayjs(start)
      .add(1, "day")
      .format("YYYY-MM-DD")} 00:00:00`;

    return dbPool("plan")
      .select("id_plan")
      .where("id_pca", id_pca)
      .andWhere("shift", shift)
      .andWhere("start", ">=", startDate)
      .andWhere("start", "<", endDate)
      .andWhere("deleted_at", null)
      .orderBy("start", "desc")
      .limit(1);
  },
};

module.exports = planModel;
