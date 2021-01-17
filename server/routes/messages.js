import express from "express";
import mqtt from "../config/mqttClient";
import redis from "../config/redisClient";
import { KEY_EXPIRATION } from "../config/gameConfig";
import { ALL_USERS } from "../helpers/keyFormatters/user";
import messageKeyFormatter, { allUserConversations } from "../helpers/keyFormatters/messages";

const router = express.Router({ mergeParams: true });

router.post("/send-message", async (req, res) => {
  const message = { ...req.body, sendTime: Date.now() }

  const mqttNotification = {
    sender: message.sender,
    messageStart: "Just now"
  }
  // For 1
  const key1 = messageKeyFormatter(message.sender.id, message.receiver.id);
  await redis.lpush(key1, JSON.stringify(message));
  await redis.expire(key1, KEY_EXPIRATION);

  mqtt.publish(`messages/${message.sender.id}/${message.receiver.id}`, JSON.stringify(mqttNotification));

  if (message.sender.id === message.receiver.id) return res.send({});
  // For 2
  const key2 = messageKeyFormatter(message.receiver.id, message.sender.id);
  await redis.lpush(key2, JSON.stringify(message));
  await redis.expire(key2, KEY_EXPIRATION);

  mqtt.publish(`messages/${message.receiver.id}/${message.sender.id}`, JSON.stringify(mqttNotification));
  res.send({});
});

router.get("/get-messages/:idUser/:idPartner", async (req, res) => {
  const { idUser, idPartner } = req.params;
  const messagesStrings = await redis.lrange(messageKeyFormatter(idUser, idPartner), 0, -1) ?? [];
  const messages = messagesStrings.map((message) => JSON.parse(message));
  res.send(messages.reverse());
});

router.get("/get-conversations/:idUser", async (req, res) => {
  const { idUser } = req.params;
  const usersKeys = await redis.keys(ALL_USERS);
  const users = await Promise.all(usersKeys.map(async (key) => JSON.parse(await redis.get(key))));
  const conversationsKeys = await redis.keys(allUserConversations(idUser));
  const conversationMessages = await Promise.all(conversationsKeys.map(async (key) => JSON.parse(await redis.lindex(key, 0))));
  const conversationsActive = conversationMessages.map((message) => {
    const partner = message.receiver.id === idUser ? message.sender : message.receiver;
    return {
      partner: partner,
      lastMessage: message
    }
  });
  const conversationsWithUsers = conversationsActive.map((conversation) => conversation.partner.id);
  const possibleConversations = users.map((user) => {
    return {
      partner: user
    }
  }).filter((conversation) => !conversationsWithUsers.includes(conversation.partner.id));
  const conversations = [...possibleConversations, ...conversationsActive];
  res.send(conversations ?? []);
}
)

export default router;
