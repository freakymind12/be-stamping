const writeRegister = async (client, startAddress, values) => {
  try {
    if (!Array.isArray(values) || values.some(v => typeof v !== 'number')) {
      throw new Error("Parameter 'values' harus berupa array of numbers.");
    }
    
    const response = await client.client.writeMultipleRegisters(startAddress, values);
    // console.log(`✅ Berhasil menulis multiple register pada start address ${startAddress}:`, values);
    return response;
  } catch (err) {
    console.error(`❌ Gagal menulis pada address ${startAddress}:`, err.message);
    throw err;
  }
};

module.exports = { writeRegister };