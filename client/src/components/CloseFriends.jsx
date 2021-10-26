import { useHistory } from "react-router";

import "./closefriends.css";

const CloseFriends = ({ user }) => {
  const history = useHistory();

  return (
    <li
      className="sidebar__friend"
      onClick={() => {
        history.push(`/profile/${user?._id}`);
      }}
    >
      <img
        src={user.profilePicture || "/assets/person/noAvatar.png"}
        alt="friend"
        className="sidebar__friend__img"
      />
      <span className="friend__name">{user.username}</span>
    </li>
  );
};

export default CloseFriends;
