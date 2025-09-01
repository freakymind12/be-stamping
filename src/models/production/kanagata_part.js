const dbPool = require("../../config/knex");

const kanagataPartModel = {
  createKanagataPart: (data) => {
    return dbPool("kanagata_part").insert(data)
  },

  createCategory: (data) => {
    return dbPool("kanagata_part_category").insert(data)
  },

  createPartRequest: (data) => {
    return dbPool("kanagata_part_request").insert({ ...data, id_request: dbPool.raw("uuid()") })
  },

  createNccPart: (data) => {
    return dbPool("kanagata_part_ncc").insert(data)
  },

  updateKanagataPart: (id_kanagata_part, data) => {
    return dbPool("kanagata_part").where({ id_kanagata_part }).update(data)
  },

  updateCategory: (id_part_category, data) => {
    return dbPool("kanagata_part_category").where({ id_part_category }).update(data)
  },

  updatePartRequest: (id_request, data) => {
    return dbPool("kanagata_part_request").where({ id_request }).update(data)
  },

  updateNccPart: (id_ncc, data) => {
    return dbPool("kanagata_part_ncc").where({ id_ncc }).update(data)
  },

  deleteKanagataPart: (id_kanagata_part) => {
    return dbPool("kanagata_part").where({ id_kanagata_part }).del()
  },

  deleteCategory: (id_part_category) => {
    return dbPool("kanagata_part_category").where({ id_part_category }).del()
  },

  deletePartRequest: (id_request) => {
    return dbPool("kanagata_part_request").where({ id_request }).del()
  },

  deleteNccPart: (id_ncc) => {
    return dbPool("kanagata_part_ncc").where({ id_ncc }).del()
  },

  getKanagataPart: (filters = {}) => {
    const { id_product, id_kanagata_part } = filters
    return dbPool("kanagata_part as kp")
      .select("kp.*", "k.id_kanagata", "kpc.name as part_category")
      .join("kanagata as k", "kp.id_kanagata", "k.id_kanagata")
      .join("kanagata_part_category as kpc", "kp.id_part_category", "kpc.id_part_category")
      .modify((query) => {
        id_product && query.where("kp.id_product", id_product)
        id_kanagata_part && query.where("kp.id_kanagata_part", id_kanagata_part)
      })
  },

  getCategory: (filters = {}) => {
    const { id_part_category } = filters
    return dbPool("kanagata_part_category as kpc")
      .select("kpc.*")
      .modify((query) => {
        id_part_category && query.where("kpc.id_part_category", id_part_category)
      })
  },

  getPartRequest: (filters = {}) => {
    const { id_kanagata, id_part_category, is_final, yearmonth } = filters
    return dbPool("kanagata_part_request as kpr")
      .select("kpr.*", "kp.name", "kp.id_kanagata", "kpc.name as category", "kpn.id_ncc", "kpn.note")
      .join("kanagata_part as kp", "kpr.id_kanagata_part", "kp.id_kanagata_part")
      .join("kanagata_part_category as kpc", "kp.id_part_category", "kpc.id_part_category")
      .leftJoin("kanagata_part_ncc as kpn", "kpr.id_request", "kpn.id_request")
      .modify((query) => {
        if (id_kanagata && id_kanagata !== 'ALL') {
          query.where("kp.id_kanagata", id_kanagata)
        }
        if (id_part_category && id_part_category !== 'ALL') {
          query.where("kpc.id_part_category", id_part_category)
        }
        if (is_final) {
          query.where("kpr.is_final", is_final)
        }
        if (yearmonth) {
          query.whereRaw("DATE_FORMAT(kpr.po, '%Y-%m') = ?", [yearmonth])
        }
      })
  },

  getInventoryPart: async (filters = {}) => {
    const { id_kanagata, id_part_category } = filters

    const flatData = await dbPool("kanagata_part as kp")
      .select(
        "kp.id_kanagata",
        "kp.name as part_name",
        "kp.id_kanagata_part",
        "kp.safety_stock",
        "kpc.name as category",
        dbPool.raw("COUNT(kpr.id_request) as stock")
      )
      .leftJoin("kanagata_part_category as kpc", "kp.id_part_category", "kpc.id_part_category")
      .leftJoin("kanagata_part_request as kpr", function () {
        this.on("kp.id_kanagata_part", "=", "kpr.id_kanagata_part")
          .andOn("kpr.is_final", "=", dbPool.raw("1"))
          .andOn("kpr.is_used", "=", dbPool.raw("0"));
      })
      .groupBy("kp.id_kanagata_part", "kpc.name")
      .modify((query) => {
        if (id_kanagata && id_kanagata !== 'ALL') {
          query.where("kp.id_kanagata", id_kanagata);
        }
        if (id_part_category && id_part_category !== 'ALL') {
          query.where("kp.id_part_category", id_part_category);
        }
      });

    return flatData
  },

  getPartUsageHistory: async (filters = {}) => {
    const { id_kanagata_part } = filters
    const [result] = await dbPool("kanagata_part_request as kp")
      .select(
        dbPool.raw("COUNT(is_used) as total_used"),
        "kp.id_kanagata_part",
        dbPool.raw(`JSON_ARRAYAGG(
            JSON_OBJECT('id_request', kp.id_request, 'entry', kp.arrival, 'used_date', kp.used_date) 
            ORDER BY kp.used_date DESC
          ) AS used_history`)
      )
      .where("kp.is_used", 1)
      .groupBy("kp.id_kanagata_part")
      .modify((query) => {
        if (id_kanagata_part) {
          query.where("kp.id_kanagata_part", id_kanagata_part)
        }
      })

    // Parse hasil used_history dari string ke JSON
    let used_history = []
    try {
      used_history = result && result.used_history ? JSON.parse(result.used_history) : []
    } catch (e) {
      used_history = []
    }
    const parsedResult = {
      ...result,
      used_history
    }

    return parsedResult
  },

  getPartBelowSafety: async (filters = {}) => {
    const { id_kanagata } = filters
    const subQuery = dbPool("kanagata_part as kp")
      .select(
        'kp.id_kanagata',
        'kp.id_kanagata_part',
        'kp.name',
        'kp.id_drawing',
        'kpc.name as category',
        'kp.safety_stock',
        dbPool.raw('COUNT(kpr.id_request) AS stock')
      )
      .leftJoin('kanagata_part_category as kpc', 'kp.id_part_category', 'kpc.id_part_category')
      .leftJoin('kanagata_part_request as kpr', function () {
        this.on('kp.id_kanagata_part', '=', 'kpr.id_kanagata_part')
          .andOn('kpr.is_used', '=', dbPool.raw('0'))
          .andOn('kpr.is_final', '=', dbPool.raw('1'));
      })
      .modify((query) => {
        if(id_kanagata != "ALL") {
          query.where("kp.id_kanagata", id_kanagata)
        }
      })
      .groupBy(
        'kp.id_kanagata',
        'kp.id_kanagata_part',
        'kpc.name',
        'kp.safety_stock'
      )
      .havingRaw('kp.safety_stock > stock');

    const mainQuery = dbPool
      .select(
        'T.id_kanagata',
        dbPool.raw(`
        JSON_UNQUOTE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id_kanagata_part', T.id_kanagata_part,
              'id_drawing', T.id_drawing,
              'name', T.name,
              'category', T.category,
              'safety_stock', T.safety_stock,
              'stock', T.stock
            )
          )
        ) AS parts
      `)
      )
      .from(subQuery.as('T'))
      .groupBy('T.id_kanagata');

    try {
      const result = await mainQuery
      const parsedResult = result.map(row => ({
        ...row,
        parts: JSON.parse(row.parts)
      }));
      return parsedResult
    } catch (error) {
      console.error("Error fetching data part below safety", error)
    }
  },

  getInventoryReport: async (filters = {}) => {
    const { yearmonth } = filters;

    try {
      const report = await dbPool("kanagata as k")
        .select(
          'k.id_kanagata',
          dbPool.raw('SUM(IF(DATE_FORMAT(kpr.used_date, "%Y-%m") = ?, kpr.price, 0)) AS used_cost', [yearmonth]),
          dbPool.raw('SUM(IF(DATE_FORMAT(kpr.used_date, "%Y-%m") = ?, 1, 0)) AS used_part', [yearmonth]),
          dbPool.raw('SUM(IF(DATE_FORMAT(kpr.po, "%Y-%m") = ?, 1, 0)) AS ordered_part', [yearmonth]),
          dbPool.raw('SUM(IF(DATE_FORMAT(kpr.po, "%Y-%m") = ?, kpr.price, 0)) AS ordered_cost', [yearmonth]),
        )
        .leftJoin('kanagata_part as kp', 'k.id_kanagata', 'kp.id_kanagata')
        .leftJoin('kanagata_part_request as kpr', function () {
          // Menggunakan fungsi untuk menggabungkan kondisi 'ON' dengan 'AND'
          this.on('kp.id_kanagata_part', '=', 'kpr.id_kanagata_part')
            .andOn('kpr.is_final', '=', 1);
        })
        .groupBy('k.id_kanagata')
        .orderBy('k.id_kanagata', 'asc')

      const most_expensive_part = await dbPool("kanagata_part_request as kpr")
        .select(
          "kpr.id_kanagata_part",
          "kp.name",
          "kpr.po",
          dbPool.raw("MAX(kpr.price) as price")
        )
        .join("kanagata_part as kp", "kpr.id_kanagata_part", "kp.id_kanagata_part")
        .where('kpr.is_final', 1)
        .andWhere(dbPool.raw('DATE_FORMAT(kpr.po, "%Y-%m") = ?', [yearmonth]))
        .first()

      const slow_moving_part = await dbPool('kanagata_part_request')
        .count('* as total_parts')
        .where('is_final', 1)
        .andWhere(dbPool.raw('DATEDIFF(used_date, po) > ?', [90]))
        .first()

      const lead_time = await dbPool('kanagata_part_request as kpr')
        .select([
          dbPool.raw('MAX(DATEDIFF(kpr.arrival, kpr.po)) AS longest'),
          dbPool.raw('MIN(DATEDIFF(kpr.arrival, kpr.po)) AS shortest'),
          dbPool.raw('ROUND(AVG(DATEDIFF(kpr.arrival, kpr.po)), 2) AS average'),
          dbPool.raw('? as unit', ['day'])
        ])
        .whereNotNull('kpr.po')
        .whereNotNull('kpr.arrival')
        .andWhere(dbPool.raw('DATE_FORMAT(kpr.po, "%Y-%m") = ?', [yearmonth]))
        .first()

      const on_progress = await dbPool('kanagata_part_request as kpr')
        .select(
          dbPool.raw('COUNT(kpr.id_request) as total')
        )
        .where('is_final', 0)
        .andWhere(dbPool.raw('DATE_FORMAT(kpr.po, "%Y-%m") = ?', [yearmonth]))
        .first()

      return {
        report,
        most_expensive_part,
        slow_moving_part: slow_moving_part.total_parts,
        lead_time,
        on_progress: on_progress.total
      }
    } catch (error) {
      console.error('Error query data inventory report', error)
    }
  },

  getInventoryReportKanagata: async (filters = {}) => {
    const { yearmonth, id_kanagata } = filters

    const report = await dbPool("kanagata_part_request as kpr")
      .select(
        'kpr.id_kanagata_part',
        'kp.name',
        dbPool.raw('COUNT(kpr.id_request) as used_part'),
        dbPool.raw('SUM(kpr.price) as cost'),
        dbPool.raw(`
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id_request', kpr.id_request,
              'used_date', DATE_FORMAT(kpr.used_date, '%Y-%m-%d')
            )
          ) as history_used
        `)
      )
      .join('kanagata_part as kp', 'kp.id_kanagata_part', 'kpr.id_kanagata_part')
      .whereRaw('DATE_FORMAT(kpr.used_date, "%Y-%m") = ?', [yearmonth])
      .andWhere('kp.id_kanagata', id_kanagata)
      .groupBy('kpr.id_kanagata_part')
      .orderBy('kpr.id_kanagata_part', 'asc');

    // Parse JSON string menjadi array of objects
    const parsedReport = report.map(item => ({
      ...item,
      history_used: item.history_used ? JSON.parse(item.history_used) : []
    }));
    return parsedReport;
  }
}

module.exports = kanagataPartModel