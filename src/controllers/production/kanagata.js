const { validationResult } = require("express-validator");
const { handleError, handleResponse } = require("../../utils/responseUtils");
const kanagataModel = require("../../models/production/kanagata");

const kanagataController = {
  getKanagata: async (req, res) => {
    try {
      const kanagata = await kanagataModel.getKanagata(req.query);
      handleResponse(res, "Success", 200, kanagata);
    } catch (error) {
      handleError(res, error);
    }
  },
  getKanagataResetCode: async (req, res) => {
    try {
      const kanagataResetCode = await kanagataModel.getKanagataResetCode(req.query)
      handleResponse(res, "Success", 200, kanagataResetCode)
    } catch (error) {
      handleError(res, error)
    }
  },
  createKanagata: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      const { id_kanagata } = req.body;

      const existingKanagata = await kanagataModel.getKanagata({ id_kanagata });

      if (existingKanagata.length > 0) {
        return handleResponse(res, "ID kanagata already exists", 400);
      }

      await kanagataModel.createKanagata(req.body);
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      handleError(res, error);
    }
  },
  createKanagataResetCode: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      const { code } = req.body
      const existingCode = await kanagataModel.getKanagataResetCode({ code });

      if (existingCode.length > 0) {
        return handleResponse(res, "Kanagata Reset code already exist", 400);
      }

      await kanagataModel.createKanagataResetCode(req.body)
      handleResponse(res, "Success", 200, req.body)
    } catch (error) {
      handleError(res, error)
    }
  },
  updateKanagata: async (req, res) => {
    try {
      await kanagataModel.updateKanagata(req.params.id, req.body);
      handleResponse(res, "Success", 200, req.body);
    } catch (error) {
      handleError(res, error);
    }
  },
  updateKanagataResetCode: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      const { code } = req.body
      const [existingCode] = await kanagataModel.getKanagataResetCode({ code });

      if (existingCode.code === code) {
        return handleResponse(res, "Kanagata reset code already exist", 400);
      }

      await kanagataModel.updateKanagataResetCode(code, req.body)
      handleResponse(res, "Success", 200, req.body)
    } catch (error) {
      handleError(res, error)
    }
  },
  deleteKanagata: async (req, res) => {
    try {
      const deleted = await kanagataModel.deleteKanagata(req.params.id);
      if (deleted) {
        handleResponse(res, "Success", 200);
      } else {
        handleResponse(res, "Data not found", 404);
      }
    } catch (error) {
      handleError(res, error);
    }
  },
  deleteKanagataResetCode: async (req, res) => {
    try {
      const deleted = await kanagataModel.deleteKanagataResetCode(req.params.id)
      if (deleted) {
        handleResponse(res, "Success", 200);
      } else {
        handleResponse(res, "Data not found", 404);
      }
    } catch (error) {
      handleError(res, error);
    }
  }
};
module.exports = kanagataController;
