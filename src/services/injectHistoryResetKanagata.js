const dayjs = require("dayjs");
const maintenanceModel = require("../models/production/maintenance");
const kanagataModel = require("../models/production/kanagata")
const machineModel = require("../models/production/machine")
const pcaModel = require("../models/production/pca")
const mcprotocol = require("../mcprotocol/mcprotocol")

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const injectHistoryReset = async (pollingData) => {
  if (!pollingData) return;
  for (const [machineName, machineData] of Object.entries(pollingData)) {
    const shotData = machineData?.shot
    const otherData = machineData?.other
    const productionData = machineData?.production
    if (!shotData) continue;

    // format data dari array agar menjadi object yang mudah diolah
    const formattedData = Object.fromEntries(
      shotData
        .filter(({ name }) => !name.includes("alarm"))
        .map(({ name, value }) => [name, value])
    );
    const kanagataResetCode = otherData?.find(item => item.name === 'kanagata_reset_code')
    const idPca = productionData?.find(item => item.name === 'pca')
    formattedData.kanagata_reset_code = kanagataResetCode?.value ?? null
    formattedData.id_pca = idPca?.value ?? null
    formattedData.machine_name = machineName

    // filter hanya pesan dengan value bukan sama dengan 0 yang di proses
    if (kanagataResetCode?.value !== 0 && idPca?.value) {

      const [resetPart] = await kanagataModel.getKanagataResetCode({ code: kanagataResetCode.value })
      const [pcaData]  = await pcaModel.getPca({ id_pca: idPca.value })

      if (!resetPart && !pcaData) {
        console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] There is no data with kanagata reset code ${kanagataResetCode.value} on machine ${formattedData.machine_name}`)
        continue
      }

      const payload = {
        shot: formattedData[resetPart?.name + '_shot'] || 0,
        id_machine: formattedData.machine_name.replace(/_/g, ' ').toUpperCase(),
        part: resetPart.name || null,
        id_kanagata: pcaData.id_kanagata || null
      }

      try {
        const injectHistory = await maintenanceModel.create(payload)
        const [machineInfo] = await machineModel.getMachine({ id_machine: payload.id_machine })
        await mcprotocol.writePLC(machineInfo.address, 5000, 'D40190', 0)
        console.log(`Success record history reset & reset counter state [${payload.id_machine}]`)
      } catch (error) {
        console.error('Error while record history reset counter & reset counter state')
      }
    }
  }
};

module.exports = injectHistoryReset;
