import React, { useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import RestrictedPath from "./components/routing/RestrictedPath";
import MQTTConnector from "./pages/Game/MQTTConnector";
import Layout from "./pages/Game/Layout";
import GamesList from "./pages/GamesList/GamesList";
import SignInPage from "./pages/SignInPage";
import { useStoreActions, useStoreState } from "./store/hooks";
import mqtt from "./config/mqttClient";
import Messages from "./pages/Messages/Messages";

const Router = (): JSX.Element => {
  const signedIn = useStoreState((state) => state.auth.signedIn);
  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const verifyUser = useStoreActions((actions) => actions.auth.verifyUser);
  const mqttReducer = useStoreActions(
    (actions) => actions.currentGame.mqttReducer
  );
  const history = useHistory();

  useEffect(() => {
    if (!signedIn) {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        verifyUser({ id: user.id }).then((response) => {
          if (response) {
            setUser(user);
            history.push("/games");
          }
        });
      }
    }
    mqtt.on("message", (topic, message) => mqttReducer({ topic, message }));
  }, []); //eslint-disable-line
  return (
    <Switch>
      <Route path="/signin">
        <SignInPage />
      </Route>
      <RestrictedPath path="/games">
        <GamesList />
      </RestrictedPath>
      <RestrictedPath path="/messages">
        <Messages />
      </RestrictedPath>
      <RestrictedPath path="/game/:idGame">
        <MQTTConnector>
          <Layout />
        </MQTTConnector>
      </RestrictedPath>
      <RestrictedPath path="/">home</RestrictedPath>
    </Switch>
  );
};
export default Router;
