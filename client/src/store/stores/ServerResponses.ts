import { Game } from "./GamesStore";

export interface RegisterUserResponse {
  response: ResponseStatus;
  key: string;
  username: string;
  avatarUrl: string;
}

export interface VerifyUserResponse {
  response: ResponseStatus;
}

export interface NewGameResponse {
  response: ResponseStatus;
  id: string;
}

export interface GamesListResponse {
  games: Array<Game>;
  count: number;
}

export interface JoinGameResponse {
  response: ResponseStatus;
}

export type ResponseStatus = "OK" | "FAIL";
