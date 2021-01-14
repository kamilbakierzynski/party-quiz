import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Menu as SemanticMenu } from "semantic-ui-react";
import styles from "./scss/Menu.module.scss";

export enum Pages {
  games = "games",
  messages = "messages",
}

const Menu = () => {
  const history = useHistory();
  const location = useLocation();
  const currentPage = location.pathname.split("/")[1];
  const redirectTo = (page: Pages) => () => history.replace(`/${page}`);
  return (
    <div className={styles.header}>
      <SemanticMenu secondary>
        {Object.values(Pages).map((page) => (
          <SemanticMenu.Item
            name={page}
            active={currentPage === page}
            onClick={redirectTo(page)}
          />
        ))}
      </SemanticMenu>
    </div>
  );
};
export default Menu;
