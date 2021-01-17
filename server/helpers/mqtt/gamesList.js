import redis from "../../config/redisClient";
import mqttClient from "../../config/mqttClient";
import { ALL_GAMES, getKeyFromRedisId } from "../keyFormatters/games";
import playersKeyFormatter from "../../helpers/keyFormatters/players";

const getGames = async () => {
  const response = await redis.keys(ALL_GAMES);
  const games = await Promise.all(
    response.map(async (key) => ({
      id: getKeyFromRedisId(key),
      joinedPlayers: await redis.lrange(
        playersKeyFormatter(getKeyFromRedisId(key)),
        0,
        -1
      ),
      ...JSON.parse(await redis.get(key)),
    }))
  );
  return games
    .filter((game) => game.public)
    .filter((game) => !game.started)
    .map((game) => ({
      ...game,
      joinedPlayers: game.joinedPlayers.map((player) => JSON.parse(player)),
    }));
}

export const updateGameList = async () => {
  const gamesList = await getGames();
  mqttClient.publish("list", JSON.stringify(gamesList));
}