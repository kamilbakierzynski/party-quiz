import { Action, action, computed, Computed, thunk, Thunk } from "easy-peasy";
import { Moment } from "moment";
import { User } from "./AuthStore";
import { Game } from "./GamesStore";
import { StoreModel } from "../Store";
import mqtt from "../../config/mqttClient";
import { serverAxios } from "../../config/serverAxios";

export interface CurrentGameStore {
  mqttReducer: Thunk<CurrentGameStore, MQTTAction>;
  game?: Game;
  setGame: Action<CurrentGameStore, Game>;
  chatMessages: Array<Message>;
  addMessageToState: Action<CurrentGameStore, Message>;
  sendMessage: Thunk<CurrentGameStore, Message, StoreModel>;
  listenForChatMessages: Thunk<CurrentGameStore, never, StoreModel>;
  listenForGameState: Thunk<CurrentGameStore, never, StoreModel>;
  stopListeningForChatMessages: Thunk<CurrentGameStore, never, StoreModel>;
  stopListeningForGameState: Thunk<CurrentGameStore, never, StoreModel>;
  clearStore: Action<CurrentGameStore>;
  // HTPP Endpoints
  startGame: Thunk<CurrentGameStore, never, StoreModel>;
  answerQuestion: Thunk<CurrentGameStore, { key: string }, StoreModel>;
  betOnAnswer: Thunk<
    CurrentGameStore,
    { user: User; key: string; bet: number },
    StoreModel
  >;
  nextQuestion: Thunk<CurrentGameStore, never, StoreModel>;
  skipQuestion: Thunk<CurrentGameStore, never, StoreModel>;
}

const currentGame: CurrentGameStore = {
  mqttReducer: thunk((actions, payload, { getState }) => {
    const { topic, message } = payload;
    const { game } = getState();
    if (topic === `game/chat/${game?.id}`) {
      actions.addMessageToState(JSON.parse(message.toString()));
    } else if (topic === `game/state/${game?.id}`) {
      actions.setGame(JSON.parse(message.toString()));
    }
  }),
  game: undefined,
  setGame: action((state, payload) => {
    state.game = payload;
  }),
  chatMessages: [],
  addMessageToState: action((state, payload) => {
    state.chatMessages.push(payload);
  }),
  sendMessage: thunk(async (actions, payload, { getState }) => {
    const { game } = getState();
    if (game?.id) {
      const chatTopic = `game/chat/${game.id}`;
      mqtt.publish(chatTopic, JSON.stringify(payload));
    }
  }),
  listenForChatMessages: thunk(async (actions, payload, { getState }) => {
    const { game } = getState();
    if (game?.id) {
      const chatTopic = `game/chat/${game.id}`;
      mqtt.subscribe(chatTopic);
    }
  }),
  listenForGameState: thunk(async (actions, payload, { getState }) => {
    const { game } = getState();
    if (game?.id) {
      const chatTopic = `game/state/${game.id}`;
      mqtt.subscribe(chatTopic);
    }
  }),
  stopListeningForChatMessages: thunk(
    async (actions, payload, { getState }) => {
      const { game } = getState();
      if (game?.id) {
        const chatTopic = `game/state/${game.id}`;
        mqtt.unsubscribe(chatTopic);
        actions.clearStore();
      }
    }
  ),
  stopListeningForGameState: thunk(async (actions, payload, { getState }) => {
    const { game } = getState();
    if (game?.id) {
      const chatTopic = `game/state/${game.id}`;
      mqtt.unsubscribe(chatTopic);
      actions.clearStore();
    }
  }),
  clearStore: action((state, payload) => {
    state.game = undefined;
    state.chatMessages = [];
  }),
  startGame: thunk(async (actions, payload, { getState }) => {
    const { game } = getState();
    if (game?.id) {
      serverAxios.post(`/current-game/${game.id}/start-game`);
    }
  }),
  answerQuestion: thunk(async (actions, payload, { getState }) => {
    const { game } = getState();
    if (game?.id) {
      serverAxios.post(`/current-game/${game.id}/answer-question`, payload);
    }
  }),
  betOnAnswer: thunk(async (actions, payload, { getState }) => {
    const { game } = getState();
    if (game?.id) {
      serverAxios.post(`/current-game/${game.id}/bet-answer`, payload);
    }
  }),
  nextQuestion: thunk(async (actions, payload, { getState }) => {
    const { game } = getState();
    if (game?.id) {
      serverAxios.post(`/current-game/${game.id}/next-question`, payload);
    }
  }),
  skipQuestion: thunk(async (actions, payload, { getState }) => {
    const { game } = getState();
    if (game?.id) {
      serverAxios.post(`/current-game/${game.id}/skip-question`, payload);
    }
  }),
};

export interface GameState {
  state?: {
    question?: Question;
    scores: Array<Score>;
    bets?: Array<Bet>;
  };
}

export interface Question {
  text: string;
  possible_answers: Array<Answer>;
  user_asked: User;
  user_answer?: Answer;
}

export interface Answer {
  key: string;
  text: string;
}

export interface Score {
  user: User;
  score: number;
}

export interface Bet {
  user: User;
  answer: Answer;
  bet: number;
}

export interface Message {
  sender: User;
  text: string;
  creationDate: Moment | number;
}

export interface MQTTAction {
  topic: string;
  message: Buffer;
}

export default currentGame;
