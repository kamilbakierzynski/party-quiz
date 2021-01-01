import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import mqtt from "../../config/mqttClient";
import { Dimmer, Loader, Segment } from "semantic-ui-react";
import { useStoreActions, useStoreState } from "../../store/hooks";
import { serverAxios } from "../../config/serverAxios";
import { Game } from "../../store/stores/GamesStore";

interface MQTTConnectorProps {
  children: JSX.Element;
}

const MQTTConnector = ({ children }: MQTTConnectorProps) => {
  const { idGame } = useParams() as Params;
  const user = useStoreState((state) => state.auth.user);
  const [awaitConnection, setAwaitConnection] = useState(true);
  const setGame = useStoreActions((actions) => actions.currentGame.setGame);
  const listenForChatMessages = useStoreActions(
    (actions) => actions.currentGame.listenForChatMessages
  );
  const stopListening = useStoreActions(
    (actions) => actions.currentGame.stopListeningForChatMessages
  );

  useEffect(() => {
    serverAxios.get<Array<Game>>(`/games/${idGame}`).then(({ data }) => {
      setGame(data[0]);
      listenForChatMessages();
      setAwaitConnection(false);
    });
    mqtt.publish(
      `game/user-presence/${idGame}`,
      JSON.stringify({ action: "JOIN", payload: user })
    );
    //eslint-disable-next-line
  }, [idGame]);

  useEffect(() => {
    return () => {
      mqtt.publish(
        `game/user-presence/${idGame}`,
        JSON.stringify({ action: "LEAVE", payload: user })
      );
      stopListening();
    };
    //eslint-disable-next-line
  }, [idGame]);

  return awaitConnection ? (
    <div style={{ width: "100%", height: "100vh" }}>
      <Segment>
        <Dimmer active>
          <Loader size="massive">Loading your game</Loader>
        </Dimmer>
        <div style={{ width: "100%", height: "100vh" }}></div>
      </Segment>
    </div>
  ) : (
    children
  );
};
export default MQTTConnector;

interface Params {
  idGame: string;
}
