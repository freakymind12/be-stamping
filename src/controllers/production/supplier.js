const { validationResult } = require("express-validator");
const supplierModel = require("../../models/production/supplier");
const { handleError, handleResponse } = require("../../utils/responseUtils");

const supplierController = {
  getSupplier: async (req, res) => {
    try {
      const supplier = await supplierModel.getSupplier(req.query);
      handleResponse(res, "Success", 200, supplier);
    } catch (error) {
      handleError(res, error);
    }
  },

  createSupplier: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      await supplierModel.createSupplier(req.body);
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      handleError(res, error)
    }
  },

  updateSupplier: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      const { id_supplier } = req.params;

      // Check if supplier exists
      const existingSupplier = await supplierModel.getSupplier({ id_supplier });
      if (existingSupplier.length === 0) {
        return handleResponse(res, "Supplier not found", 404);
      }

      await supplierModel.updateSupplier(id_supplier, req.body);
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      handleError(res, error);
    }
  },

  deleteSupplier: async (req, res) => {
    try {
      const { id_supplier } = req.params;

      // Check if supplier exists
      const existingSupplier = await supplierModel.getSupplier({ id_supplier });
      if (existingSupplier.length === 0) {
        return handleResponse(res, "Supplier not found", 404);
      }

      const deleted = await supplierModel.deleteSupplier(id_supplier);
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

module.exports = supplierController;
