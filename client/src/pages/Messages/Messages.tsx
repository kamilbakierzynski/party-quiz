import React, { useEffect } from "react";
import Menu from "../../components/ui/Menu";
import { useStoreActions } from "../../store/hooks";
import styles from "./scss/Messages.module.scss";

const Messages = () => {
  const getConversations = useStoreActions(
    (actions) => actions.messages.getConversations
  );

  useEffect(() => {
    getConversations().then(console.log);
  }, []);
  return (
    <div className={styles.page_wrapper}>
      <Menu />
      <div className={styles.messages_list}></div>
      <div className={styles.chat}></div>
    </div>
  );
};
export default Messages;
