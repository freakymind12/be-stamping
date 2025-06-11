const dayjs = require("dayjs");

const logRequest = (req, res, next) => {
  const start = dayjs();

  // Log awal request
  console.log(`[${start.format("YYYY-MM-DD HH:mm:ss")}] [REQ] - ${req.method} ${req.path}`);

  // Hook untuk menangkap respons selesai
  res.on("finish", () => {
    const end = dayjs();
    const duration = end.diff(start, "millisecond");

    console.log(
      `[${end.format("YYYY-MM-DD HH:mm:ss")}] [RES] - ${req.method} ${req.path} - [code]: ${res.statusCode} - [time]: ${duration}ms`
    );
  });

  next();
};

const errorMessage = (err, req, res, next) => {
  const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
  console.error(`[${timestamp}] [ERROR] - ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
};

module.exports = {
  logRequest,
  errorMessage,
};
