import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { useStoreActions, useStoreState } from "../../store/hooks";
import { Message, MessagePOST } from "../../store/stores/MessagesStore";
import { Input } from "semantic-ui-react";
import Avatar from "antd/lib/avatar/avatar";
import styles from "./scss/ChatModal.module.scss";
import "./scss/ChatModal.scss";
import moment from "moment";
import { message } from "antd";

const ChatModal = () => {
  const [messagesList, setMessagesList] = useState<Array<Message>>([]);
  const [messageInput, setMessageInput] = useState("");
  const [hasInviteBeenSent, setHasInviteBeenSent] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const showModal = useStoreState(
    (state) => state.messages.showConversationModal
  );
  const closeModal = useStoreActions(
    (actions) => actions.messages.closeConversation
  );
  const partner = useStoreState((state) => state.messages.conversationWith);
  const refreshVar = useStoreState((state) => state.messages.refreshVar);
  const getMessages = useStoreActions(
    (actions) => actions.messages.getMessages
  );
  const sendMessage = useStoreActions(
    (actions) => actions.messages.sendMessage
  );
  const user = useStoreState((state) => state.auth.user);

  const currentGame = useStoreState((state) => state.currentGame.game);
  const isGameStarted = !!currentGame?.started;

  const sendInvite = useStoreActions((state) => state.messages.sendInvite);

  const downloadMessages = useCallback(() => {
    if (!partner) return;
    getMessages({ partnerId: partner.id }).then((messages) =>
      setMessagesList(messages)
    );
  }, [partner, getMessages]);

  const handleSendMessage = () => {
    if (!user || !partner || !messageInput) return;
    const newMessage: MessagePOST = {
      sender: user,
      receiver: partner,
      text: messageInput,
    };
    sendMessage(newMessage);
    setMessageInput("");
  };

  useEffect(() => {
    downloadMessages();
    scrollRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
    window.scrollBy(0, -100);
  }, [partner, refreshVar]);

  useEffect(() => {
    setHasInviteBeenSent(false);
  }, [partner, refreshVar]);

  return (
    <Modal
      dimmer="blurring"
      open={showModal}
      onClose={() => closeModal()}
      onOpen={downloadMessages}
      className={styles.modal}
    >
      <Header
        style={{ display: "flex", alignItems: "center", width: "100%" }}
        icon={
          <Avatar
            src={partner?.avatarUrl}
            size={40}
            style={{ marginRight: 10 }}
          />
        }
        content={
          <div
            className={styles.header_row}
            style={{ justifyContent: "space-between" }}
          >
            {partner?.username}
            <div
              className={styles.header_buttons}
              style={{ display: "flex", flexDirection: "row" }}
            >
              {currentGame && !isGameStarted && (
                <Button
                  color="blue"
                  disabled={hasInviteBeenSent}
                  onClick={() => {
                    sendInvite({
                      sender: user!,
                      receiver: partner!,
                      joinCode: currentGame.joinCode,
                    });
                    setHasInviteBeenSent(true);
                  }}
                  style={{ display: "flex", margin: 0, marginRight: 10 }}
                >
                  <Icon name="mail forward" /> Invite
                </Button>
              )}
              <Button
                icon
                onClick={() => closeModal()}
                style={{ minHeight: 32, minWidth: 32 }}
              >
                <Icon name="close" />
              </Button>
            </div>
          </div>
        }
      />
      <Modal.Content scrolling className={styles.content_messages}>
        {messagesList.map((message) => {
          const isSender = message.sender.id === user?.id;
          return (
            <div
              className={
                isSender ? styles.wrapper__sender : styles.wrapper__receiver
              }
            >
              <div className={styles.avatar}>
                <Avatar
                  src={message.sender.avatarUrl}
                  style={{ marginRight: 10 }}
                />
              </div>
              <div className={styles.message}>{message.text}</div>
              <div className={styles.time}>
                {moment(message.sendTime).fromNow()}
              </div>
            </div>
          );
        })}
        <div
          ref={scrollRef}
          style={{
            position: "absolute",
            bottom: -10,
            height: 2,
            width: "100%",
          }}
        />
      </Modal.Content>
      <Modal.Actions
        style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
      >
        <Input
          style={{ width: "100%" }}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(event: React.KeyboardEvent) => {
            if (event.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button
          color="blue"
          onClick={handleSendMessage}
          style={{ display: "flex", margin: 0, marginLeft: 10 }}
        >
          <Icon name="send" /> Send
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ChatModal;
