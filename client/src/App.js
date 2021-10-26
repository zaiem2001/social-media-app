import { useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { Redirect } from "react-router";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import UpdateProfile from "./pages/UpdateProfile";

function App() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <Switch>
      <>
        <Route path="/" exact>
          <HomePage />
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

        <Route path="/login" component={LoginPage} />

        <Route path="/register" component={RegisterPage} />

        <Route path="/profile/:id?">
          <ProfilePage />
        </Route>
      </>
    </Switch>
  );
}

export default App;
