const Responses = {
  OK: "OK",
  FAIL: "FAIL",
  /** @example "Kamil left the game" */
  leftGame: (username) => `${username} left the game`,
  /** @example "Kamil joined the game" */
  joinedGame: (username) => `${username} joined the game`
}
export default Responses;