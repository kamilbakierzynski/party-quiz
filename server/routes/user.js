import express from "express";
import { KEY_EXPIRATION } from "../config/gameConfig";
import client from "../config/redisClient";
import keyFormatter, { newUserKey } from "../helpers/keyFormatters/user";
import Responses from "../helpers/responses/responses";

const router = express.Router({ mergeParams: true });

router.post("/new-user", async (req, res) => {
  const body = req.body;
  const { username, avatarUrl } = body;
  const { key: newKey, id } = newUserKey();
  const response = await client.setex(
    newKey,
    KEY_EXPIRATION,
    JSON.stringify({...body, id})
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
    response: response ? Responses.OK : Responses.FAIL,
  });
});

export default router;
