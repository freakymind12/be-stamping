const jwt = require("jsonwebtoken");

// Middleware guard untuk authentikasi access token jwt
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const access_token = authHeader && authHeader.split(" ")[1];
  const access_secret = process.env.ACCESS_TOKEN_SECRET;
  if (access_token == null)
    return res.status(401).json({
      message: "Access token needed for this request",
      code: 401,
    });

  jwt.verify(access_token, access_secret, (err, user) => {
    if (err)
      return res.status(403).json({
        message: "Access token is not valid ",
        code: 403,
      });
    req.user = user;
    next();
  });
};

// Middleware validasi untuk refresh token jwt
const validateRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  const refresh_secret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token not found, please login again",
      code: 401,
    });
  }

  jwt.verify(refreshToken, refresh_secret, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Refresh token is not valid", code: 403 });
    }

    req.user = decoded;
    next();
  });
};

module.exports = {
  authenticateToken,
  validateRefreshToken,
};
