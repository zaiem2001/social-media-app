import {
  RssFeed,
  School,
  Event,
  WorkOutline,
  HelpOutline,
  Bookmark,
  Group,
  PlayCircleFilledOutlined,
  Chat,
} from "@material-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CloseFriends from "./CloseFriends";

import "./sidebar.css";

const Sidebar = () => {
  const [users, setUsers] = useState([]);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const getUsers = async () => {
        try {
          const { data } = await axios.get("/api/users/sidebar", config);

          setUsers(data);
        } catch (error) {
          console.log(error);
        }
      };

      getUsers();
    }
  }, [userInfo]);

  // console.log(users);

  return (
    <div className="sidebar">
      <div className="sidebar__wrapper">
        <ul className="sidebar__list">
          <li className="sidebar__list__item">
            <RssFeed className="sidebar__icon" />
            <span className="sidebar__namw">Feed</span>
          </li>

          <li className="sidebar__list__item">
            <Chat className="sidebar__icon" />
            <span className="sidebar__namw">Chat</span>
          </li>

          <li className="sidebar__list__item">
            <PlayCircleFilledOutlined className="sidebar__icon" />
            <span className="sidebar__namw">Videos</span>
          </li>

          <li className="sidebar__list__item">
            <Group className="sidebar__icon" />
            <span className="sidebar__namw">Group</span>
          </li>

          <li className="sidebar__list__item">
            <Bookmark className="sidebar__icon" />
            <span className="sidebar__namw">Bookmarks</span>
          </li>

          <li className="sidebar__list__item">
            <HelpOutline className="sidebar__icon" />
            <span className="sidebar__namw">Questions</span>
          </li>

          <li className="sidebar__list__item">
            <WorkOutline className="sidebar__icon" />
            <span className="sidebar__namw">Jobs</span>
          </li>

          <li className="sidebar__list__item">
            <Event className="sidebar__icon" />
            <span className="sidebar__namw">Events</span>
          </li>

          <li className="sidebar__list__item">
            <School className="sidebar__icon" />
            <span className="sidebar__namw">Courses</span>
          </li>
        </ul>

        <button className="sidebar__button">Show More</button>
        <hr className="sidebar__hr" />

        <ul className="sidebar__friendlist">
          {users.map((user) => (
            <CloseFriends key={user._id} user={user} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
