// IMPORT MODULES
require("dotenv").config();
const PORT = process.env.APP_PORT || 5000;
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

// IMPORT ROUTES
const routes = require("./routes");

// INITIALIZE EXPRESS
const app = express();
require("express-ws")(app);

// IMPORT MODBUS & WEBSOCKET SERVICE
const { initModbusService } = require("./modbus/init");
const { wsHandler, broadcastPollingData } = require("./services/websocket");
const injectHistoryReset = require("./services/injectHistoryResetKanagata")

// MODBUS POLLING PLC
let pollingData = null;
initModbusService((data) => {
  pollingData = data;
  broadcastPollingData(data);
  injectHistoryReset(data); 
});

// WEBSOCKET POLLING
app.ws("/polling-data", wsHandler);

// TASK SCHEDULER
const taskScheduler = require("./services/taskScheduler.js");
taskScheduler.productionS1(() => pollingData);
taskScheduler.productionS2(() => pollingData);

// IMPORT MIDDLEWARE
const middlewareHandle = require("./middleware/middlewareHandle.js");

// MIDDLEWARE
app.use(helmet());
app.use(middlewareHandle.errorMessage); // error message
app.use(middlewareHandle.logRequest); // log request
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.148.125:5173"], // ganti untuk alamat frontend nya
    credentials: true,
  })
);

// ALLOW JSON RESPONSE AND PUBLIC FOLDER
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

// ROUTES ENDPOINT
app.use("/api/v1", routes);

// Run service REST API
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
