const { validationResult } = require("express-validator");
const { handleError, handleResponse } = require("../../utils/responseUtils");
const kanagataModel = require("../../models/production/kanagata");
const kanagataPartModel = require("../../models/production/kanagata_part")

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
  getKanagataPart: async (req, res) => {
    try {
      const kanagataPart = await kanagataPartModel.getKanagataPart(req.query)
      handleResponse(res, "Success", 200, kanagataPart)
    } catch (error) {
      handleError(res, error)
    }
  },
  getPartCategory: async (req, res) => {
    try {
      const category = await kanagataPartModel.getCategory(req.query)
      handleResponse(res, "Success", 200, category)
    } catch (error) {
      handleError(res, error)
    }
  },
  getPartRequest: async (req, res) => {
    try {
      const partRequest = await kanagataPartModel.getPartRequest(req.query)
      handleResponse(res, "Success", 200, partRequest)
    } catch (error) {
      handleError(res, error)
    }
  },
  getPartInventory: async (req, res) => {
    try {
      const inventory = await kanagataPartModel.getInventoryPart(req.query)
      handleResponse(res, "Success", 200, inventory)
    } catch (error) {
      handleError(res, error)
    }
  },
  getPartUsageHistory: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      const history = await kanagataPartModel.getPartUsageHistory(req.query)
      handleResponse(res, "Success", 200, history)
    } catch (error) {
      handleError(res, error)
    }
  },
  getPartBelowSafety: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      const data = await kanagataPartModel.getPartBelowSafety(req.query)
      handleResponse(res, "Success", 200, data)
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
  createKanagataPart: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      const { id_kanagata_part } = req.body
      const existingPart = await kanagataPartModel.getKanagataPart({ id_kanagata_part })

      if (existingPart.length > 0) {
        return handleResponse(res, "Kanagata Part with this id already exist", 400)
      }

      await kanagataPartModel.createKanagataPart(req.body)
      handleResponse(res, "Success", 200, req.body)
    } catch (error) {
      handleError(res, error)
    }
  },
  createPartCategory: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      await kanagataPartModel.createCategory(req.body)
      handleResponse(res, "Success", 200, req.body)
    } catch (error) {
      handleError(res, error)
    }
  },
  createPartRequest: async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      await kanagataPartModel.createPartRequest(req.body)
      handleResponse(res, "Success", 200, req.body)
    } catch (error) {
      handleError(res, error)
    }
  },
  createNccPart: async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      await kanagataPartModel.createNccPart(req.body)
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
  updateKanagataPart: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      const { id } = req.params;
      const { id_kanagata_part } = req.body;

      // Cek jika id_kanagata_part baru sudah ada di record lain
      // tapi bukan record yang sedang di-update
      if (id_kanagata_part) {
        const [duplicatePart] = await kanagataPartModel.getKanagataPart({
          id_kanagata_part,
        });

        if (duplicatePart && duplicatePart.id_kanagata_part !== id) {
          return handleResponse(res, "ID Sparepart is already exists", 400);
        }
      }

      await kanagataPartModel.updateKanagataPart(id, req.body)
      handleResponse(res, "Success", 200, req.body)
    } catch (error) {
      handleError(res, error)
    }
  },
  updatePartCategory: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      const { id } = req.params
      await kanagataPartModel.updateCategory(id, req.body)
      handleResponse(res, "Success", 200, req.body)
    } catch (error) {
      handleError(res, error)
    }
  },
  updatePartRequest: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, errors.array()[0].msg, 400);
    }
    try {
      const { id } = req.params
      await kanagataPartModel.updatePartRequest(id, req.body)
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
  },
  deleteKanagataPart: async (req, res) => {
    try {
      const deleted = await kanagataPartModel.deleteKanagataPart(req.params.id)
      if (deleted) {
        handleResponse(res, "Success", 200);
      } else {
        handleResponse(res, "Data not found", 404);
      }
    } catch (error) {
      handleError(res, error)
    }
  },
  deletePartCategory: async (req, res) => {
    try {
      const deleted = await kanagataPartModel.deleteCategory(req.params.id)
      if (deleted) {
        handleResponse(res, "Success", 200);
      } else {
        handleResponse(res, "Data not found", 404);
      }
    } catch (error) {
      handleError(res, error)
    }
  },
  deletePartRequest: async (req, res) => {
    try {
      const deleted = await kanagataPartModel.deletePartRequest(req.params.id)
      if (deleted) {
        handleResponse(res, "Success", 200);
      } else {
        handleResponse(res, "Data not found", 404);
      }
    } catch (error) {
      handleError(res, error)
    }
  },
  deleteNccPart: async (req, res) => {
    try {
      const deleted = await kanagataPartModel.deleteNccPart(req.params.id)
      if (deleted) {
        handleResponse(res, "Success", 200);
      } else {
        handleResponse(res, "Data not found", 404);
      }
    } catch (error) {
      handleError(res, error)
    }
  }
};
module.exports = kanagataController;
