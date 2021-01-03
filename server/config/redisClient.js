import Redis from "ioredis";

const dbConnData = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
};
const client = new Redis(dbConnData);

export default client;
