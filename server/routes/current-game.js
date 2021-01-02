import redis from "../config/redisClient";
import mqtt from "../config/mqttClient";

export const sendGameState = async (gameId) => {
  const response = await redis.get(`game-${gameId}`);
  const format = await {
    ...JSON.parse(response),
    joinedPlayers: await redis.lrange(
      `players-${gameId}`,
      0,
      await redis.llen(`players-${gameId}`)
    ),
    questionsLeft: await redis.scard(`questions-${gameId}`)
  };
  mqtt.publish(
    `game/state/${gameId}`,
    JSON.stringify({
      ...format,
      joinedPlayers: format.joinedPlayers.map((player) => JSON.parse(player)),
    })
  );
};

mqtt.on(`message`, async (topic, message) => {
  // check user connections
  if (topic.startsWith("game/state/")) {
    const gameId = topic.replace("game/state/", "");
    console.log("send");
    sendGameState(gameId);
  }
  if (topic.startsWith("game/user-presence/")) {
    const gameId = topic.replace("game/user-presence/", "");
    const { action, payload } = JSON.parse(message.toString());
    if (action === "LEAVE") {
      const operationStatus = await redis.lrem(
        `players-${gameId}`,
        0,
        JSON.stringify(payload)
      );
      mqtt.publish(
        `game/chat/${gameId}`,
        JSON.stringify({
          text: `${payload.username} left the game`,
        })
      );
    } else {
      mqtt.publish(
        `game/chat/${gameId}`,
        JSON.stringify({
          text: `${payload.username} joined the game`,
        })
      );
    }
    sendGameState(gameId);
  }
});
