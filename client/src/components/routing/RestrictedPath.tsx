import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useStoreState } from "../../store/hooks";

interface AuthRouteProps {
  children: React.ReactNode;
  path?: string;
  exact?: boolean;
}

const RestrictedPath = ({
  children,
  exact,
  path,
}: AuthRouteProps): JSX.Element => {
  const signedIn = useStoreState((state) => state.auth.signedIn);
  return (
    <Route
      exact={exact}
      path={path}
      render={() => (signedIn ? children : <Redirect to="/signin" />)}
    ></Route>
  );
};
export default RestrictedPath;
