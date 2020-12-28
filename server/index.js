import express from "express";

import user from "./routes/user";
import games from "./routes/games";
import client from "./config/redisClient";
import cors from "cors";
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", user);
app.use("/games", games);

client.on("error", (err) => {
  console.error("Error connecting to Redis", err);
});
client.on("connect", () => {
  console.log(`Connected to Redis database.`);
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
  });
});
