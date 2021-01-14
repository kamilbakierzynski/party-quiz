import React from "react";
import Menu from "../../components/ui/Menu";
import styles from "./scss/Messages.module.scss";

const Messages = () => {
  return (
    <div className={styles.page_wrapper}>
      <Menu />
      <div className={styles.messages_list}></div>
      <div className={styles.chat}></div>
    </div>
  );
};
export default Messages;
