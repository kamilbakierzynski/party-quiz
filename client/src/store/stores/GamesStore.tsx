import { Action, action, thunk, Thunk } from "easy-peasy";
import { Moment } from "moment";
import { NumberLiteralType } from "typescript";
import { serverAxios } from "../../config/serverAxios";
import { User } from "./AuthStore";
import { GameState } from "./CurrentGameStore";
import {
  GamesListResponse,
  JoinGameResponse,
  NewGameResponse,
} from "./ServerResponses";

export interface GamesStore {
  gamesArray: Array<Game>;
  overwriteGamesArray: Action<GamesStore, Array<Game>>;
  createGame: Thunk<GamesStore, CreateGame, never, never, Promise<string>>;
  getGames: Thunk<GamesStore>;
  joinGame: Thunk<
    GamesStore,
    JoinGame,
    never,
    never,
    Promise<{ status: boolean; id?: string }>
  >;
}

const games: GamesStore = {
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
  joinGame: thunk(async (actions, payload) => {
    return serverAxios
      .post<JoinGameResponse>("/games/join-game", payload.body, {
        params: payload.params,
      })
      .then(({ data }) => {
        if (data.response === "OK") {
          return { status: true, id: data.id };
        }
        return { status: false };
      });
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
  body: User;
}

export default games;
