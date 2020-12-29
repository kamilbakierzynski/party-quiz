import React, { useState } from "react";
import { notification } from "antd";
import { useHistory } from "react-router-dom";
import { Button, Divider, Icon, Input } from "semantic-ui-react";
import { useStoreActions, useStoreState } from "../../store/hooks";
import CreateNewGame from "./CreateNewGame";
import PublicGamesList from "./PublicGamesList";
import styles from "./scss/GamesList.module.scss";

const GamesList = () => {
  const [inputCode, setInputCode] = useState("");

  const joinGame = useStoreActions((actions) => actions.games.joinGame);
  const user = useStoreState((state) => state.auth.user);
  const history = useHistory();

  const handleJoinButtonClick = () => {
    joinGame({ params: { code: inputCode }, body: user! }).then((response) => {
      if (response.status) {
        history.push(`/game/${response.id}`);
      } else {
        notification["error"]({
          message: "Unable to join the game",
          description: "Something is not right, try again.",
        });
      }
    });
  };

  return (
    <div className={styles.page_wrapper}>
      <div className={styles.content_wrapper}>
        <div className={styles.action_section}>
          <h1>
            Insert <b>GAME ID</b> to join your friends
          </h1>
          <div className={styles.join_input}>
            <Input
              label="GAME ID"
              placeholder="ex. ABCDE"
              size="huge"
              value={inputCode}
              onChange={(event) => setInputCode(event.target.value)}
            />
            <Button
              size="huge"
              icon
              labelPosition="right"
              onClick={handleJoinButtonClick}
            >
              Join
              <Icon name="game" />
            </Button>
          </div>
          <Divider horizontal>Or</Divider>
          <CreateNewGame />
        </div>
        <div className={styles.public_games}>
          <PublicGamesList />
        </div>
      </div>
    </div>
  );
};
export default GamesList;
