import Avatar from "antd/lib/avatar/avatar";
import React, { useEffect, useState } from "react";
import Menu from "../../components/ui/Menu";
import { useStoreActions, useStoreState } from "../../store/hooks";
import { Conversation } from "../../store/stores/MessagesStore";
import styles from "./scss/Messages.module.scss";
import { Typography } from "antd";

const { Title } = Typography;

interface MessagesProps {
  disableMenu?: boolean;
}

const Messages = ({ disableMenu = false }: MessagesProps) => {
  const getConversations = useStoreActions(
    (actions) => actions.messages.getConversations
  );
  const refreshVar = useStoreState((state) => state.messages.refreshVar);
  const [conversations, setConversations] = useState<Array<Conversation>>([]);

  const displayConversation = useStoreActions(
    (actions) => actions.messages.displayConversation
  );

  useEffect(() => {
    getConversations().then(setConversations);
  }, [refreshVar]);

  return (
    <div className={styles.page_wrapper}>
      {disableMenu || <Menu />}
      <div className={styles.conversations}>
        {conversations.map((conversation) => {
          return (
            <div
              className={styles.conversation}
              onClick={() =>
                displayConversation({ user: conversation.partner })
              }
            >
              <Avatar
                src={conversation.partner.avatarUrl}
                size={80}
                style={{ marginLeft: 10, marginRight: 10 }}
              />
              <Title level={5}>{conversation.partner.username}</Title>
              {!!conversation.lastMessage && (
                <div className={styles.message}>
                  {conversation.lastMessage?.text.slice(0, 12) + "..."}
                </div>
              )}
              <div className={styles.overlay_icon}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Messages;
