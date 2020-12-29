import React from "react";
import { Avatar } from "antd";
import { Progress, Statistic } from "semantic-ui-react";
import { useStoreState } from "../../../store/hooks";

const WaitingForPlayers = () => {
  const game = useStoreState((state) => state.currentGame.game);
  console.log(game);
  return (
    <div>
      <Statistic size="huge">
        <Statistic.Value>{game?.joinCode}</Statistic.Value>
        <Statistic.Label>Game Join Code</Statistic.Label>
      </Statistic>
      <div>
        <Avatar.Group>
          {Array.from(Array(game?.maxNumberOfPlayers || 6).keys()).map(
            (index) => {
              const avatar =
                game?.joinedPlayers[index] !== undefined
                  ? game?.joinedPlayers[index].avatarUrl
                  : "https://thumbs.dreamstime.com/b/default-avatar-photo-placeholder-profile-icon-eps-file-easy-to-edit-default-avatar-photo-placeholder-profile-icon-124557887.jpg";
              return <Avatar src={avatar} size={90} />;
            }
          )}
        </Avatar.Group>
      </div>
      <Progress
        value={game?.joinedPlayers.length || 0}
        total={game?.maxNumberOfPlayers || 6}
        progress="ratio"
        active
      />
    </div>
  );
};
export default WaitingForPlayers;
