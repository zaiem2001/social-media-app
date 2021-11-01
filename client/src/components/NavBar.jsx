import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { Search, Person, Notifications, Message } from "@material-ui/icons";

import "./navbar.css";
import axios from "axios";
import Example from "./Example";

const NavBar = ({ socket }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const searchRef = useRef();

  const [search, setSearch] = useState({
    user: "",
    error: null,
    loading: false,
  });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [open, setOpen] = useState(false);

  const history = useHistory();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket?.current?.on("getNotification", (data) => {
      console.log(data);
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  // console.log(notifications);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (searchRef.current.value.trim() && userInfo) {
      setSearch({ loading: true, user: "", error: null });
      const url = `/api/users/user?username=${searchRef.current.value}`;

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      try {
        const { data } = await axios.get(url, config);

        setSearch({ loading: false, error: null, user: data });
        setShow(false);
      } catch (error) {
        setSearch({
          loading: false,
          error: error.response.data.message || error.message,
          user: "",
        });

        setShow(true);
      }
    }
  };

  useEffect(() => {
    if (userInfo && !search.error && search.user) {
      history.push(`/profile/${search.user}`);
      setSearch({});
    }
  }, [userInfo, search, history]);

  const handleRead = () => {
    setOpen(false);
    setNotifications([]);
  };

  return (
    <div className="navbar">
      {search.error && (
        <Example
          error={search.error}
          show={show}
          setShow={setShow}
          handleClose={handleClose}
          handleShow={handleShow}
          value={searchRef.current.value}
        />
      )}

      <div className="nav__left">
        <div className="logo">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo__text">zBook</span>
          </Link>
        </div>
      </div>
      <div className="nav__center">
        <form className="nav__input__container" onSubmit={handleSubmit}>
          <Search className="input__icon" />
          <input
            type="text"
            placeholder="Search for friends..."
            ref={searchRef}
          />
        </form>
      </div>
      <div className="nav__right">
        <div className="right__links">
          <span className="nav__home__link">Homepage</span>
          <Link to="/update" style={{ textDecoration: "none" }}>
            {" "}
            <span>Update Profile</span>
          </Link>
        </div>

        <div className="nav__notifications">
          <div className="nav__notification Person">
            <Person />
            <span className="nav__badge">1</span>
          </div>

          <Link to="/messenger">
            <div className="nav__notification">
              <Message />
              <span className="nav__badge">2</span>
            </div>
          </Link>

          <div
            className="nav__notification"
            onClick={() => setOpen((prev) => !prev)}
          >
            <Notifications />
            {notifications?.length !== 0 && (
              <span className="nav__badge">{notifications?.length}</span>
            )}
          </div>

          {notifications.length !== 0 && (
            <div
              className={
                open ? "notification__modal active" : "notification__modal"
              }
            >
              {notifications?.map((n) => (
                <span>{n.senderName} liked your post.</span>
              ))}

              <button className="markAsRead" onClick={handleRead} type="button">
                Mark as Read
              </button>
            </div>
          )}
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
