import React from "react";
import Chat from "./Chat";
import MQTTGameConnections from "./Main/MQTTGameConnections";
import styles from "./scss/Layout.module.scss";
import "./scss/Layout.scss";

const Layout = () => {
  return (
    <div className={styles.page_wrapper}>
      <div className={styles.main_game_window}>
        <MQTTGameConnections />
      </div>
      <div className={styles.game_chat}>
        <Chat />
      </div>
    </div>
  );
};
export default Layout;
