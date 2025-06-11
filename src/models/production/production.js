const dayjs = require("dayjs");
const dbPool = require("../../config/knex");

const productionModel = {
  getProduction: (filters = {}) => {
    const { year, month, id_machine, start, end } = filters;
    return dbPool("production as p")
      .select(
        "p.id_production",
        dbPool.raw("DATE_FORMAT(p.date,'%Y-%m-%d %H:%i:%s') AS date"),
        "p.shift",
        dbPool.raw("(p.ok - p.ng) as ok"),
        "p.ng",
        "p.reject_setting",
        // dbPool.raw("(p.reject_setting - p.dummy) as reject_setting"),
        "p.dummy",
        "p.production_time",
        "p.stop_time",
        "p.dandori_time",
        "pca.id_pca",
        "pca.id_machine",
        "pca.id_product",
        "pca.id_kanagata",
        "product.name",
        "p.machine_shot",
        "p.kanagata_shot",
        "plan.id_plan",
        dbPool.raw(
          `TRUNCATE(
          (p.ok - p.ng) / ((p.production_time + p.dandori_time + p.stop_time) * kanagata.cavity * pca.speed) * 100, 
          2
        ) as kadoritsu`
        ),
        "plan.qty as qty_plan",
        dbPool.raw(
          `TRUNCATE(
          ((p.ok - p.ng) / plan.qty) * 100, 
          1
        ) as bekidoritsu`
        )
      )
      .join("pca", "p.id_pca", "pca.id_pca")
      .join("product", "pca.id_product", "product.id_product")
      .join("kanagata", "pca.id_kanagata", "kanagata.id_kanagata")
      .leftJoin("plan", "p.id_plan", "plan.id_plan")
      .modify((query) => {
        if (id_machine) query.where("pca.id_machine", id_machine);
        if (year) query.whereRaw("YEAR(p.date) = ?", [year]);
        if (month) query.whereRaw("MONTH(p.date) = ?", [month]);
        if (start && end)
          query
            .whereRaw("DATE(p.date) BETWEEN ? AND ?", [start, end])
            .orderBy("p.date", "asc");
      })
      .whereNull("p.deleted_at")
      .orderBy("p.date", "desc");
  },

  getPpm: (filters = {}) => {
    const { id_machine, start, end } = filters;
    return dbPool("production as p")
      .select([
        dbPool.raw("SUM(p.ok - p.ng) AS total_ok"),
        dbPool.raw("SUM(p.ng) AS total_rip"),
        // dbPool.raw("SUM(p.reject_setting - p.dummy) AS total_rs"),
        dbPool.raw("SUM(p.reject_setting) AS total_rs"),
        dbPool.raw("SUM(p.dummy) AS total_dummy"),
        dbPool.raw("SUM(p.stop_time) AS total_stoptime"),
        dbPool.raw(
          "ROUND(SUM(p.ng) / NULLIF(SUM(p.ok) + SUM(p.ng), 0) * 1000000) AS rip_ppm"
        ),
        dbPool.raw(
          "ROUND(SUM(p.reject_setting) / NULLIF(SUM(p.ok) + SUM(p.ng), 0) * 1000000) AS rs_ppm"
        ),
        dbPool.raw(
          "ROUND(SUM(p.dummy) / NULLIF(SUM(p.ok) + SUM(p.ng), 0) * 1000000) AS dummy_ppm"
        ),
      ])
      .innerJoin("pca", "p.id_pca", "pca.id_pca")
      .innerJoin("product", "pca.id_product", "product.id_product")
      .modify((query) => {
        if (id_machine) query.where("pca.id_machine", id_machine);
        if (start && end)
          query.whereRaw("DATE(p.date) BETWEEN ? AND ?", [start, end]);
      })
      .whereNull("p.deleted_at")
      .orderBy("p.date", "asc");
  },

  getOee: (filters = {}) => {
    const { year, month, id_machine } = filters;
    return dbPool("production as p")
      .select([
        "pca.id_machine",
        dbPool.raw("DATE_FORMAT(p.date, '%Y-%m-%d') AS date"),
        dbPool.raw(
          "TRUNCATE((SUM(p.production_time) / NULLIF(SUM(p.production_time) + SUM(p.stop_time), 0)) * 100, 1) AS availability"
        ),
        dbPool.raw(
          "TRUNCATE((SUM(p.ok) / NULLIF(SUM(plan.qty), 0)) * 100, 1) AS productivity"
        ),
        dbPool.raw(
          "TRUNCATE((SUM(p.ok - p.ng) / NULLIF(SUM(p.ok), 0)) * 100, 1) AS quality"
        ),
        dbPool.raw(
          `TRUNCATE(
          ( (SUM(p.production_time) / NULLIF(SUM(plan.time_plan), 0)) * 
            (SUM(p.ok) / NULLIF(SUM(plan.qty), 0)) * 
            (SUM(p.ok - p.ng) / NULLIF(SUM(p.ok), 0)) ) * 100, 1
        ) AS oee`
        ),
      ])
      .join("pca", "p.id_pca", "pca.id_pca")
      .leftJoin("plan", "p.id_plan", "plan.id_plan")
      .whereNull("p.deleted_at")
      .groupByRaw("DATE(p.date)")
      .modify((query) => {
        if (id_machine) query.where("pca.id_machine", id_machine);
        if (year && month)
          query.whereRaw("YEAR(p.date) = ? AND MONTH(p.date) = ?", [
            year,
            month,
          ]);
        if (year && !month) query.whereRaw("YEAR(p.date) = ?", [year]);
      });
  },

  // Total Machine or Grouping Product
  getProductionMonthly: (filters = {}) => {
    const { id_machine, year, month, grouping } = filters;
    return (
      dbPool("production as p")
        .select([
          dbPool.raw("YEAR(p.date) as year"),
          // dbPool.raw("MONTH(p.date) as month"),
          dbPool.raw("SUM(p.ok - p.ng) as ok"),
          dbPool.raw("SUM(p.ng) as rip"),
          dbPool.raw("SUM(p.reject_setting) AS reject_setting"),
          dbPool.raw("SUM(p.dummy) as dummy"),
          dbPool.raw("SUM(p.stop_time) as stop_time"),
          dbPool.raw(
            "TRUNCATE(SUM((p.ok - p.ng) * product.price), 2) as sales"
          ),
          dbPool.raw("SUM(p.production_time) as production_time"),
          dbPool.raw("SUM(p.dandori_time) as dandori_time"),
          dbPool.raw(
            "TRUNCATE(SUM(p.production_time) / NULLIF(SUM(p.stop_time) + SUM(p.dandori_time) + SUM(p.production_time), 0) * 100, 1) AS kadoritsu"
          ),
        ])
        .innerJoin("pca", "p.id_pca", "pca.id_pca")
        .innerJoin("product", "pca.id_product", "product.id_product")
        .whereRaw("YEAR(p.date) = ?", [year])
        .whereNull("p.deleted_at")
        .modify((query) => {
          if (month)
            query
              .column(dbPool.raw("MONTH(p.date) as month"))
              .whereRaw("MONTH(p.date) = ?", [month])
          if (id_machine) query.where("pca.id_machine", id_machine);
          if (grouping === "product")
            query
              .select("product.name")
              .groupBy("product.name")
              .orderBy("product.name", "asc");
          if (grouping === "machine")
            query
              .select("pca.id_machine")
              .groupBy("pca.id_machine")
              .orderBy("pca.id_machine", "asc");
        })
    );
  },

  getMonthlyOee: (filters = {}) => {
    const { id_machine, year, month } = filters;
    return dbPool("production as p")
      .select([
        dbPool.raw(
          "TRUNCATE(SUM(p.production_time) / NULLIF((SUM(p.production_time) + SUM(p.stop_time)), 0) * 100, 1) AS availability"
        ),
        dbPool.raw(
          "TRUNCATE(SUM(p.ok) / NULLIF(SUM(plan.qty), 0) * 100, 1) AS productivity"
        ),
        dbPool.raw(
          "TRUNCATE(SUM(p.ok - p.ng) / NULLIF(SUM(p.ok), 0) * 100, 1) AS quality"
        ),
        dbPool.raw(
          "TRUNCATE((SUM(p.production_time) / NULLIF(SUM(plan.time_plan), 0) * 100) * " +
          "(SUM(p.ok) / NULLIF(SUM(plan.qty), 0) * 100) * " +
          "(SUM(p.ok - p.ng) / NULLIF(SUM(p.ok), 0) * 100) / 10000, 1) AS oee"
        ),
      ])
      .join("pca", "p.id_pca", "pca.id_pca")
      .leftJoin("plan", "p.id_plan", "plan.id_plan")
      .where("pca.id_machine", id_machine)
      .whereRaw("YEAR(p.date) = ?", [year])
      .whereRaw("MONTH(p.date) = ?", [month])
      .whereNull("p.deleted_at");
  },

  getProductionFiscal: async (filters = {}) => {
    const { year, id_machine } = filters;
    return dbPool("production as p")
      .select(
        dbPool.raw("YEAR(p.date) AS year"),
        dbPool.raw("MONTH(p.date) AS month"),
        dbPool.raw("SUM(p.ok - p.ng) AS ok"),
        dbPool.raw("SUM(p.ng) AS ng"),
        dbPool.raw("SUM(p.reject_setting) AS reject_setting"),
        dbPool.raw("SUM(p.dummy) AS dummy"),
        dbPool.raw("SUM(p.production_time) AS production_time"),
        dbPool.raw("SUM(p.dandori_time) AS dandori_time"),
        dbPool.raw("SUM(p.stop_time) AS stop_time"),
        dbPool.raw(`
        ROUND(
          SUM(p.production_time) / NULLIF(SUM(p.stop_time) + SUM(p.dandori_time) + SUM(p.production_time), 0) * 100, 1
        ) AS kadoritsu
      `)
      )
      .join("pca", "p.id_pca", "pca.id_pca")
      .whereBetween("p.date", [`${year}-04-01`, `${Number(year) + 1}-03-31`])
      .whereNull("p.deleted_at")
      .groupByRaw("YEAR(p.date), MONTH(p.date)")
      .modify((query) => {
        if (id_machine) query.where("pca.id_machine", id_machine);
      });
  },

  getSummarySalesandRejectCost: (filters = {}) => {
    const { year } = filters;
    return dbPool('production as p')
      .select(
        dbPool.raw('YEAR(p.date) as year'),
        dbPool.raw('MONTH(p.date) as month'),
        dbPool.raw('TRUNCATE(SUM((p.ok - p.ng) * product.price), 2) as sales'),
        dbPool.raw('TRUNCATE(SUM((p.reject_setting - p.dummy + p.ng + p.dummy) * product.price), 2) as reject_cost')
      )
      .join('pca', 'p.id_pca', 'pca.id_pca')
      .join('product', 'pca.id_product', 'product.id_product')
      .whereBetween('p.date', [`${year}-04-01`, `${Number(year) + 1}-03-31`])
      .whereNull('p.deleted_at')
      .groupByRaw('YEAR(p.date), MONTH(p.date)')
  },
  
  createProduction: (data) => {
    return dbPool("production").insert(data);
  },

  updateProduction: (id_production, data) => {
    return dbPool("production").where({ id_production }).update(data);
  },

  deleteProduction: (id_production) => {
    return dbPool("production")
      .where({ id_production })
      .update({
        deleted_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        id_plan: null,
      });
  },
};

module.exports = productionModel;
