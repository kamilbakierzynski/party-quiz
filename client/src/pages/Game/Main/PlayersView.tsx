import React from "react";
import { Avatar, Badge, Typography } from "antd";
import { useStoreState } from "../../../store/hooks";
import styles from "./scss/GameLayout.module.scss";
import { CheckCircleTwoTone } from "@ant-design/icons";

const { Title } = Typography;

const PlayersView = () => {
  const game = useStoreState((state) => state.currentGame.game);

  return (
    <>
      {game?.joinedPlayers.map((player) => {
        const answeringPlayer =
          game.state?.question?.user_asked.id === player.id;
        const playerHasAnswered =
          answeringPlayer && game.state?.question?.user_answer;
        const playerHasPlacedBet = game.state?.bets?.find(
          (bet) => bet.user.id === player.id
        );
        return (
          <Badge
            count={
              game.state?.scores.find((user) => user.user.id === player.id)
                ?.score
            }
            offset={[-15, 10]}
            style={{ backgroundColor: "#482ff7" }}
            key={player.id}
          >
            <div
              className={styles.user_wrapper}
              style={
                answeringPlayer ? { border: "3px solid #2f89fc" } : undefined
              }
            >
              <Avatar
                src={player.avatarUrl}
                size={90}
              />
              <Title level={5}>{player.username}</Title>
              {(playerHasAnswered || playerHasPlacedBet) && (
                <div className={styles.ready_icon}>
                  <CheckCircleTwoTone
                    style={{ fontSize: 30 }}
                    twoToneColor="#52c41a"
                  />
                </div>
              )}
            </div>
          </Badge>
        );
      })}
    </>
  );
};
export default PlayersView;
