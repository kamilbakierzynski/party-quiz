import React, { useEffect } from "react";
import { Card } from "semantic-ui-react";
import GameListItem from "../../components/ui/GameListItem";
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
  }, []);

  console.log(gamesArray)
  return (
    <Card.Group>
      {gamesArray.map((game) => (
        <GameListItem
          gameId={game.id}
          maxPlayers={game.maxNumberOfPlayers}
          currentPlayers={game.joinedPlayers.length}
          creationDate={moment(game.creationDate)}
          gameTitle={game.gameTitle}
        />
      ))}
    </Card.Group>
  );
};
export default PublicGamesList;
