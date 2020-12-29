import React from "react";
import Chat from "./Chat";
import MQTTGameConnections from "./Main/MQTTGameConnections";
import styles from "./scss/Layout.module.scss";

const Layout = () => {
  return (
    <div className={styles.page_wrapper}>
      <div className={styles.main_game_window}>
        <MQTTGameConnections />
      </div>
      <div className={styles.game_chat}>
        <div className={styles.score_board}></div>
        <Chat />
      </div>
    </div>
  );
};
export default Layout;
