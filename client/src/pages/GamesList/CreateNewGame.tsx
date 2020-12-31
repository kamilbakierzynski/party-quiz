import { notification, Rate } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Checkbox, Input, Modal } from "semantic-ui-react";
import { useStoreActions, useStoreState } from "../../store/hooks";
import styles from "./scss/CreateNewGame.module.scss";

const CreateNewGame = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const user = useStoreState((state) => state.auth.user);
  const [gameName, setGameName] = useState(`${user?.username}'s game`);
  const [publicGame, setPublicGame] = useState(false);
  const [playersCount, setPlayersCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const createNewGame = useStoreActions((actions) => actions.games.createGame);
  const history = useHistory();
  const getGames = useStoreActions((actions) => actions.games.getGames);

  const handleCreateClick = () => {
    setLoading(true);
    createNewGame({
      gameTitle: gameName,
      public: publicGame,
      maxNumberOfPlayers: players[playersCount],
      user: user!,
    }).then((response) => {
      setLoading(false);
      setModalVisible(false);
      if (response !== "") {
        history.push(`/game/${response}`);
        getGames();
      } else {
        notification["error"]({
          message: "Error while creating new game",
          description: "Something is not right, try again.",
        });
      }
    });
  };

  return (
    <Modal
      onClose={() => setModalVisible(false)}
      onOpen={() => setModalVisible(true)}
      open={modalVisible}
      size="tiny"
      trigger={<Button size="massive">Create new game</Button>}
    >
      <Modal.Header>Create new game</Modal.Header>
      <Modal.Content image>
        <div className={styles.form}>
          <div className={styles.form_item}>
            <h4>Game name:</h4>
            <Input
              value={gameName}
              onChange={(event) => setGameName(event.target.value)}
            />
          </div>
          <div className={styles.form_item}>
            <h4>Public game:</h4>
            <Checkbox
              toggle
              checked={publicGame}
              onClick={(event, data) =>
                setPublicGame(data.checked ? data.checked : false)
              }
            />
          </div>
          <div className={styles.form_item}>
            <h4>Maximum number of players:</h4>
            <Rate
              defaultValue={players[playersCount]}
              count={5}
              character={(value: Record<string, number>) =>
                players[value.index]
              }
              onChange={(value) => setPlayersCount(value - 1)}
            />
          </div>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setModalVisible(false)}>
          Nope, not now
        </Button>
        <Button
          content="Yep, create the game"
          labelPosition="right"
          icon="checkmark"
          onClick={handleCreateClick}
          positive
          loading={loading}
        />
      </Modal.Actions>
    </Modal>
  );
};

const players = [2, 3, 4, 5, 6];
export default CreateNewGame;
