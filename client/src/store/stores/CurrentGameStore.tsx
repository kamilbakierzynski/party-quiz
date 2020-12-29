import { Action, action, computed, Computed, thunk, Thunk } from "easy-peasy";
import { Moment } from "moment";
import { User } from "./AuthStore";
import { Game } from "./GamesStore";
import { StoreModel } from "../Store";
import mqtt from "../../config/mqttClient";

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
}

const currentGame: CurrentGameStore = {
  mqttReducer: thunk((actions, payload, { getState }) => {
    const { topic, message } = payload;
    const { game } = getState();
    if (topic === `game/chat/${game?.id}`) {
      actions.addMessageToState(JSON.parse(message.toString()));
    } else if (topic === `game/state/${game?.id}`) {
      console.log(JSON.parse(message.toString()));
      // actions.setGame(JSON.parse(message.toString()));
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
};

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
