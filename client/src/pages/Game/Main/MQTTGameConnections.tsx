import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import mqtt from "../../../config/mqttClient";
import { Dimmer, Loader, Segment } from "semantic-ui-react";
import { useStoreActions, useStoreState } from "../../../store/hooks";
import WaitingForPlayers from "./WaitingForPlayers";
import GameLayout from "./GameLayout";

const MQTTGameConnections = () => {
  const listenForGameState = useStoreActions(
    (actions) => actions.currentGame.listenForGameState
  );
  const stopListening = useStoreActions(
    (actions) => actions.currentGame.stopListeningForGameState
  );
  const hasGameStarted = useStoreState(
    (state) => state.currentGame.game?.started
  );

  useEffect(() => {
    listenForGameState();
    return () => stopListening();
  }, []);

  return hasGameStarted ? <GameLayout /> : <WaitingForPlayers />;
};
export default MQTTGameConnections;
