import { Action, action, computed, Computed, thunk, Thunk } from "easy-peasy";
import { serverAxios } from "../../config/serverAxios";
import { RegisterUserResponse, VerifyUserResponse } from "./ServerResponses";
import mqtt from "config/mqttClient";

export interface AuthStore {
  user: User | undefined;
  setUser: Action<AuthStore, User | undefined>;
  signedIn: Computed<AuthStore, boolean>;
  registerNewUser: Thunk<
    AuthStore,
    RegisterUserPayload,
    never,
    never,
    Promise<boolean>
  >;
  verifyUser: Thunk<AuthStore, { id: string }, never, never, Promise<boolean>>;
}

const auth: AuthStore = {
  user: undefined,
  setUser: action((state, payload) => {
    mqtt.subscribe(`messages/${payload?.id}/#`);
    mqtt.subscribe(`invites/${payload?.id}`);
    state.user = payload;
  }),
  signedIn: computed((state) => state.user !== undefined),
  registerNewUser: thunk(async (actions, payload) => {
    const { data } = await serverAxios.post<RegisterUserResponse>(
      "/user/new-user",
      payload
    );
    if (data.response === "OK") {
      const user = {
        id: data.key,
        username: data.username,
        avatarUrl: data.avatarUrl,
      };
      actions.setUser(user);
      sessionStorage.setItem("user", JSON.stringify(user));
      return true;
    } else {
      return false;
    }
  }),
  verifyUser: thunk(async (actions, payload) => {
    const { data } = await serverAxios.get<VerifyUserResponse>(
      `/user/verify-user/${payload.id}`
    );
    if (data.response === "OK") {
      return true;
    } else {
      return false;
    }
  }),
};

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface RegisterUserPayload {
  username: string;
  avatarUrl: string;
}

export default auth;
