const finalStatusModel = require("../../models/production/final_status");
const { handleError, handleResponse } = require("../../utils/responseUtils");
const { validationResult } = require("express-validator");

const finalStatusController = {
  getFinalStatus: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return handleResponse(res, "Bad Request", 400, null, errors.array());
      }

      const data = await finalStatusModel.getFinalStatus(req.query);
      handleResponse(res, "Success", 200, data);
    } catch (error) {
      handleError(res, error);
    }
  },
};

module.exports = finalStatusController;
