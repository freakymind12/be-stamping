const redisClient = require("../config/redis");
const dayjs = require("dayjs");
const { handleResponse } = require("../utils/responseUtils");

const generateKeyPrefix = (req) => {
  // Gunakan req.originalUrl untuk mendapatkan jalur lengkap termasuk base URL, lalu hapus string kueri
  const path = req.originalUrl.split('?')[0];
  return path;
};


const cacheMiddleware = (ttl = 60) => {
  return async (req, res, next) => {
    try {
      if (req.method.toUpperCase() !== "GET") return next();

      const keyPrefix = generateKeyPrefix(req);
      const queryKey = Object.keys(req.query).length
        ? `:${JSON.stringify(req.query)}`
        : "";
      const cacheKey = `${keyPrefix}${queryKey}`;

      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] [REDIS] - Cache hit: ${cacheKey}`);
        return handleResponse(res, "Success", 200, JSON.parse(cached));
      }

      // Override res.json untuk simpan cache
      const originalJson = res.json.bind(res);
      res.json = async (body) => {
        await redisClient.setEx(cacheKey, ttl * 60, JSON.stringify(body.data || body));
        originalJson(body);
      };

      next();
    } catch (err) {
      console.error("Cache Middleware Error:", err);
      next();
    }
  };
};

const invalidateCacheMiddleware = () => {
  return async (req, res, next) => {
    try {
      const specificKeyPrefix = generateKeyPrefix(req);
      const specificPattern = `${specificKeyPrefix}*`; // e.g., /api/v1/kanagata/21241*

      let patternsToInvalidate = [specificPattern];

      const pathSegments = specificKeyPrefix.split('/');

      // collect path segment untuk liat key yang ada pada spesifik segment dan base segment
      if (pathSegments.length > 3) {
        const collectionKeyPrefix = pathSegments.slice(0, -1).join('/'); // /api/v1/kanagata
        if (collectionKeyPrefix) {
            patternsToInvalidate.push(`${collectionKeyPrefix}*`);
        }
      }

      // lakukan looping sesuai banyak nya segemnt yang di collect
      let invalidatedCount = 0;
      for (const pattern of patternsToInvalidate) {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
          await redisClient.del(keys);
          console.log(`[REDIS] - Cache invalidated for pattern: ${pattern}`);
          invalidatedCount += keys.length;
        } else {
          console.log(`[REDIS] - No cache found for pattern: ${pattern}`);
        }
      }

      if (invalidatedCount > 0) {
        console.log(`[REDIS] - Total ${invalidatedCount} keys invalidated.`);
      } else {
        console.log(`[REDIS] - No cache keys found for invalidation.`);
      }

      next();
    } catch (err) {
      console.error("Cache Invalidation Error:", err);
      next();
    }
  };
};

module.exports = { cacheMiddleware, invalidateCacheMiddleware };
