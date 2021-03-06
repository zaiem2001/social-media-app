import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

import { login } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import "./loginpage.css";
import { Helmet } from "react-helmet";

const LoginPage = ({ location, history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [customError, setCustomError] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search.split("=")[1] || "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo, history, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!password.trim() || !username.trim()) {
      setCustomError("Fill all the below fields.");
    } else {
      setCustomError(null);

      dispatch(login(username, password));
    }

    // console.log(email, password);
  };

  return (
    <div className="loginpage">
      <Helmet>
        <title>Z social - Login</title>
        <meta
          name="description"
          content="Meet your friends online with this app and chat with them."
        />
      </Helmet>

      <div className="login__wrapper">
        <div className="login__left">
          <h2 className="login__logo__text">Z_Book</h2>
          <span className="login__logo__desc">
            Connect with your friends, Chat worldwide.
          </span>
        </div>

        <div className="login__right">
          {loading && (
            <div className="loading__loader my-2">
              <Loader size="50px" />
            </div>
          )}

          {error ? (
            <Message variant="danger">
              {" "}
              {customError ? customError : error}{" "}
            </Message>
          ) : (
            customError && (
              <Message variant="danger">
                {" "}
                {customError ? customError : error}{" "}
              </Message>
            )
          )}

          <form className="login__input__box" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Enter Username."
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setCustomError(null);
              }}
            />

            <input
              type={showPassword ? "text" : "password"}
              onChange={(e) => {
                setPassword(e.target.value);
                setCustomError(null);
              }}
              placeholder="Enter Password"
              value={password}
              autoComplete="true"
            />

            <i
              className={
                showPassword
                  ? "fas fa-eye my-1 mb-3"
                  : "fas fa-eye-slash my-1 mb-3"
              }
              style={{ cursor: "pointer" }}
              onClick={(e) => setShowPassword((prev) => !prev)}
            ></i>

            <button type="submit" className="login__button" disabled={loading}>
              {loading ? (
                <CircularProgress color="secondary" size="20px" />
              ) : (
                "Login"
              )}
            </button>

            <span className="login__new">
              New here?{" "}
              <Link
                className="login__link"
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
              >
                Sign Up
              </Link>{" "}
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
