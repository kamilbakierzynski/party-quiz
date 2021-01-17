import { Action, action, thunk, Thunk } from "easy-peasy";
import { Moment } from "moment";
import { StoreModel } from "store/Store";
import { NumberLiteralType } from "typescript";
import { serverAxios } from "../../config/serverAxios";
import { User } from "./AuthStore";
import { GameState, MQTTAction } from "./CurrentGameStore";
import {
  GamesListResponse,
  JoinGameResponse,
  NewGameResponse,
} from "./ServerResponses";

export interface GamesStore {
  mqttReducer: Thunk<GamesStore, MQTTAction>;
  gamesArray: Array<Game>;
  overwriteGamesArray: Action<GamesStore, Array<Game>>;
  createGame: Thunk<GamesStore, CreateGame, never, never, Promise<string>>;
  getGames: Thunk<GamesStore>;
  joinGame: Thunk<
    GamesStore,
    JoinGame,
    never,
    StoreModel,
    Promise<{ status: boolean; id?: string }>
  >;
  kickPlayer: Thunk<GamesStore, { gameId: string; user: User }>;
}

const games: GamesStore = {
  mqttReducer: thunk((actions, payload, { getState }) => {
    const { topic, message } = payload;
    if (topic === "list") {
      actions.overwriteGamesArray(JSON.parse(message.toString()));
    }
  }),
  gamesArray: [],
  overwriteGamesArray: action((state, payload) => {
    state.gamesArray = payload;
  }),
  createGame: thunk(async (actions, payload) => {
    const { data } = await serverAxios.post<NewGameResponse>(
      "/games/new-game",
      payload
    );
    if (data.response === "OK") {
      return data.id;
    } else {
      return "";
    }
  }),
  getGames: thunk(async (actions, payload) => {
    serverAxios.get<GamesListResponse>("/games/list").then(({ data }) => {
      if (data.games) {
        actions.overwriteGamesArray(data.games);
      }
    });
  }),
  joinGame: thunk(async (actions, payload, { getStoreState }) => {
    const body = payload.body || getStoreState().auth.user;
    return serverAxios
      .post<JoinGameResponse>("/games/join-game", body, {
        params: payload.params,
      })
      .then(({ data }) => {
        if (data.response === "OK") {
          return { status: true, id: data.id };
        }
        return { status: false };
      });
  }),
  kickPlayer: thunk(async (actions, payload) => {
    return await serverAxios.post(
      `/games/${payload.gameId}/kick-player`,
      payload.user
    );
  }),
};

export interface Game extends GameState {
  id: string;
  gameTitle: string;
  maxNumberOfPlayers: number;
  pointsToWin: number;
  currentPlayers: number;
  creationDate: Moment;
  joinedPlayers: Array<User>;
  joinCode: string;
  public: boolean;
  started: boolean;
  creatorId: string;
  questionsLeft?: number;
}

export interface CreateGame {
  gameTitle: string;
  public: boolean;
  maxNumberOfPlayers: number;
  pointsToWin: number;
  user: User;
}

export interface JoinGame {
  params: { code?: string; id?: string };
  body?: User;
}

export default games;
