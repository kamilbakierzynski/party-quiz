import React, { useCallback, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import RestrictedPath from "./components/routing/RestrictedPath";
import MQTTConnector from "./pages/Game/MQTTConnector";
import Layout from "./pages/Game/Layout";
import GamesList from "./pages/GamesList/GamesList";
import SignInPage from "./pages/SignInPage";
import { useStoreActions, useStoreState } from "./store/hooks";
import mqtt from "./config/mqttClient";
import Messages from "./pages/Messages/Messages";
import ChatModal from "./pages/Messages/ChatModal";
import MessagesListModal from "pages/Messages/MessagesListModal";
import Avatar from "antd/lib/avatar/avatar";
import { notification } from "antd";
import { Button } from "semantic-ui-react";

const Router = (): JSX.Element => {
  const signedIn = useStoreState((state) => state.auth.signedIn);
  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const verifyUser = useStoreActions((actions) => actions.auth.verifyUser);
  const mqttGameReducer = useStoreActions(
    (actions) => actions.currentGame.mqttReducer
  );
  const mqttMessagesReducer = useStoreActions(
    (actions) => actions.messages.mqttReducer
  );
  const mqttGamesReducer = useStoreActions(
    (actions) => actions.games.mqttReducer
  );

  const joinGame = useStoreActions((actions) => actions.games.joinGame);
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
    mqtt.subscribe("list");
    mqtt.on("message", (topic, message) => {
      mqttGameReducer({ topic, message });
      mqttMessagesReducer({ topic, message });
      mqttGamesReducer({ topic, message });
      if (topic.startsWith("invites")) {
        joinToGameFromInvite(message);
      }
    });
  }, []); //eslint-disable-line

  const joinToGameFromInvite = (message: Buffer) => {
    const messageInfo = JSON.parse(message.toString());
    const handleJoinClick = () => {
      const parameters = {
        params: { code: messageInfo.joinCode },
      };
      joinGame(parameters).then((response) => {
        if (response.status) {
          history.push(`/game/${response.id}`);
          notification.close(`invite/${messageInfo.joinCode}`);
        } else {
          notification["error"]({
            message: "Unable to join the game",
            description: "Something is not right, try again.",
          });
        }
      });
    };
    notification.open({
      message: `${messageInfo.sender.username} invites you to game`,
      key: `invite/${messageInfo.joinCode}`,
      duration: 0,
      icon: <Avatar src={messageInfo.sender.avatarUrl} size={30} />,
      description: (
        <>
          <Button
            negative
            onClick={() => notification.close(`invite/${messageInfo.joinCode}`)}
          >
            Cancel
          </Button>
          <Button positive onClick={handleJoinClick}>
            Join
          </Button>
        </>
      ),
    });
  };
  return (
    <>
      <ChatModal />
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
      <MessagesListModal />
    </>
  );
};
export default Router;
