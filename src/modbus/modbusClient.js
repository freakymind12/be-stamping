const net = require("net");
const Modbus = require("jsmodbus");
require("dotenv").config();
const dayjs = require("dayjs");

const options = {
  host: process.env.PLC_ADDRESS,
  port: process.env.MODBUS_PORT,
  unitId: 1,
};

const socket = new net.Socket();
const client = new Modbus.client.TCP(socket, options.unitId);

const connectPLC = () => {
  return new Promise((resolve, reject) => {
    socket.connect(options.port, options.host, () => {
      console.log(
        `[${dayjs().format(
          "YYYY-MM-DD HH:mm:ss"
        )}] [POLLING] - Connected to PLC Polling ${options.host}:${
          options.port
        }`
      );
      resolve(client);
    });

    socket.on("error", (err) => {
      console.error(
        `${dayjs().format("YYYY-MM-DD HH:mm:ss")}] [POLLING] - Connection error:`,
        err.message
      );
      reject(err);
    });

    socket.on("end", () => {
      console.log(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] [POLLING] - Connection closed`);
    });
  });
};

module.exports = { connectPLC, socket, client };
