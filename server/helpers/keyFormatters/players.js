export const PLAYERS_KEY = "players"

const keyFormatter = (key) => `${PLAYERS_KEY}-${key}`;

export default keyFormatter;