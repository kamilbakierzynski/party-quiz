import React from "react";
import { Typography } from "antd";
import { useStoreState } from "../../../store/hooks";
import PlayersView from "./PlayersView";
import QuestionView from "./QuestionView";
import styles from "./scss/GameLayout.module.scss";
import { LoadingOutlined } from "@ant-design/icons";
import BettingView from "./BettingView";
import ScoreView from "./ScoreView";

const { Title } = Typography;

const GameLayout = () => {
  const game = useStoreState((state) => state.currentGame.game);
  const user = useStoreState((state) => state.auth.user);

  const userIsAnswering = game?.state?.question?.user_asked?.id === user?.id;
  const askedUserHasAnswered = game?.state?.question?.user_answer;
  const questionIsReady = game?.state?.question;
  const answeringUser = game?.state?.question?.user_asked;
  const playerHasPlacedBet = game?.state?.bets?.find(
    (bet) => bet.user.id === user?.id
  );
  const allPlayersBetted =
    (game?.joinedPlayers.length || 0) - 1 === game?.state?.bets?.length;

  const wrapper = (child: JSX.Element) => {
    return (
      <div className={styles.main_window}>
        {child}
        <div className={styles.players}>
          <PlayersView />
        </div>
      </div>
    );
  };

  if (allPlayersBetted) {
    return wrapper(
      <div className={styles.score_box}>
        <ScoreView />
      </div>
    );
  }

  if (!questionIsReady) {
    return wrapper(
      <div className={styles.info_box}>
        <Title>Wait for question</Title>
        <LoadingOutlined style={{ fontSize: 50 }} />
      </div>
    );
  }

  // Current user is the one with question
  if (userIsAnswering) {
    // User is answering
    if (!askedUserHasAnswered) {
      return wrapper(
        <div className={styles.question_box}>
          <QuestionView />
        </div>
      );
    } else {
      return wrapper(
        <div className={styles.info_box}>
          <Title>Wait for others to place bets.</Title>
          <LoadingOutlined style={{ fontSize: 50 }} />
        </div>
      );
    }
  }
  // User is betting this turn
  if (askedUserHasAnswered) {
    // Player has betted on answer
    if (playerHasPlacedBet) {
      return wrapper(
        <div className={styles.info_box}>
          <Title>Wait for others to place bets.</Title>
          <LoadingOutlined style={{ fontSize: 50 }} />
        </div>
      );
    } else {
      return wrapper(
        <div className={styles.bet_box}>
          <BettingView />
        </div>
      );
    }
  } else {
    return wrapper(
      <div className={styles.info_box}>
        <Title>Wait for {answeringUser?.username} to answer question.</Title>
        <LoadingOutlined style={{ fontSize: 50 }} />
      </div>
    );
  }
};
export default GameLayout;
