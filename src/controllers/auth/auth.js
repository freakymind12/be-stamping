const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../../models/auth/users");
const { handleResponse, handleError } = require("../../utils/responseUtils");

const authController = {
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      const [user] = await userModel.getUser({ email });
      if (!user) {
        return handleResponse(res, "Email is not registered", 401);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return handleResponse(res, "Wrong password", 401);
      }

      const payload = {
        id_user: user.id_user,
        role: user.roles,
        username: user.username,
      };

      const refresh_secret = process.env.REFRESH_TOKEN_SECRET;
      const access_secret = process.env.ACCESS_TOKEN_SECRET;

      const refresh_token = jwt.sign(payload, refresh_secret, {
        expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRED,
      });

      const access_token = jwt.sign(payload, access_secret, {
        expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRED,
      });

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 7 Hari
        path: "/",
      });

      return res.status(200).json({
        data: payload,
        access_token,
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  refreshToken: async (req, res) => {
    const user = req.user;
    const access_secret = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = jwt.sign(
      { id: user.id_user, email: user.email },
      access_secret,
      { expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRED }
    );
    res.json({ access_token: accessToken });
  },

  logoutUser: (req, res) => {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    handleResponse(res, "Logout Success");
  },
};

module.exports = authController;
