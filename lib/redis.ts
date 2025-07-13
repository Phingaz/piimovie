import Redis from 'ioredis';
import envProxy from './env';

const globalForRedis = global as unknown as {
  redis: Redis;
};

const redis = globalForRedis.redis || new Redis(envProxy.REDIS_URL);

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

export default redis;
