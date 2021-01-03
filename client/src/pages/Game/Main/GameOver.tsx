import React from "react";
import { useStoreState } from "../../../store/hooks";
import styles from "./scss/GameOver.module.scss";
import { Avatar, Space, Typography } from "antd";
import { CrownTwoTone } from "@ant-design/icons";
import { Button } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { User } from "../../../store/stores/AuthStore";

const { Title } = Typography;

const GameOver = () => {
  const game = useStoreState((state) => state.currentGame.game);
  const history = useHistory();

  const scoreOfPlayer = (player: User) => {
    const score = game?.state?.scores.find(
      (score) => score.user.id === player.id
    )?.score;
    return score || 0;
  };

  const sortByPoints = (player1: User, player2: User) =>
    scoreOfPlayer(player2) - scoreOfPlayer(player1);

  return (
    <div className={styles.main_window}>
      <Title>Game Over</Title>
      <div className={styles.players_leaderboard}>
        {[...(game?.joinedPlayers || [])]
          .sort(sortByPoints)
          .map((player, index) => {
            const displayCrown = [0, 1, 2].includes(index);
            return (
              <div className={styles.crown_wrapper}>
                {displayCrown && (
                  <div className={styles.crown_icon}>
                    <CrownTwoTone
                      style={{ fontSize: 50 }}
                      twoToneColor={crownColor(index)}
                    />
                  </div>
                )}
                <div className={styles.user_wrapper}>
                  <Avatar
                    src={player.avatarUrl}
                    size={90}
                    style={{ marginLeft: 10, marginRight: 10 }}
                  />
                  <Title level={5}>{player.username}</Title>
                  <div className={styles.score}>{scoreOfPlayer(player)}</div>
                </div>
              </div>
            );
          })}
      </div>
      <div className={styles.actions}>
        <Button size="massive" onClick={() => history.push("/games")}>
          Go back
        </Button>
      </div>
    </div>
  );
};

const crownColor = (place: number) => {
  switch (place) {
    case 0:
      return "#ffd615";
    case 1:
      return "#848999";
    case 2:
      return "#b47b27";
    default:
      return "";
  }
};

export default GameOver;
