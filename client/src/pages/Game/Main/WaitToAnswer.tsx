import React, { useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "../../../store/hooks";
import { User } from "../../../store/stores/AuthStore";
import styles from "./scss/GameLayout.module.scss";
import {
  LoadingOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import { Button, Modal } from "semantic-ui-react";
import { Typography } from "antd";

const { Title } = Typography;

interface WaitToAnswerProps {
  answeringUser?: User;
}

const WaitToAnswer = ({ answeringUser }: WaitToAnswerProps) => {
  const game = useStoreState((state) => state.currentGame.game);
  const vote = useStoreActions((actions) => actions.currentGame.vote);
  const user = useStoreState((state) => state.auth.user);
  const [responded, setResponded] = useState(false);

  const handleRespond = (func: () => void) => {
    func();
    setResponded(true);
  };

  useEffect(() => {
    if (game?.state?.vote === undefined) {
      setResponded(false);
    }
  }, [game?.state?.vote]);
  return (
    <>
      <div className={styles.info_box}>
        <Title>Wait for {answeringUser?.username} to answer question.</Title>
        <LoadingOutlined style={{ fontSize: 50 }} />
      </div>
      <Modal
        closeOnDimmerClick={false}
        closeOnEscape={false}
        dimmer="blurring"
        open={game?.state?.vote !== undefined}
      >
        <Modal.Header>{`${answeringUser?.username} wants to change his question`}</Modal.Header>
        <Modal.Content>
          {!responded
            ? game?.state?.vote?.question
            : game?.joinedPlayers?.slice(0, -1).map((_, index) => {
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
        </Modal.Content>
        {!responded && (
          <Modal.Actions>
            <Button
              negative
              onClick={() =>
                handleRespond(() => vote({ user: user!, vote: false }))
              }
            >
              No way! Answer!
            </Button>
            <Button
              positive
              onClick={() =>
                handleRespond(() => vote({ user: user!, vote: true }))
              }
            >
              Yes, let's change
            </Button>
          </Modal.Actions>
        )}
      </Modal>
    </>
  );
};
export default WaitToAnswer;
