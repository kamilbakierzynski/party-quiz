import Redis from "ioredis";

const dbConnData = {
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || "127.0.0.1",
};
const client = new Redis(dbConnData);

export default client;
