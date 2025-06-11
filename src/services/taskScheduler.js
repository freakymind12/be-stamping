const cron = require("node-cron");
const injectProduction = require("./injectProduction");

const taskScheduler = {
  productionS1(getPollingData) {
    cron.schedule("0 25 14 * * *", async () => {
      await injectProduction(getPollingData, 1); // untuk shift 1
    });
  },

  productionS2(getPollingData) {
     cron.schedule("0 5 7 * * *", async () => {
      await injectProduction(getPollingData, 2); // untuk shift 2
    });
  },

};

module.exports = taskScheduler;
