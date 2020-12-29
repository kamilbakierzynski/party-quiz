import React, { useEffect } from "react";
import { Image, Input } from "semantic-ui-react";
import { useStoreActions, useStoreState } from "../../store/hooks";
import MessageSender from "./MessageSender";
import styles from "./scss/Layout.module.scss";
import moment from "moment";

const Chat = () => {
  const chatMessages = useStoreState((state) => state.currentGame.chatMessages);
  const user = useStoreState((state) => state.auth.user);
  return (
    <div className={styles.chat_card}>
      <div className={styles.chat_messages}>
        {chatMessages.map((message) => {
          if (message.sender === undefined) {
            return <div className={styles.server_message}>{message.text}</div>;
          }
          const messageStyle =
            message.sender.id === user!.id
              ? styles.message_section
              : styles.message_section;
          return (
            <div className={messageStyle}>
              <div className={styles.username}>{message.sender.username}</div>
              <div className={styles.message}>
                <Image src={message.sender.avatarUrl} size="mini" circular />
                <div className={styles.text}>{message.text}</div>
                <div className={styles.time}>
                  {moment(message.creationDate).fromNow(true)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <MessageSender />
    </div>
  );
};
export default Chat;
