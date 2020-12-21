import React from "react";
import { Button, Divider, Icon, Input } from "semantic-ui-react";
import CreateNewGame from "./CreateNewGame";
import PublicGamesList from "./PublicGamesList";
import styles from "./scss/GamesList.module.scss";

const GamesList = () => {
  return (
    <div className={styles.page_wrapper}>
      <div className={styles.content_wrapper}>
        <div className={styles.action_section}>
          <h1>
            Insert <b>GAME ID</b> to join your friends
          </h1>
          <div className={styles.join_input}>
            <Input label="GAME ID" placeholder="ex. ABCDE" size="huge" />
            <Button size="huge" icon labelPosition="right">
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
