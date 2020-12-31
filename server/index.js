import express from "express";

import user from "./routes/user";
import games from "./routes/games";
import currentGame from "./routes/current-game-http";
import client from "./config/redisClient";
import cors from "cors";
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", user);
app.use("/games", games);
app.use("/current-game", currentGame);

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
