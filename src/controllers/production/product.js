const productModel = require("../../models/production/product");
const { handleError, handleResponse } = require("../../utils/responseUtils");
const { validationResult } = require("express-validator");

const productController = {
  getProduct: async (req, res) => {
    try {
      const product = await productModel.getProduct(req.query);
      handleResponse(res, "Success", 200, product);
    } catch (error) {
      handleError(res, error);
    }
  },
  createProduct: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      const { id_product } = req.body;

      const existingProduct = await productModel.getProduct({
        id_product,
      });

      if (existingProduct.length > 0) {
        return handleResponse(res, "Product already exists", 400);
      }

      await productModel.createProduct(req.body);
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      handleError(res, error);
    }
  },
  updateProduct: async (req, res) => {
    try {
      await productModel.updateProduct(req.params.id, req.body);
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      handleError(res, error);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const deleted = await productModel.deleteProduct(req.params.id);
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

module.exports = productController