const handleResponse = (res, message, status = 200, data = null, errors) => {
  const response = { code: status, message }; // Directly include 'code' and 'message' as properties
  if (data !== null) {
    res.status(status).json({ ...response, data, errors });
  } else {
    res.status(status).json({ ...response, errors });
  }
};

const handleError = (res, error) => {
  console.error("Error:", error);
  res.status(500).json({ message: "Server Error" });
};

module.exports = {
  handleResponse,
  handleError,
};
