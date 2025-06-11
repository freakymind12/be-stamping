const { startPolling } = require("./polling");
const { addressPolling } = require("./addressFormat");
const { connectPLC } = require("./modbusClient");
const { writeRegister } = require("./writeRegister");
const dayjs = require("dayjs");
require("dotenv").config();

async function initModbusService(callback) {
  const modbusClient = await connectPLC(); // connect dulu
  const interval = process.env.POLLING_INTERVAL;
  // Start polling berjalan terus
  startPolling(modbusClient, addressPolling, interval, callback);


  // Write jam, menit, detik ke plc polling dengan interval 1 detik
  // setInterval(async () => {
  // await writeRegister(
  // modbusClient,
  // 10,
  // [
  //   dayjs().hour(),
  //   dayjs().minute(),
  //   dayjs().second(),
  //   dayjs().date(),
  //   dayjs().month() + 1,
  //   dayjs().year()
  // ]
  //   );
  // }, 1000);

  // Return object atau fungsi yang kamu butuh
  return true;
}

module.exports = {
  initModbusService,
};
