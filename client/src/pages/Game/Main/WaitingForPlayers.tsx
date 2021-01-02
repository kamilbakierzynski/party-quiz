import React from "react";
import { Avatar, Typography } from "antd";
import {
  Button,
  Divider,
  Icon,
  Progress,
  Statistic,
} from "semantic-ui-react";
import { useStoreActions, useStoreState } from "../../../store/hooks";
import styles from "./WaitingForPlayers.module.scss";
import { CrownTwoTone } from "@ant-design/icons";

const { Title } = Typography;

const WaitingForPlayers = () => {
  const game = useStoreState((state) => state.currentGame.game);
  const user = useStoreState((state) => state.auth.user);

  const startGame = useStoreActions((actions) => actions.currentGame.startGame);

  const isMoreThan2Players = (game?.joinedPlayers?.length || 0) > 1;
  const isGameCreator = game?.creatorId === user?.id;
  return (
    <div className={styles.page_wrapper}>
      <div className={styles.code}>
        <Statistic size="huge">
          <Statistic.Value>{game?.joinCode}</Statistic.Value>
          <Statistic.Label>Game Join Code</Statistic.Label>
        </Statistic>
      </div>
      <Divider horizontal>Players</Divider>
      <div className={styles.players}>
        {Array.from(Array(game?.maxNumberOfPlayers || 6).keys()).map(
          (index) => {
            const avatar =
              game?.joinedPlayers[index] !== undefined
                ? game?.joinedPlayers[index].avatarUrl
                : "https://thumbs.dreamstime.com/b/default-avatar-photo-placeholder-profile-icon-eps-file-easy-to-edit-default-avatar-photo-placeholder-profile-icon-124557887.jpg";
            const isPlayer = game?.joinedPlayers[index] !== undefined;
            return (
              <div className={styles.user_wrapper} key={index}>
                <div className={styles.avatar_wrapper}>
                  <Avatar
                    src={avatar}
                    size={90}
                    style={{ marginLeft: 10, marginRight: 10 }}
                  />
                  {game?.creatorId === game?.joinedPlayers[index]?.id && (
                    <div className={styles.host_icon}>
                      <CrownTwoTone
                        style={{ fontSize: 30 }}
                        twoToneColor="#ffd615"
                      />
                    </div>
                  )}
                </div>
                <Title
                  level={5}
                  style={isPlayer ? undefined : { color: "#dee1ec" }}
                >
                  {game?.joinedPlayers[index]?.username || "Free spot"}
                </Title>
              </div>
            );
          }
        )}
      </div>
      <div className={styles.progress_bar}>
        <Progress
          value={game?.joinedPlayers.length || 0}
          total={game?.maxNumberOfPlayers || 6}
          progress="ratio"
          active
        />
      </div>
      <div className={styles.settings}>
        {isGameCreator ? (
          <Button
            size="massive"
            color="violet"
            onClick={() => startGame()}
            disabled={!isMoreThan2Players}
          >
            Start game
          </Button>
        ) : (
          <Button
            size="massive"
            icon
            labelPosition="left"
            disabled
            color="violet"
          >
            <Icon name="circle notched" loading />
            Wait for host to start the game
          </Button>
        )}
      </div>
    </div>
  );
};
export default WaitingForPlayers;
