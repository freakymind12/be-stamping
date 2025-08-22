// redisClient.js
const redis = require("redis");
const dayjs = require("dayjs")

const client = redis.createClient({
  socket: {
    host: "192.168.148.125", // atau IP server Redis
    port: 6379
  }
});

client.on("error", (err) => console.error("Redis Error:", err));

(async () => {
  await client.connect();
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [REDIS] - Connected`);
})();

module.exports = client;
