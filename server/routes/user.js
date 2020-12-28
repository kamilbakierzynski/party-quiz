import express from "express";
import client from "../config/redisClient";
import { v4 as uuidv4 } from "uuid";

const router = express.Router({ mergeParams: true });

const KEY_EXPIRATION = 3600; //in seconds

router.post("/new-user", async (req, res) => {
  const body = req.body;
  const { username, avatarUrl } = body;
  const id = uuidv4()
  const newKey = keyFormatter(id);
  const response = await client.setex(
    newKey,
    KEY_EXPIRATION,
    JSON.stringify(body)
  );
  return res.send({ response, key: id, username, avatarUrl });
});

router.get("/verify-user/:idUser", async (req, res) => {
  const idUser = req.params.idUser;
  const key = keyFormatter(idUser);
  const response = await client.get(key);
  if (response) {
    await client.expire(key, KEY_EXPIRATION);
  }
  return res.send({
    response: response ? "OK" : "FAIL",
  });
});

const keyFormatter = (key) => `user-${key}`;

export default router;
