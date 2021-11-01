import "./online.css";

const Online = ({ user }) => {
  return (
    <ul className="rightbar__online__friends">
      <li className="rightbar__friend">
        <div className="rightbar__img__container">
          <img
            src={user?.profilePicture || "/assets/person/noAvatar.png"}
            alt="user"
            className="rightbar__online__img"
          />
        </div>

        <span className="rightbar__online__username">
          {user?.username || "Deleted User"}
        </span>
      </li>
    </ul>
  );
};

export default Online;
