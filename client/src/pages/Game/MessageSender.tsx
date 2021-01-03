import React, { useState } from "react";
import { Input } from "semantic-ui-react";
import { useStoreActions, useStoreState } from "../../store/hooks";
import { Message } from "../../store/stores/CurrentGameStore";
import styles from "./scss/Layout.module.scss";

const MessageSender = () => {
  const storeMessageSender = useStoreActions(
    (actions) => actions.currentGame.sendMessage
  );
  const user = useStoreState((state) => state.auth.user);
  const [messageText, setMessageText] = useState("");

  const handleSendClick = () => {
    const message: Message = {
      sender: user!,
      text: messageText,
      creationDate: Date.now(),
    };
    setMessageText("");
    storeMessageSender(message);
  };

  return (
    <div className={styles.message_sender}>
      <Input
        fluid
        size="big"
        value={messageText}
        onChange={(event) => setMessageText(event.target.value)}
        onKeyDown={(event: React.KeyboardEvent) => {
          if (event.key === "Enter") {
            handleSendClick();
          }
        }}
        action={{
          color: "blue",
          labelPosition: "right",
          icon: "send",
          content: "Send",
          onClick: handleSendClick,
        }}
      />
    </div>
  );
};
export default MessageSender;
