const { validationResult } = require("express-validator");
const maintenanceModel = require("../../models/production/maintenance");
const { handleError, handleResponse } = require("../../utils/responseUtils");

const maintenanceController = {
  getLatestMaintenancePart: async (req, res) => {
    try {
      const errors = validationResult(req);

      // Jika ada error validasi, kirim respon error
      if (!errors.isEmpty()) {
        return handleResponse(res, "Bad Request", 400, null, errors.array());
      }

      const data = await maintenanceModel.getLatestMaintenancePart(req.query);
      handleResponse(res, "Success", 200, data);
    } catch (error) {
      handleError(res, error);
    }
  },

  getHistoryMaintenance: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return handleResponse(res, "Bad Request", 400, null, errors.array());
      }

      const data = await maintenanceModel.get(req.query);
      handleResponse(res, "Success", 200, data);
    } catch (error) {
      handleError(res, error);
    }
  },
};

module.exports = maintenanceController;
