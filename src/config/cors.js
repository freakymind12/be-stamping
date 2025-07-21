const cors = require("cors")
require('dotenv').config()

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

module.exports = cors(corsOptions);
