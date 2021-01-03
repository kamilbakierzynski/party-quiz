import { v4 as uuidv4 } from "uuid";

export const GAME_KEY = "game";
export const ALL_GAMES = `${GAME_KEY}-*`;

const keyFormatter = (key) => `${GAME_KEY}-${key}`;

export const newGameKey = () => {
  const id = uuidv4();
  const key = keyFormatter(id);
  return { key, id };
}

export const getKeyFromRedisId = (redisId) => redisId.replace(`${GAME_KEY}-`, "");

export default keyFormatter;