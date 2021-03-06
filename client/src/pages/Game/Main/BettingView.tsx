import React from "react";
import styles from "./scss/GameLayout.module.scss";
import { Space, Typography } from "antd";
import { Button } from "semantic-ui-react";
import { useStoreState, useStoreActions } from "../../../store/hooks";

const { Title, Text } = Typography;

const BettingView = () => {
  const game = useStoreState((state) => state.currentGame.game);
  const user = useStoreState((state) => state.auth.user);
  const betOnAnswer = useStoreActions(
    (actions) => actions.currentGame.betOnAnswer
  );
  return (
    <div className={styles.question_wrapper}>
      <div className={styles.question}>
        <Space direction="vertical">
          <Text type="secondary">{`Question for ${game?.state?.question?.user_asked.username} was:`}</Text>
          <Title style={{ margin: 0 }}>{game?.state?.question?.text}</Title>
        </Space>
      </div>
      <div className={styles.answers_list}>
        {game?.state?.question?.possible_answers.map((answer) => (
          <div className={styles.answer__bet} key={answer.key}>
            <Title>{answer.text}</Title>
            <div className={styles.bet_actions}>
              <Button.Group size="large">
                <Button
                  onClick={() =>
                    betOnAnswer({ user: user!, key: answer.key, bet: 1 })
                  }
                >
                  Bet 1
                </Button>
                <Button.Or />
                <Button
                  onClick={() =>
                    betOnAnswer({ user: user!, key: answer.key, bet: 2 })
                  }
                >
                  Bet 2
                </Button>
              </Button.Group>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BettingView;
