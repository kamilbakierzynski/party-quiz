import React, { useState } from "react";
import { notification } from "antd";
import { useHistory } from "react-router-dom";
import { Button, Divider, Icon, Input } from "semantic-ui-react";
import { useStoreActions, useStoreState } from "../../store/hooks";
import CreateNewGame from "./CreateNewGame";
import PublicGamesList from "./PublicGamesList";
import styles from "./scss/GamesList.module.scss";
import useWindowDimensions from "../../customHooks/useWindowDimensions";
import Menu from "../../components/ui/Menu";

const GamesList = () => {
  const [inputCode, setInputCode] = useState("");

  const joinGame = useStoreActions((actions) => actions.games.joinGame);
  const user = useStoreState((state) => state.auth.user);
  const history = useHistory();
  const { width } = useWindowDimensions();

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
      <Menu />
      <div className={styles.content_wrapper}>
        <div className={styles.action_section}>
          <h1>
            Insert <b>GAME ID</b> to join your friends
          </h1>
          <div className={styles.join_input}>
            <Input
              label={width > 900 ? "GAME ID" : undefined}
              placeholder="ex. ABCDE"
              size="huge"
              value={inputCode}
              onChange={(event) => codeInputHandler(event, setInputCode)}
              onKeyDown={(event: React.KeyboardEvent) => {
                if (event.key === "Enter") {
                  handleJoinButtonClick();
                }
              }}
            />
            <Button
              size="huge"
              icon
              labelPosition="right"
              onClick={handleJoinButtonClick}
              style={{ margin: 0 }}
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

const codeInputHandler = (
  event: React.ChangeEvent<HTMLInputElement>,
  setInputCode: (value: string) => void
) => {
  const { value } = event.target;
  if (value.match(/^[a-zA-Z]+$/)) {
    setInputCode(value.toUpperCase());
  } else if (value === "") {
    setInputCode(value);
  }
};
export default GamesList;
