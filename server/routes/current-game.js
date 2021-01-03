import redis from "../config/redisClient";
import mqtt from "../config/mqttClient";
import Responses from "../helpers/responses/responses";
import playersKeyFormatter from "../helpers/keyFormatters/players";
import gameKeyFormatter from "../helpers/keyFormatters/games";
import questionsKeyFormatter from "../helpers/keyFormatters/questions";
import MQTTTopics from "../helpers/keyFormatters/mqtt";

export const sendGameState = async (gameId) => {
  const response = await redis.get(gameKeyFormatter(gameId));
  const format = await {
    ...JSON.parse(response),
    joinedPlayers: await redis.lrange(
      playersKeyFormatter(gameId),
      0,
      await redis.llen(playersKeyFormatter(gameId))
    ),
    questionsLeft: await redis.scard(questionsKeyFormatter(gameId))
  };
  mqtt.publish(
    MQTTTopics.StateFormatter(gameId),
    JSON.stringify({
      ...format,
      joinedPlayers: format.joinedPlayers.map((player) => JSON.parse(player)),
    })
  );
};

mqtt.on(`message`, async (topic, message) => {
  // check user connections
  if (topic.startsWith(MQTTTopics.State)) {
    const gameId = MQTTTopics.gameIdFromStateTopic(topic);
    sendGameState(gameId);
  }
  if (topic.startsWith(MQTTTopics.UserPresence)) {
    const gameId = MQTTTopics.gameIdFromUserPresenceTopic(topic);
    const { action, payload } = JSON.parse(message.toString());
    if (action === UserPresenceActions.LEAVE) {
      await redis.lrem(
        playersKeyFormatter(gameId),
        0,
        JSON.stringify(payload)
      );
      mqtt.publish(
        MQTTTopics.ChatFormatter(gameId),
        JSON.stringify({
          text: Responses.leftGame(payload.username),
        })
      );
    } else {
      mqtt.publish(
        MQTTTopics.ChatFormatter(gameId),
        JSON.stringify({
          text: Responses.joinedGame(payload.username),
        })
      );
    }
    sendGameState(gameId);
  }
});

const UserPresenceActions = {
  LEAVE: "LEAVE",
  JOIN: "JOIN"
}
