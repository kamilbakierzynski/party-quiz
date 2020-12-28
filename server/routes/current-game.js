import redis from "../config/redisClient";
import mqtt from "../config/mqttClient";

mqtt.on(`message`, async (topic, message) => {
  // check user connections
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
  }
});
