import React, { useEffect } from "react";
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
    // eslint-disable-next-line
  }, []);
  return hasGameStarted ? <GameLayout /> : <WaitingForPlayers />;
};
export default MQTTGameConnections;
