import React, { useState, useEffect } from "react";
import styles from "./scss/GameLayout.module.scss";
import { Space, Typography } from "antd";
import { Button } from "semantic-ui-react";
import { useStoreActions, useStoreState } from "../../../store/hooks";
import Avatar from "antd/lib/avatar/avatar";

const { Title, Text } = Typography;

const ScoreView = () => {
  const [time, setTime] = useState(30);
  const game = useStoreState((state) => state.currentGame.game);
  const user = useStoreState((state) => state.auth.user);
  const nextQuestion = useStoreActions(
    (actions) => actions.currentGame.nextQuestion
  );

  const isAskedUser = game?.state?.question?.user_asked?.id === user?.id;

  useEffect(() => {
    const interval = setInterval(() => {
      if (time < 1) {
        isAskedUser && nextQuestion();
        clearInterval(interval);
      }
      setTime((oldTime) => oldTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className={styles.question_wrapper}>
      <div className={styles.question}>
        <Space direction="vertical">
          <Text type="secondary">{`Question for ${game?.state?.question?.user_asked.username} was:`}</Text>
          <Title style={{ margin: 0 }}>{game?.state?.question?.text}</Title>
        </Space>
      </div>
      <div className={styles.answers_list}>
        {game?.state?.question?.possible_answers.map((answer) => {
          const correctAnswer =
            game.state?.question?.user_answer?.key === answer.key;
          return (
            <div
              className={`${styles.answer} ${
                correctAnswer ? styles.correct_answer : undefined
              }`}
            >
              <Title>{answer.text}</Title>
              {game.state?.bets?.filter((bet) => bet.answer.key === answer.key)
                .length !== 0 && (
                <div className={styles.voted}>
                  {game.state?.bets
                    ?.filter((bet) => bet.answer.key === answer.key)
                    ?.map((bet) => (
                      <div className={styles.user_wrapper}>
                        <Avatar
                          src={bet.user.avatarUrl}
                          size={70}
                          style={{ marginLeft: 10, marginRight: 10 }}
                        />
                        <Title level={5}>{bet.user.username}</Title>
                        <div className={styles.bet}>{bet.bet}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.additional_actions}>
        <Button
          positive
          disabled={!isAskedUser}
          onClick={isAskedUser ? () => nextQuestion() : undefined}
        >{`Next question in ${time}`}</Button>
      </div>
    </div>
  );
};
export default ScoreView;
