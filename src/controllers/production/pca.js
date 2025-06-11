const { validationResult } = require("express-validator");
const pcaModel = require("../../models/production/pca");
const { handleResponse, handleError } = require("../../utils/responseUtils");

const pcaController = {
  getPca: async (req, res) => {
    try {
      const pca = await pcaModel.getPca(req.query);
      handleResponse(res, "Success", 200, pca);
    } catch (error) {
      handleError(res, error);
    }
  },
  updatePca: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      await pcaModel.updatePca(req.params.id, req.body);
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      handleError(res, error);
    }
  },
  createPca: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      const duplicate = await pcaModel.getPca(req.body);

      if (duplicate.length > 0) {
        return handleResponse(
          res,
          "Data PCA with this data already exists",
          400
        );
      }

      await pcaModel.createPca(req.body);
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      handleError(res, error);
    }
  },
  deletePca: async (req, res) => {
    try {
      const deleted = await pcaModel.deletePca(req.params.id);
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

module.exports = pcaController;
