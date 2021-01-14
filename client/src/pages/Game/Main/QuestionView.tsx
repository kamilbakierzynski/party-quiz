import React, { useEffect, useState } from "react";
import styles from "./scss/GameLayout.module.scss";
import { Typography } from "antd";
import { Button, Modal } from "semantic-ui-react";
import { useStoreState, useStoreActions } from "../../../store/hooks";
import {
  LoadingOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const QuestionView = () => {
  const game = useStoreState((state) => state.currentGame.game);
  const answerQuestion = useStoreActions(
    (actions) => actions.currentGame.answerQuestion
  );
  const skipQuestion = useStoreActions(
    (actions) => actions.currentGame.skipQuestion
  );
  const askToChange = useStoreActions(
    (actions) => actions.currentGame.askToChange
  );
  const cancelVote = useStoreActions(
    (actions) => actions.currentGame.cancelVote
  );
  const [askedToChange, setAskedToChange] = useState(false);

  useEffect(() => {
    // setAskedToChange(false);
  }, [game?.state?.question]);
  return (
    <>
      <div className={styles.question_wrapper}>
        <div className={styles.question}>
          <Title style={{ margin: 0 }}>{game?.state?.question?.text}</Title>
        </div>
        <div className={styles.answers_list}>
          {game?.state?.question?.possible_answers.map((answer) => (
            <div
              className={styles.answer}
              key={answer.key}
              onClick={() => answerQuestion({ key: answer.key })}
            >
              <Title style={{ margin: 0 }}>{answer.text}</Title>
            </div>
          ))}
        </div>
        <div className={styles.additional_actions}>
          <Button
            disabled={askedToChange}
            primary
            onClick={() => {
              askToChange();
              setAskedToChange(true);
            }}
          >
            Ask players to change question
          </Button>
          <Button negative onClick={() => skipQuestion()}>
            Skip this question and lose 2 points
          </Button>
        </div>
      </div>
      <Modal
        closeOnDimmerClick={false}
        closeOnEscape={false}
        dimmer="blurring"
        open={game?.state?.vote !== undefined}
      >
        <Modal.Header>Result's of current vote</Modal.Header>
        <Modal.Content>
          <div className={styles.modal_results}>
            {game?.joinedPlayers?.slice(0, -1).map((_, index) => {
              const vote = game.state?.vote?.votes[index];
              if (vote === undefined) {
                return <LoadingOutlined style={{ fontSize: 50 }} />;
              }
              if (vote.vote) {
                return (
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ fontSize: 50 }}
                  />
                );
              }
              return (
                <CloseCircleTwoTone
                  twoToneColor="#eb2f96"
                  style={{ fontSize: 50 }}
                />
              );
            })}
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => cancelVote()}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};
export default QuestionView;
