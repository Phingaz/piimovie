import Redis from 'ioredis';
import ENV from './env';

const globalForRedis = global as unknown as {
  redis: Redis;
};

const redis = globalForRedis.redis || new Redis(ENV.REDIS_URL);

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

export default redis;
