import React, { useState } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { useStoreState } from "store/hooks";
import Messages from "./Messages";

const MessagesListModal = () => {
  const [show, setShow] = useState(false);
  const isSignedIn = useStoreState((state) => state.auth.signedIn);

  return (
    <>
      {isSignedIn && (
        <Button
          icon
          onClick={() => setShow(true)}
          style={{ position: "fixed", bottom: 20, left: 20 }}
        >
          <Icon name="facebook messenger" />
        </Button>
      )}
      <Modal
        dimmer="blurring"
        closeIcon
        open={show}
        onClose={() => setShow(false)}
      >
        <Header content="Conversations" />
        <Modal.Content>
          <Messages disableMenu />
        </Modal.Content>
      </Modal>
    </>
  );
};
export default MessagesListModal;
