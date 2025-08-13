const dayjs = require("dayjs");

const logRequest = (req, res, next) => {
  const start = dayjs();

  // Catat IP Address dan User-Agent untuk informasi tambahan
  const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'unknown';

  console.log(`[${start.format("YYYY-MM-DD HH:mm:ss")}] [REQ] - ${req.method} ${req.path}`);

  const endLog = () => {
    const end = dayjs();
    const duration = end.diff(start, "millisecond");
    const status = res.statusCode || 500; // Asumsi status 500 jika tidak ada
    const contentLength = res.getHeader('Content-Length') || 'N/A';

    console.log(
      `[${end.format("YYYY-MM-DD HH:mm:ss")}] [RES] - ${req.method} ${req.path} - [code]: ${status} - [time]: ${duration}ms`
    );
    // Hapus listener agar tidak bocor
    res.removeListener('finish', endLog);
    res.removeListener('close', endLog);
  };

  // Menggunakan kedua event untuk penanganan yang lebih lengkap
  res.on('finish', endLog);
  res.on('close', endLog);

  next();
};

const errorMessage = (err, req, res, next) => {
  const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
  // Catat detail request yang menyebabkan error
  console.error(`[${timestamp}] [ERROR] - ${req.method} ${req.path} - Message: ${err.message}`);
  // Kirim respons error yang lebih informatif
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error"
  });
};

module.exports = {
  logRequest,
  errorMessage,
};