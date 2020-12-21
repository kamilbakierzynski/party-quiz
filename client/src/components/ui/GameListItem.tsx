import React from "react";
import { Button, Card, Image, Statistic } from "semantic-ui-react";
import { Moment } from "moment";
import { useStoreActions, useStoreState } from "../../store/hooks";
import { useHistory } from "react-router-dom";
import { notification } from "antd";

interface GameListItem {
  gameId: string;
  gameTitle: string;
  creationDate: Moment;
  currentPlayers: number;
  maxPlayers: number;
}

const GameListItem = ({
  gameId,
  gameTitle,
  creationDate,
  currentPlayers,
  maxPlayers,
}: GameListItem) => {
  const joinGame = useStoreActions((actions) => actions.games.joinGame);
  const user = useStoreState((state) => state.auth.user);
  const history = useHistory();

  const handleJoinButtonClick = () => {
    joinGame({ params: { id: gameId }, body: user! }).then((response) => {
      if (response) {
        history.push(`/game/${gameId}`);
      } else {
        notification["error"]({
          message: "Unable to join the game",
          description: "Something is not right, try again.",
        });
      }
    });
  };

  return (
    <Card>
      <Card.Content>
        <Image
          circular
          floated="right"
          size="mini"
          src={`https://avatars.dicebear.com/api/initials/${gameTitle}.svg`}
        />
        <Card.Header>{gameTitle}</Card.Header>
        <Card.Meta>{creationDate.fromNow()}</Card.Meta>
        <Card.Description>
          {`Players: ${currentPlayers}/${maxPlayers}`}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button color="green" fluid onClick={handleJoinButtonClick}>
          Join
        </Button>
      </Card.Content>
    </Card>
  );
};
export default GameListItem;
