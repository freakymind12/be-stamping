const cron = require("node-cron");
const injectProduction = require("./injectProduction");
const mailReminderShot = require("./mailShotReminder")
const redisClient = require("../config/redis")

const deleteCachedProduction = async () => {
  const pattern = "/api/v1/production/*";
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
    console.log(`[REDIS] - Cache invalidated for pattern: ${pattern} (${keys.length} keys)`);
  } else {
    console.log(`[REDIS] - No cache found for pattern: ${pattern}`);
  }
}

const taskScheduler = {
  productionS1(getPollingData) {
    cron.schedule("0 5 19 * * *", async () => {
      await injectProduction(getPollingData, 1); // untuk shift 1
    });
  },

  productionS2(getPollingData) {
     cron.schedule("0 5 7 * * *", async () => {
      await injectProduction(getPollingData, 2); // untuk shift 2
    });
  },

  notifyReminderShot(getPollingData) {
    // Menjadwalkan agar berjalan setiap 5 menit sekali
    cron.schedule("*/1 * * * *", async () => {
      await mailReminderShot(getPollingData)
    })
  }

};

module.exports = taskScheduler;
