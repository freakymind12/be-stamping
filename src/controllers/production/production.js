const productionModel = require("../../models/production/production");
const { handleError, handleResponse } = require("../../utils/responseUtils");
const { validationResult } = require("express-validator");
const generateDateRange = require("../../utils/generateDateRange");
const formatDataTrend = require("../../utils/formatDataTrend");
const formatDataOee = require("../../utils/formatDataOee");

const productionController = {
  getProduction: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return handleResponse(res, "Bad Request", 400, null, errors.array());
      }

      const data = await productionModel.getProduction(req.query);
      handleResponse(res, "Success", 200, data);
    } catch (error) {
      handleError(res, error);
    }
  },

  getTrendProduction: async (req, res) => {
    const { start, end } = req.query;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return handleResponse(res, "Bad Request", 400, null, errors.array());
      }
      const data = await productionModel.getProduction(req.query);
      const dateRange = generateDateRange({ dateStart: start, dateEnd: end });
      const formattedData = formatDataTrend(dateRange, data);
      handleResponse(res, "Success", 200, formattedData);
    } catch (error) {
      handleError(res, error);
    }
  },

  getPpmStatistic: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return handleResponse(res, "Bad Request", 400, null, errors.array());
      }

      const data = await productionModel.getPpm(req.query);
      handleResponse(res, "Success", 200, data);
    } catch (error) {
      handleError(res, error);
    }
  },

  getOeeStatistic: async (req, res) => {
    const { year, month } = req.query;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return handleResponse(res, "Bad Request", 400, null, errors.array());
      }

      const data = await productionModel.getOee(req.query);
      const dateRange = generateDateRange({ year, month });
      const formattedData = formatDataOee(dateRange, data);
      handleResponse(res, "Success", 200, formattedData);
    } catch (error) {
      handleError(res, error);
    }
  },

  getProductionMonthly: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return handleResponse(res, "Bad Request", 400, null, errors.array());
      }

      const data = await productionModel.getProductionMonthly(req.query);
      handleResponse(res, "Success", 200, data);
    } catch (error) {
      handleError(res, error);
    }
  },

  getMonthlyOee: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return handleResponse(res, "Bad Request", 400, null, errors.array());
      }
      const [data] = await productionModel.getMonthlyOee(req.query);

      const formattedData = {
        availability: Number(data?.availability ?? 0),
        productivity: Number(data?.productivity ?? 0),
        quality: Number(data?.quality ?? 0),
        oee: Number(data?.oee ?? 0),
      };

      handleResponse(res, "Success", 200, formattedData);
    } catch (error) {
      handleError(res, error);
    }
  },

  getProductionFiscal: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return handleResponse(res, "Bad Request", 400, null, errors.array());
      }
      const data = await productionModel.getProductionFiscal(req.query);
      handleResponse(res, "Success", 200, data);
    } catch (error) {
      handleError(res, error);
    }
  },

  getSalesandRejectCost: async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return handleResponse(res, "Bad Request", 400, null, errors.array())
      }
      const data = await productionModel.getSummarySalesandRejectCost(req.query)
      return handleResponse(res, "Success", 200, data)
    } catch (error) {
      handleError(res, error)
    }
  },

  updateProduction: async (req, res) => {
    try {
      await productionModel.updateProduction(req.params.id, req.body);
      handleResponse(res, "Success", 200);
    } catch (error) {
      handleError(res, error);
    }
  },

  deleteProduction: async (req, res) => {
    try {
      const deleted = await productionModel.deleteProduction(req.params.id);
      if (deleted) {
        handleResponse(res, "Success", 200);
      } else {
        handleResponse(res, "Data not found", 404);
      }
    } catch (error) {
      handleError(res, error);
    }
  },

  createProduction: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      await productionModel.createProduction(req.body);
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      handleError(res, error);
    }
  },
};

module.exports = productionController;
