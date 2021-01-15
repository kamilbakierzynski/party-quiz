import { Action, action, computed, Computed, thunk, Thunk } from "easy-peasy";
import { Moment } from "moment";
import { serverAxios } from "../../config/serverAxios";
import { StoreModel } from "../Store";
import { RegisterUserResponse, VerifyUserResponse } from "./ServerResponses";

export interface MessagesStore {
  getConversations: Thunk<
    MessagesStore,
    never,
    never,
    StoreModel,
    Promise<Array<Conversation>>
  >;
  getMessages: Thunk<
    MessagesStore,
    { partnerId: string },
    never,
    StoreModel,
    Promise<Array<Message>>
  >;
  sendMessage: Thunk<MessagesStore, MessagePOST, never, never>;
}

const messages: MessagesStore = {
  getConversations: thunk(async (actions, payload, { getStoreState }) => {
    const userId = getStoreState().auth.user?.id;
    const { data } = await serverAxios.get<Array<Conversation>>(
      `/messages/get-conversations/${userId}`
    );
    return data;
  }),
  getMessages: thunk(async (actions, payload, { getStoreState }) => {
    const userId = getStoreState().auth.user?.id;
    const { data } = await serverAxios.get<Array<Message>>(
      `/messages/get-messages/${userId}/${payload.partnerId}`
    );
    return data;
  }),
  sendMessage: thunk(async (actions, payload) => {
    serverAxios.post("/messages/send-message", payload);
  })
};

export interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  sendTime: Moment;
}

type Overwrite<T1, T2> = {
  [P in Exclude<keyof T1, keyof T2>]: T1[P];
} &
  T2;

type MessagePOST = Overwrite<Message, { sendTime?: Moment }>;

export interface Conversation {
  partnerId: string;
  avatarUrl: string;
  lastMessage?: Message;
}

export default messages;
