import express from "express";
import client from "../config/redisClient";
import mqttClient from "../config/mqttClient";
import { v4 as uuidv4 } from "uuid";
import { customAlphabet } from "nanoid";
import { populateSetWithQuestions } from "../game/questionsList";
const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

const router = express.Router({ mergeParams: true });

const KEY_EXPIRATION = 3600; //in seconds

router.post("/new-game", async (req, res) => {
  const body = req.body;
  const id = uuidv4();
  const newKey = keyFormatter(id);
  const response = await client.setex(
    newKey,
    KEY_EXPIRATION,
    JSON.stringify({
      gameTitle: body.gameTitle,
      public: body.public,
      maxNumberOfPlayers: body.maxNumberOfPlayers,
      joinCode: nanoid(),
      creationDate: Date.now(),
      id,
      started: false,
      creatorId: body.user.id,
    })
  );
  await client.rpush(`players-${id}`, JSON.stringify(body.user));
  await populateSetWithQuestions(id);

  mqttClient.subscribe(`game/user-presence/${id}`);

  return res.send({ response, id: id });
});

router.get("/list", async (req, res) => {
  const response = await client.keys("game-*");
  const games = await Promise.all(
    response.map(async (key) => ({
      id: key.replace("game-", ""),
      joinedPlayers: await client.lrange(
        `players-${key.replace("game-", "")}`,
        0,
        await client.llen(`players-${key.replace("game-", "")}`)
      ),
      ...JSON.parse(await client.get(key)),
    }))
  );
  return res.send({
    games: games
      .filter((game) => game.public)
      .filter((game) => !game.started)
      .map((game) => ({
        ...game,
        joinedPlayers: game.joinedPlayers.map(JSON.parse),
      })),
    count: response.length,
  });
});

router.get("/:idGame", async (req, res) => {
  const idGame = req.params.idGame;
  const response = await client.get(`game-${idGame}`);
  const format = {
    id: idGame,
    joinedPlayers: await client.lrange(
      `players-${idGame}`,
      0,
      await client.llen(`players-${idGame}`)
    ),
    ...JSON.parse(response),
  };
  const mapPlayers = [format].map((game) => ({
    ...game,
    joinedPlayers: game.joinedPlayers.map(JSON.parse),
  }));
  return res.send(mapPlayers);
});

router.post("/join-game", async (req, res) => {
  const code = req.query.code;
  const id = req.query.id;
  const { body } = req;
  if (code) {
    const response = await client.keys("game-*");
    const games = await Promise.all(
      response.map(async (key) => ({
        ...JSON.parse(await client.get(key)),
      }))
    );
    const game = games.find((game) => game.joinCode === code);
    if (!game || game.started) {
      return res.send({ response: "FAIL" });
    }
    const currentPlayers = await client.llen(`players-${game.id}`);
    if (currentPlayers < game.maxNumberOfPlayers) {
      const responsePush = await client.rpush(
        `players-${game.id}`,
        JSON.stringify(body)
      );
      return res.send({
        response: responsePush !== undefined ? "OK" : "FAIL",
        id: game.id,
      });
    } else {
      return res.send({ response: "FAIL" });
    }
  } else if (id) {
    const currentPlayers = await client.llen(`players-${id}`);
    const gameString = await client.get(`game-${id}`);
    const game = JSON.parse(gameString);
    if (currentPlayers < game.maxNumberOfPlayers && !game.started) {
      const responsePush = await client.rpush(
        `players-${id}`,
        JSON.stringify(body)
      );
      return res.send({
        response: responsePush !== undefined ? "OK" : "FAIL",
        id: game.id,
      });
    } else {
      return res.send({ response: "FAIL" });
    }
  }
  return res.send({ response: "FAIL" });
});

const keyFormatter = (key) => `game-${key}`;

export default router;
