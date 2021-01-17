import { Avatar, message, notification } from "antd";
import { Action, action, computed, Computed, thunk, Thunk } from "easy-peasy";
import { Moment } from "moment";
import { serverAxios } from "../../config/serverAxios";
import { StoreModel } from "../Store";
import { User } from "./AuthStore";
import { MQTTAction } from "./CurrentGameStore";
import {
  JoinGameResponse,
  RegisterUserResponse,
  VerifyUserResponse,
} from "./ServerResponses";

export interface MessagesStore {
  mqttReducer: Thunk<MessagesStore, MQTTAction, never, StoreModel>;
  displayConversation: Action<MessagesStore, { user: User }>;
  closeConversation: Action<MessagesStore>;
  conversationWith?: User;
  showConversationModal: boolean;
  refreshConversation: Action<MessagesStore>;
  refreshVar: boolean;
  //
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
  sendInvite: Thunk<MessagesStore, Invite>;
}

const messages: MessagesStore = {
  mqttReducer: thunk(
    (actions, payload, { getState, getStoreState }) => {
      const { topic, message } = payload;
      const userId = getStoreState().auth.user?.id;
      const partnerId = getState().conversationWith?.id;
      if (topic === `messages/${userId}/${partnerId}`) {
        actions.refreshConversation();
      } else if (topic.startsWith(`messages/${userId}`)) {
        const messageInfo = JSON.parse(message.toString());
        notification.open({
          message: `${messageInfo.sender.username} sends you a message`,
          icon: <Avatar src={messageInfo.sender.avatarUrl} size={30} />,
          description: "Click here to reply",
          onClick: () => {
            actions.displayConversation({ user: messageInfo.sender });
          },
        });
      }
    }
  ),
  refreshConversation: action((state, payload) => {
    state.refreshVar = !state.refreshVar;
  }),
  refreshVar: false,
  conversationWith: undefined,
  showConversationModal: false,
  displayConversation: action((state, payload) => {
    state.conversationWith = payload.user;
    state.showConversationModal = true;
  }),
  closeConversation: action((state, payload) => {
    state.conversationWith = undefined;
    state.showConversationModal = false;
  }),
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
    await serverAxios.post("/messages/send-message", payload);
    return;
  }),
  sendInvite: thunk(async (actions, payload) => {
    await serverAxios.post("/invites/send-invite", payload);
    return;
  }),
};

export interface Message {
  sender: User;
  receiver: User;
  text: string;
  sendTime: Moment;
}

type Overwrite<T1, T2> = {
  [P in Exclude<keyof T1, keyof T2>]: T1[P];
} &
  T2;

export interface Invite {
  sender: User;
  receiver: User;
  joinCode: string;
}

export type MessagePOST = Overwrite<Message, { sendTime?: Moment }>;

export interface Conversation {
  partner: User;
  lastMessage?: Message;
}

export default messages;
