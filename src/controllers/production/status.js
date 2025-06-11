const statusModel = require("../../models/production/status");
const { handleError, handleResponse } = require("../../utils/responseUtils");

const statusController = {
  getStatus: async (req, res) => {
    try {
      const status = await statusModel.getStatus();
      handleResponse(res, "Success", 200, status);
    } catch (error) {
      handleError(res, error);
    }
  },
};

module.exports = statusController;
