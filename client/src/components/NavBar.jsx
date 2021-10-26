import React from "react";
import { Link } from "react-router-dom";
import { Search, Person, Notifications, Message } from "@material-ui/icons";

import "./navbar.css";
import { useSelector } from "react-redux";

const NavBar = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <div className="navbar">
      <div className="nav__left">
        <div className="logo">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo__text">zBook</span>
          </Link>
        </div>
      </div>
      <div className="nav__center">
        <div className="nav__input__container">
          <Search className="input__icon" />
          <input type="text" placeholder="Search for friends..." />
        </div>
      </div>
      <div className="nav__right">
        <div className="right__links">
          <span>Homepage</span>
          <Link to="/update" style={{ textDecoration: "none" }}>
            {" "}
            <span>Update Profile</span>
          </Link>
        </div>

        <div className="nav__notifications">
          <div className="nav__notification">
            <Person />
            <span className="nav__badge">1</span>
          </div>

          <div className="nav__notification">
            <Message />
            <span className="nav__badge">2</span>
          </div>

          <div className="nav__notification">
            <Notifications />
            <span className="nav__badge">1</span>
          </div>
        </div>

        <Link to={`/profile/${userInfo?._id}`}>
          <img
            src={
              (userInfo && userInfo.profilePicture) ||
              "/assets/person/noAvatar.png"
            }
            alt="person"
            className="nav__img"
          />
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
