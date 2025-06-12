const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/auth/users")
const { handleError, handleResponse } = require("../../utils/responseUtils");

const userController = {
  createUser: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleResponse(res, { errors: errors.array() }, 400);
    }
    const { email, username, password } = req.body;
    try {
      const existingUser = await userModel.getUser({ email });

      if (existingUser.length > 0) {
        return handleResponse(res, "User with this email already exist", 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await userModel.createUser({
        email,
        username,
        password: hashedPassword,
      });
      handleResponse(res, "Registration success", 200, { email, username });
    } catch (error) {
      handleError(res, error);
    }
  },

  changePassword: async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const { old_password, new_password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return handleResponse(res, { errors: errors.array() }, 400);
    }

    if (!token) {
      return handleResponse(res, "Access token not found", 401);
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const [checkingUser] = await userModel.getUser({
        id_user: decoded.id_user,
      });

      if (!checkingUser) {
        return handleResponse(res, "User not found", 404);
      }

      const passwordMatch = await bcrypt.compare(
        old_password,
        checkingUser.password
      );

      if (!passwordMatch) {
        return handleResponse(res, "Old password wrong", 404);
      }

      const updated = await userModel.updateUser(decoded.id_user, {
        password: await bcrypt.hash(new_password, 10),
      });

      if (updated) {
        handleResponse(res, "Password changed", 200);
      } else {
        handleResponse(res, "User not found", 404);
      }
    } catch (error) {
      handleError(res, error);
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const affectedRows = await userModel.updateUser(id, updatedData);
      if (affectedRows) {
        handleResponse(res, "Success update user", 200, { id, updatedData });
      } else {
        handleResponse(res, "User not found", 404);
      }
    } catch (error) {
      handleError(res, error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await userModel.deleteUser(id);
      if (deleted) {
        handleResponse(res, "User deleted", 200);
      } else {
        handleResponse(res, "User not found", 404);
      }
    } catch (error) {
      handleError(res, error);
    }
  },

  getUser: async (req, res) => {
    try {
      const users = await userModel.getUser();
      const total = await userModel.getTotalUser();
      const data = {
        users: users.length === 0 ? "No users data available" : users,
        total: total.length === 0 ? "No users data available" : total,
      };
      handleResponse(res, "Success", 200, data);
    } catch (error) {
      handleError(res, error);
    }
  },
};

module.exports = userController;
