const read16BitRegister = async (modbusClient, startAddress, quantity, name) => {
  try {
    const response = await modbusClient.readHoldingRegisters(startAddress, quantity);
    const values = response.response.body.values;
    const data =  values.map((value, index) => ({
      address: startAddress + index,
      name: Array.isArray(name) ? name[index] || null : null,
      value,
    }));
    return data
  } catch (err) {
    console.error(`❌ Error reading 16-bit at ${startAddress}:`, err.message);
    return [];
  }
};

const read32BitRegister = async (modbusClient, startAddress, quantity, name) => {
  try {
    const response = await modbusClient.readHoldingRegisters(startAddress, quantity * 2);
    const values = response.response.body.values;

    const result = [];
    for (let i = 0; i < quantity; i++) {
      const idx = i * 2;
      const combined = (values[idx + 1] << 16) | values[idx]; // little endian
      result.push({
        address: startAddress + idx,
        name: Array.isArray(name) ? name[i] || null : null,
        value: combined,
      });
    }

    return result;
  } catch (err) {
    console.error(`❌ Error reading 32-bit at ${startAddress}:`, err.message);
    return [];
  }
};

module.exports = {
  read16BitRegister,
  read32BitRegister,
};
