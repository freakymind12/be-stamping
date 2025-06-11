const { validationResult } = require("express-validator");
const planModel = require("../../models/production/plan");
const pcaModel = require("../../models/production/pca");
const { handleError, handleResponse } = require("../../utils/responseUtils");

const planController = {
  createPlan: async (req, res) => {
    const errros = validationResult(req);
    if (!errros.isEmpty()) {
      return handleResponse(res, "Bad request", 400, null, errros.array());
    }
    try {
      const { id_pca, qty } = req.body;
      const validation = await planModel.validationNewPlan(req.body);
      
      if (validation.length > 0) {
        return handleResponse(res, "Plan already exists", 400);
      }
      const [pcaData] = await pcaModel.getPca({ id_pca });
      const time_plan = (qty / (pcaData.speed * pcaData.cavity)).toFixed(1);

      await planModel.createPlan({ ...req.body, time_plan });
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      handleError(res, error);
    }
  },
  updatePlan: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      const { id_pca, qty } = req.body;

      const [pcaData] = await pcaModel.getPca({ id_pca });
      const time_plan = (qty / (pcaData.speed * pcaData.cavity)).toFixed(1);

      await planModel.updatePlan(req.params.id, { ...req.body, time_plan });
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      handleError(res, error);
    }
  },
  getPlan: async (req, res) => {
    try {
      const plan = await planModel.getPlan(req.query);
      handleResponse(res, "Success", 200, plan);
    } catch (error) {
      handleError(res, error);
    }
  },
  deletePlan: async (req, res) => {
    try {
      const deleted = await planModel.deletePlan(req.params.id);
      if (deleted) {
        handleResponse(res, "Success", 200);
      } else {
        handleResponse(res, "Data not found", 404);
      }
    } catch (error) {
      if (error.errno == 1451){
        return handleResponse(res, "This plan is linked with production data you can't delete", 409)
      }
      handleError(res, error);
    }
  },
};

module.exports = planController;
