const dayjs = require("dayjs");
const maintenanceModel = require("../models/production/maintenance");

const injectHistoryReset = async (pollingData) => {
  if (!pollingData) return;

  for (const [machineName, machineData] of Object.entries(pollingData)) {
    const shotData = machineData?.shot;
    if (!shotData) continue;

    // format data dari array agar menjadi object yang mudah diolah
    const formattedData = Object.fromEntries(
      shotData
        .filter(({ name }) => !name.includes("alarm"))
        .map(({ name, value }) => [name, value])
    );
    formattedData.machineName = machineName;
    // console.log(formattedData)

    const checkZero = Object.entries(formattedData).find(([key, value]) => value == 0);
    // console.log(checkZero)
  }
};

module.exports = injectHistoryReset;
