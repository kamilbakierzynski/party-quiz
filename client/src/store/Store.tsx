import { createStore } from "easy-peasy";
import auth, { AuthStore } from "./stores/AuthStore";
import currentGame, { CurrentGameStore } from "./stores/CurrentGameStore";
import games, { GamesStore } from "./stores/GamesStore";

export interface StoreModel {
  auth: AuthStore;
  games: GamesStore;
  currentGame: CurrentGameStore;
}

const storeModel: StoreModel = {
  auth: auth,
  games: games,
  currentGame: currentGame,
};

const store = createStore(storeModel);

export default store;
