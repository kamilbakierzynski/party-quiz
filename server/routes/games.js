import express from "express";
import redis from "../config/redisClient";
import mqttClient from "../config/mqttClient";
import { populateSetWithQuestions } from "../game/questionsList";
import gameKeyFormatter, { getKeyFromRedisId, ALL_GAMES, newGameKey } from "../helpers/keyFormatters/games";
import playersKeyFormatter from "../helpers/keyFormatters/players";
import nanoid from "../config/nanoidConfig";
import Responses from "../helpers/responses/responses";
import MQTTTopics from "../helpers/keyFormatters/mqtt";
import { KEY_EXPIRATION } from "../config/gameConfig";

const router = express.Router({ mergeParams: true });

router.post("/new-game", async (req, res) => {
  const body = req.body;
  const { key: newKey, id } = newGameKey();
  const response = await redis.setex(
    newKey,
    KEY_EXPIRATION,
    JSON.stringify({
      gameTitle: body.gameTitle,
      public: body.public,
      maxNumberOfPlayers: body.maxNumberOfPlayers,
      pointsToWin: body.pointsToWin,
      joinCode: nanoid(),
      creationDate: Date.now(),
      id,
      started: false,
      creatorId: body.user.id,
    })
  );
  await redis.rpush(playersKeyFormatter(id), JSON.stringify(body.user));
  await populateSetWithQuestions(id);

  mqttClient.subscribe(MQTTTopics.UserPresenceFormatter(id));

  return res.send({ response, id: id });
});

router.get("/list", async (req, res) => {
  const response = await redis.keys(ALL_GAMES);
  const games = await Promise.all(
    response.map(async (key) => ({
      id: getKeyFromRedisId(key),
      joinedPlayers: await redis.lrange(
        playersKeyFormatter(getKeyFromRedisId(key)),
        0,
        await redis.llen(playersKeyFormatter(getKeyFromRedisId(key)))
      ),
      ...JSON.parse(await redis.get(key)),
    }))
  );
  return res.send({
    games: games
      .filter((game) => game.public)
      .filter((game) => !game.started)
      .map((game) => ({
        ...game,
        joinedPlayers: game.joinedPlayers.map((player) => JSON.parse(player)),
      })),
    count: response.length,
  });
});

router.get("/:idGame", async (req, res) => {
  const idGame = req.params.idGame;
  const response = await redis.get(gameKeyFormatter(idGame));
  const format = {
    id: idGame,
    joinedPlayers: await redis.lrange(
      playersKeyFormatter(idGame),
      0,
      await redis.llen(playersKeyFormatter(idGame))
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
  const { id, code } = req.query;
  const { body } = req;
  if (code) {
    const response = await redis.keys(ALL_GAMES);
    const games = await Promise.all(
      response.map(async (key) => ({
        ...JSON.parse(await redis.get(key)),
      }))
    );
    const game = games.find((game) => game.joinCode === code);
    if (!game || game.started) {
      return res.send({ response: Responses.FAIL });
    }
    const currentPlayers = await redis.llen(playersKeyFormatter(game.id));
    if (currentPlayers < game.maxNumberOfPlayers && !game.started) {
      const responsePush = await redis.rpush(
        playersKeyFormatter(game.id),
        JSON.stringify(body)
      );
      return res.send({
        response: responsePush !== undefined ? Responses.OK : Responses.FAIL,
        id: game.id,
      });
    } else {
      return res.send({ response: Responses.FAIL });
    }
  } else if (id) {
    const currentPlayers = await redis.llen(playersKeyFormatter(id));
    const gameString = await redis.get(gameKeyFormatter(id));
    const game = JSON.parse(gameString);
    if (currentPlayers < game.maxNumberOfPlayers && !game.started) {
      const responsePush = await redis.rpush(
        playersKeyFormatter(id),
        JSON.stringify(body)
      );
      return res.send({
        response: responsePush !== undefined ? Responses.OK : Responses.FAIL,
        id: game.id,
      });
    } else {
      return res.send({ response: Responses.FAIL });
    }
  }
  return res.send({ response: Responses.FAIL });
});



export default router;
