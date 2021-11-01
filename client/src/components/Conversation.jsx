import { useEffect, useState } from "react";
import axios from "axios";

import "./conversation.css";

const Conversation = ({ c, userId, token, currentChat }) => {
  const [friend, setFriend] = useState(null);

  useEffect(() => {
    let initial = true;

    const getUser = async () => {
      const friendId = await c.members?.find((m) => m !== userId);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const { data } = await axios.get("/api/users/" + friendId, config);
        initial ? setFriend(data) : setFriend(null);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();

    return () => (initial = false);
  }, [userId, c, token]);

  // console.log(friend);

  return (
    <>
      <div
        className={
          currentChat === c._id ? "conversation active" : "conversation"
        }
      >
        <img
          src={friend?.profilePicture || "/assets/person/noAvatar.png"}
          alt="friend"
          className="cv__img"
        />
        <span className="cv__name">{friend?.username}</span>
      </div>
    </>
  );
};

export default Conversation;
