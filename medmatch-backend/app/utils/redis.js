const redis = require('redis')
const environment = process.env.NODE_ENV || 'development';
const config = require('../config/redis');
const {default_ttl} = require("../config/redis");
const redisConfig = config[environment];
let redisConnection = null;

/**
 * Get Redis connection
 *
 * @returns {Promise<RedisClient<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts> & WithCommands & WithModules<RedisDefaultModules & RedisModules> & WithFunctions<RedisFunctions> & WithScripts<RedisScripts>>}
 */
async function getRedis() {

    try {

        // create redis connection
        if (redisConnection === null) {
            redisConnection = redis.createClient({
                host: redisConfig.host,
                port: redisConfig.port
            });
            redisConnection.on("error", (error) => console.log(error));
            await redisConnection.connect();
        }

        return redisConnection;

    } catch (error) {

        console.log(error)
    }
}

module.exports = {
    /**
     * Set Cache Value by Key
     *
     * @param key
     * @param value
     * @param ttl in seconds
     * @returns {Promise<void>}
     */
    setCache: async (key, value, ttl = null) => {

        try {

            // validate value
            if (!value) {
                throw 'Invalid value to set in cache';
            }

            // stringify array or object
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }

            // set options
            let options = {};
            if (ttl === null) {
                options.EX = default_ttl;
            } else if (ttl && ttl > 0) {
                options.EX = ttl;
            }

            const redisClient = await getRedis();
            await redisClient.set(key, value, options);

        } catch (error) {
            console.log(error)
        }
    },

    /**
     * Get Cache by key
     *
     * @param key
     * @returns {Promise<*>}
     */
    getCache: async (key) => {
        try {

            if (!key) {
                throw 'Invalid key';
            }

            const redisClient = await getRedis();
            let data = await redisClient.get(key);
            data = JSON.parse(data);

            return data;

        } catch (error) {
            console.log(error)
        }
    },

    /**
     * Delete Cache by key
     *
     * @param key
     * @returns {Promise<void>}
     */
    deleteCache: async (key, regex = false) => {
        try {

            if (!key) {
                throw 'Invalid key';
            }

            const redisClient = await getRedis();

            if (regex === true) {

                // delete keys by regex
                console.log(key);
                const keys = await redisClient.keys(key);
                if (keys && keys.length) {
                    await keys.forEach(async (singleKey) => {
                        await redisClient.del(singleKey);
                    });
                }

            } else {

                // delete single key
                await redisClient.del(key);
            }

        } catch (error) {
            console.log(error)
        }
    },
};
