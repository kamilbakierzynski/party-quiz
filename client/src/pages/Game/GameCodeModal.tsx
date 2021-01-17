import React, { useState } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { useStoreState } from "store/hooks";

const JoinCodeModal = () => {
  const [show, setShow] = useState(false);
  const joinCode = useStoreState((state) => state.currentGame.game?.joinCode);

  return (
    <>
      {
        <Button
          icon
          onClick={() => setShow(true)}
          style={{ position: "absolute", top: 20, left: 20 }}
        >
          <Icon name="info" />
        </Button>
      }
      <Modal
        dimmer="blurring"
        closeIcon
        open={show}
        onClose={() => setShow(false)}
      >
        <Header content="Join code" />
        <Modal.Content>
          <h1>{joinCode}</h1>
        </Modal.Content>
      </Modal>
    </>
  );
};
export default JoinCodeModal;
