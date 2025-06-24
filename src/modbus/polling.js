const { connectPLC } = require("./modbusClient");
const { read16BitRegister, read32BitRegister } = require("./readRegister");
const { writeRegister } = require("./writeRegister");

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

const startPolling = (modbusClient, addresses, interval, callback) => {
  if (!modbusClient) {
    console.error("❌ Modbus client is not connected.");
    return;
  }

  if (!Array.isArray(addresses) || addresses.length === 0) {
    console.error("❌ Invalid PLC Address array.");
    return;
  }

  setInterval(async () => {
    try {
      const data = await pollMultipleAddresses(modbusClient, addresses);
      if (typeof callback === "function") {
        const groupedData = groupByIndexRange(data, {
          status: [0, 3],
          production: [4, 31],
          shot: [32, 61],
          alarm: [62, 73],
        });
        callback(groupedData);
        
      }
      
    } catch (err) {
      console.error("❌ Error during polling:", err.message);
    }
  }, interval);
};

module.exports = { startPolling };
