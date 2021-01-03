import React, { useState } from "react";
import {
  Input,
  Icon,
  Button,
  Image,
  Popup,
  Dimmer,
  Loader,
  Segment,
} from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";
import styles from "./scss/SignInPage.module.scss";
import { useStoreActions } from "../store/hooks";
import { useHistory } from "react-router-dom";
import { notification } from "antd";

const SignInPage = (): JSX.Element => {
  const [avatarUrl, setAvatarUrl] = useState(avatarUrlGenerator(uuidv4()));
  const [imageLoading, setImageLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [username, setUsername] = useState<string>();
  const registerNewUser = useStoreActions(
    (actions) => actions.auth.registerNewUser
  );

  const history = useHistory();

  const generateNewAvatar = () => {
    setImageLoading(true);
    setAvatarUrl(avatarUrlGenerator(uuidv4()));
  };

  const registerUser = async () => {
    setRegisterLoading(true);
    const response = await registerNewUser({ username: username!, avatarUrl });
    if (response) {
      history.push("/games");
    } else {
      setRegisterLoading(false);
      notification["error"]({
        message: "Error while registering",
        description: "Something is not right, try again.",
      });
    }
  };

  return (
    <div className={styles.page_wrapper}>
      <Dimmer active={registerLoading}>
        <Loader indeterminate>
          Such a great username! Registering you in a game!
        </Loader>
      </Dimmer>
      <div className={styles.sign_in_card}>
        <Segment circular>
          <Dimmer active={imageLoading}>
            <Loader indeterminate>You will look great</Loader>
          </Dimmer>
          <Popup
            trigger={
              <Image
                src={avatarUrl}
                style={{ width: 200, height: 200 }}
                circular
                onClick={generateNewAvatar}
                onLoad={() => setImageLoading(false)}
              />
            }
            content="Click to generate new"
            position="right center"
          />
        </Segment>
        <h4>Please type your username in order to play</h4>
        <div className={styles.form_wrapper}>
          <div className={styles.username_input}>
            <Input
              size="huge"
              placeholder="Username"
              label={{ icon: "asterisk" }}
              labelPosition="left corner"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              onKeyDown={(event: React.KeyboardEvent) => {
                if (event.key === "Enter") {
                  registerUser();
                }
              }}
            />
            <Button
              animated
              disabled={username === undefined}
              onClick={registerUser}
              style={{ margin: 0 }}
            >
              <Button.Content visible>Play</Button.Content>
              <Button.Content hidden>
                <Icon name="play" />
              </Button.Content>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignInPage;

const avatarUrlGenerator = (variable: string) =>
  `https://avatars.dicebear.com/api/avataaars/${variable}.svg?style=circle`;
