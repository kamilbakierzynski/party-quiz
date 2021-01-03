import { v4 as uuidv4 } from "uuid";

export const USER_KEY = "user"

const keyFormatter = (key) => `${USER_KEY}-${key}`;

export const newUserKey = () => {
  const id = uuidv4()
  const key = keyFormatter(id);
  return { key, id };
}

export default keyFormatter;