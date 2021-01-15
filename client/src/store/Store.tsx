import { createStore } from "easy-peasy";
import auth, { AuthStore } from "./stores/AuthStore";
import currentGame, { CurrentGameStore } from "./stores/CurrentGameStore";
import games, { GamesStore } from "./stores/GamesStore";
import messages, { MessagesStore } from "./stores/MessagesStore";

export interface StoreModel {
  auth: AuthStore;
  games: GamesStore;
  currentGame: CurrentGameStore;
  messages: MessagesStore;
}

const storeModel: StoreModel = {
  auth: auth,
  games: games,
  currentGame: currentGame,
  messages: messages,
};

const store = createStore(storeModel);

export default store;
