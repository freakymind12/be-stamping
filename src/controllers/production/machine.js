const { validationResult } = require("express-validator");
const machineModel = require("../../models/production/machine");
const { handleError, handleResponse } = require("../../utils/responseUtils");

const machineController = {
  getMachine: async (req, res) => {
    try {
      const machine = await machineModel.getMachine(req.query);
      handleResponse(res, "Success", 200, machine);
    } catch (error) {
      handleError(res, error);
    }
  },
  createMachine: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      const { id_machine, address } = req.body;

      const existingMachine = await machineModel.getMachine({
        id_machine,
        address,
      });

      if (existingMachine.length > 0) {
        return handleResponse(res, "ID machine or address already exists", 400);
      }

      await machineModel.createMachine(req.body);
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      if (error.errno === 1062) {
        handleResponse(res, "ID machine or address already exists", 400);
      } else {
        handleError(res, error);
      }
    }
  },
  updateMachine: async (req, res) => {
    try {
      await machineModel.updateMachine(req.params.id, req.body);
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      handleError(res, error);
    }
  },
  deleteMachine: async (req, res) => {
    try {
      const deleted = await machineModel.deleteMachine(req.params.id);
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

module.exports = machineController;
