import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { register } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import "./registerpage.css";

const RegisterPage = ({ history, location }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [customError, setCustomError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const dispatch = useDispatch();

  const redirect = location.search.split("=")[1] || "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo, history, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!password.trim() || !email.trim() || !username.trim()) {
      setCustomError("All Fields Are Required");
    } else {
      if (password !== confirmPassword) {
        setCustomError("Passwords do not match.");
      } else {
        setCustomError(null);

        dispatch(register(username, email, password));
      }
    }
  };

  return (
    <div className="loginpage">
      <Helmet>
        <title>Z social - Register</title>
        <meta
          name="description"
          content="Meet your friends online with this app and chat with them."
        />
      </Helmet>

      <div className="login__wrapper">
        <div className="login__left Register">
          <h2 className="login__logo__text">Z_Book</h2>
          <span className="login__logo__desc">
            Connect with your friends, Chat worldwide.
          </span>
        </div>

        <div className="login__right">
          {/* message and loader component */}
          {loading && (
            <div className="loading__loader my-2">
              <Loader size="50px" />
            </div>
          )}

          {error ? (
            <Message variant="danger">
              {customError ? customError : error}
            </Message>
          ) : (
            customError && <Message variant="danger">{customError}</Message>
          )}

          <form className="register__input__box" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="8"
              autoComplete="true"
            />

            <i
              className={
                showPassword ? "fas fa-eye my-1" : "fas fa-eye-slash my-1"
              }
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword((prev) => !prev)}
            ></i>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength="8"
              autoComplete="true"
            />

            <button type="submit" className="login__button">
              Sign Up
            </button>

            <span className="login__new">
              Already have an account?
              <Link className="login__link" to={`/login?redirect=${redirect}`}>
                Login
              </Link>{" "}
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
