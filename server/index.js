import express from "express";

// Routes
import user from "./routes/user";
import games from "./routes/games";
import currentGame from "./routes/current-game-http";

// Cors
import cors from "cors";
import corsConfig from "./config/corsConfig";

// Clients
import redis from "./config/redisClient";

// Configs
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors(process.env.ENABLE_CORS === "true" && corsConfig));

app.use("/user", user);
app.use("/games", games);
app.use("/current-game", currentGame);

redis.on("error", (err) => {
  console.error("Error connecting to Redis", err);
});

redis.on("connect", () => {
  console.log(`Connected to Redis database.`);
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
  });
});
