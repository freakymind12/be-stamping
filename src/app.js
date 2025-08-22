// IMPORT MODULES
const PORT = process.env.APP_PORT;
const express = require("express");
const cookieParser = require("cookie-parser");
const corsConfig = require("./config/cors.js")
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
taskScheduler.notifyReminderShot(() => pollingData);

// IMPORT MIDDLEWARE
const middlewareHandle = require("./middleware/middlewareHandle.js");

// MIDDLEWARE
app.use(helmet());
app.use(middlewareHandle.errorMessage); // error message
app.use(middlewareHandle.logRequest); // log request
app.use(corsConfig)

// ALLOW JSON RESPONSE AND PUBLIC FOLDER
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

// ROUTES ENDPOINT
app.use("/api/v1", routes);

// Run service REST API
app.listen(PORT, () => {
  console.log('Environment:', process.env.NODE_ENV);
  console.log(`Server is running on port ${PORT}`);
});
