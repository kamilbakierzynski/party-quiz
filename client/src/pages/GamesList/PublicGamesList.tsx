import React, { useEffect } from "react";
import GameListItem from "./GameListItem";
import moment from "moment";
import { useStoreActions, useStoreState } from "../../store/hooks";

const PublicGamesList = () => {
  const gamesArray = useStoreState((state) => state.games.gamesArray);
  const getGames = useStoreActions((actions) => actions.games.getGames);

  useEffect(() => {
    getGames();
    const interval = setInterval(() => {
      getGames();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {gamesArray.map((game) => (
        <GameListItem
          gameId={game.id}
          maxPlayers={game.maxNumberOfPlayers}
          currentPlayers={game.joinedPlayers.length}
          creationDate={moment(game.creationDate)}
          gameTitle={game.gameTitle}
        />
      ))}
    </>
  );
};
export default PublicGamesList;
