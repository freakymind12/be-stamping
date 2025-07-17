const { read16BitRegister, read32BitRegister } = require("./readRegister");
const { connectPLC } = require("./connectPLC");
const dayjs = require("dayjs");

// fungsi untuk mengelompokkan data berdasarkan index range
const groupByIndexRange = (input, ranges) => {
  const result = {};

  const entries = Array.isArray(input)
    ? input.flatMap(Object.entries)
    : Object.entries(input);

  for (const [lineName, items] of entries) {
    result[lineName] = {};

    for (const [key, [start, end]] of Object.entries(ranges)) {
      result[lineName][key] = items.slice(start, end + 1);
    }
  }

  return result;
};

// fungsi untuk polling multiple addresses
const pollMultipleAddresses = async (modbusClient, addresses) => {
  const resultPerMachine = {};

  for (const { startAddress, quantity, machine, type, name } of addresses) {
    let result = [];

    if (type === "16bit") {
      result = await read16BitRegister(
        modbusClient,
        startAddress,
        quantity,
        name
      );
    } else if (type === "32bit") {
      result = await read32BitRegister(
        modbusClient,
        startAddress,
        quantity,
        name
      );
    }

    if (!resultPerMachine[machine]) {
      resultPerMachine[machine] = [];
    }

    resultPerMachine[machine].push(...result);
  }

  return resultPerMachine;
};

const startPolling = async (initialClient, addresses, interval, callback) => {
  let modbusClient = initialClient.client;
  let socket = initialClient.socket;
  let isPolling = true;

  // check if modbusClient and socket is connected
  if (!modbusClient || !socket) {
    console.error("❌ Modbus client/socket is not connected.");
    return;
  }

  // check if addresses is array and not empty
  if (!Array.isArray(addresses) || addresses.length === 0) {
    console.error("❌ Invalid PLC Address array.");
    return;
  }

  // reconnect function
  const reconnect = async () => {
    console.warn(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] 🔄 Attempting to reconnect...`);

    try {
      const { client: newClient, socket: newSocket } = await connectPLC();
      modbusClient = newClient;
      socket = newSocket;

      // Daftarkan kembali close listener
      socket.on('close', () => {
        console.warn(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] ⚠️ Socket closed. Reconnecting...`);
        isPolling = false;
        reconnect();
      });

      isPolling = true;
      pollLoop(); // lanjut polling setelah reconnect
      console.log(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] ✅ Reconnected to PLC`);

    } catch (err) {
      console.error(`❌ Reconnect failed: ${err.message}`);
      setTimeout(reconnect, 3000); // coba lagi setelah 3 detik
    }
  };

  // Deteksi jika koneksi ditutup dari awal
  socket.on('close', () => {
    console.warn(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] ⚠️ Socket closed. Reconnecting...`);
    isPolling = false;
    reconnect();
  });

  // polling loop
  const pollLoop = async () => {
    if (!isPolling) return;

    try {
      const data = await pollMultipleAddresses(modbusClient, addresses);      
      if (typeof callback === 'function') {
        const groupedData = groupByIndexRange(data, {
          status: [0, 3],  // range jumlah penarikan data berdasarkan status pada address format
          production: [4, 31],  // range jumlah penarikan data berdasarkan production pada address format
          shot: [32, 64],    // range jumlah penarikan data berdasarkan shot pada address format
          alarm: [65, 77],  // range jumlah penarikan data berdasarkan alarm pada address format
          other: [78, 79]   // range jumlah penarikan data berdasarkan other pada address format
        });
        callback(groupedData);
      }
    } catch (err) {
      console.error(`❌ Error during polling: ${err.message}`);
    }

    // lanjut polling jika masih terkoneksi
    if (isPolling) {
      setTimeout(pollLoop, interval);
    }
  };

  pollLoop(); // mulai pertama kali
};

module.exports = { startPolling };
