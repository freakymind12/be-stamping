const net = require('net');
const modbus = require('jsmodbus');
const dayjs = require('dayjs');

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000; // ms

const options = {
  host: process.env.PLC_ADDRESS,
  port: process.env.MODBUS_PORT,
  unitId: 1,
};

function connectPLC(retries = MAX_RETRIES) {
  return new Promise((resolve, reject) => {
    // create client function
    function createClient() {
      const socket = new net.Socket();
      const client = new modbus.client.TCP(socket, options.unitId || 1);
      return { socket, client };
    }

    // attempt connection function
    function attemptConnection(remainingRetries) {
      const { socket, client } = createClient();
      let isResolved = false;

      socket.connect(options.port, options.host, () => {
        isResolved = true;
        console.log(
          `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [POLLING] - Connected to PLC at ${options.host}:${options.port}`
        );
        resolve({ socket, client });
      });

      socket.on('error', (err) => {
        if (isResolved) return;

        console.error(
          `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [POLLING] - Connection error: ${err.message}`
        );

        socket.destroy();

        if (remainingRetries > 0) {
          console.log(
            `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [POLLING] - Retrying in ${RETRY_DELAY / 1000}s... (${MAX_RETRIES - remainingRetries + 1})`
          );
          setTimeout(() => {
            attemptConnection(remainingRetries - 1);
          }, RETRY_DELAY);
        } else {
          console.error(
            `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [POLLING] - Max retries reached. Giving up.`
          );
          reject(err);
        }
      });

      socket.on('end', () => {
        console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [POLLING] - Connection ended`);
      });
    }

    attemptConnection(retries);
  });
}

module.exports = { connectPLC };
