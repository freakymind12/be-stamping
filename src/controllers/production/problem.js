const problemModel = require("../../models/production/problem");
const { handleError, handleResponse } = require("../../utils/responseUtils");
const { validationResult } = require("express-validator");

const problemController = {
  getProblem: async (req, res) => {
    try {
      const problem = await problemModel.getProblem();
      handleResponse(res, "Success", 200, problem);
    } catch (error) {
      handleError(res, error);
    }
  },

  createProblem: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      await problemModel.createProblem(req.body);
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      handleError(res, error);
    }
  },

  updateProblem: async (req, res) => {
    try {
      await problemModel.updateProblem(req.params.id, req.body);
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      handleError(res, error);
    }
  },

  deleteProblem: async (req, res) => {
    try {
      const deleted = await problemModel.deleteProblem(req.params.id);
      if (deleted) {
        handleResponse(res, "Success", 200);
      } else {
        handleResponse(res, "Data not found", 404);
      }
    } catch (error) {
      handleError(res, error);
    }
  },
};

module.exports = problemController;
