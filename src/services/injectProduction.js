const dayjs = require("dayjs");
const planModel = require("../models/production/plan");
const productionModel = require("../models/production/production");

// Fungsi untuk parsing data hasil polling
const extractProductionObject = (productionData) => {
  return productionData.reduce((acc, { name, value }) => {
    acc[name] = value;
    return acc;
  }, {});
};

// Fungsi untuk memecah string PCA menjadi array
const splitPca = (str) => {
  if (typeof str !== "string") return [];
  if (str.length <= 2) return [Number(str)];
  const result = [];
  for (let i = 0; i < str.length; i += 2) {
    result.push(Number(str.slice(i, i + 2)));
  }
  return result;
};

// Helper untuk ambil value berdasarkan shift
const getShiftValue = (data, key, shift) => {
  return data?.[`${key}_s${shift}`];
};

// Fungsi utama yang bisa dipakai untuk shift 1 / 2
const injectProduction = async (getPollingData, shift = 1) => {
  const data = getPollingData();
  if (!data) return;

  for (const [machineName, machineData] of Object.entries(data)) {
    const productionData = machineData?.production;
    if (!productionData) continue;

    const formattedData = extractProductionObject(productionData);
    const pcaValues = splitPca(String(formattedData.pca));

    for (const pca of pcaValues) {
      try {
        const filters = {
          id_pca: pca,
          shift,
          start: dayjs()
            .subtract(shift === 2 ? 1 : 0, "day")
            .format("YYYY-MM-DD"),
        };

        const plan = await planModel.getPlanByShift(filters);
        const id_plan = plan?.[0]?.id_plan || null;

        const payload = {
          ok: getShiftValue(formattedData, "output", shift),
          stop_time: (
            getShiftValue(formattedData, "stop_time", shift) / 60
          ).toFixed(0),
          production_time: (
            getShiftValue(formattedData, "production_time", shift) / 60
          ).toFixed(0),
          dandori_time: (
            getShiftValue(formattedData, "dandori_time", shift) / 60
          ).toFixed(0),
          reject_setting: getShiftValue(formattedData, "reject_setting", shift),
          dummy: getShiftValue(formattedData, "dummy", shift),
          kanagata_shot: getShiftValue(formattedData, "kanagata_shot", shift),
          machine_shot: getShiftValue(formattedData, "machine_shot", shift),
          id_plan,
          id_pca: pca,
          shift,
          date: dayjs()
            .hour(shift === 1 ? 19 : 7)
            .minute(0)
            .second(0)
            .format("YYYY-MM-DD HH:mm:ss"),
        };

        await productionModel.createProduction(payload);
        console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [SCHEDULER] - Production for ${machineName} with id pca ${pca} shift ${shift} created`);
      } catch (error) {
        console.error(
          `Error processing production for ${machineName} shift ${shift}:`,
          error
        );
      }
    }
  }
};

module.exports = injectProduction;
