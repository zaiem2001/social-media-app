import { useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { Redirect } from "react-router";
import { io } from "socket.io-client";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import UpdateProfile from "./pages/UpdateProfile";
import Messenger from "./pages/Messenger";
import { useEffect, useRef } from "react";

function App() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
  }, []);

  useEffect(() => {
    socket?.current.emit("addUser", userInfo?._id);
  }, [userInfo]);

  return (
    <Switch>
      <>
        <Route path="/" exact>
          <HomePage socket={socket} />
        </Route>

        {userInfo ? (
          <Route
            path="/update"
            component={() => (
              <UpdateProfile
                user={userInfo && userInfo?.username}
                id={userInfo && userInfo?._id}
              />
            )}
          />
        ) : (
          <Redirect to="/login" />
        )}

        {userInfo ? (
          <Route path="/messenger">
            <Messenger />
          </Route>
        ) : (
          <Redirect to="/login" />
        )}

        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />

        <Route path="/profile/:id?">
          <ProfilePage socket={socket} />
        </Route>
      </>
    </Switch>
  );
}

export default App;
