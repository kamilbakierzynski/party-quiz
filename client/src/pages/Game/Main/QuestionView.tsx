import React from "react";
import styles from "./scss/GameLayout.module.scss";
import { Typography } from "antd";
import { Button } from "semantic-ui-react";
import { useStoreState, useStoreActions } from "../../../store/hooks";

const { Title, Text } = Typography;

const QuestionView = () => {
  const game = useStoreState((state) => state.currentGame.game);
  const answerQuestion = useStoreActions(
    (actions) => actions.currentGame.answerQuestion
  );
  const skipQuestion = useStoreActions(
    (actions) => actions.currentGame.skipQuestion
  );
  return (
    <div className={styles.question_wrapper}>
      <div className={styles.question}>
        <Title style={{ margin: 0 }}>{game?.state?.question?.text}</Title>
      </div>
      <div className={styles.answers_list}>
        {game?.state?.question?.possible_answers.map((answer) => (
          <div
            className={styles.answer}
            onClick={() => answerQuestion({ key: answer.key })}
          >
            <Title style={{ margin: 0 }}>{answer.text}</Title>
          </div>
        ))}
      </div>
      <div className={styles.additional_actions}>
        <Button negative onClick={() => skipQuestion()}>
          Skip this question and lose 2 points
        </Button>
      </div>
    </div>
  );
};
export default QuestionView;
