import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.css";

const ChatOnline = ({ online, id, token }) => {
  // --> GET /api/users/friends?userId=""
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      const url = `/api/users/friends?userId=${id}`;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const { data } = await axios.get(url, config);

        setFriends(data);
      } catch (error) {
        console.log(error);
      }
    };

    getFriends();
  }, [id, token]);

  // console.log(friends);
  useEffect(() => {
    setOnlineFriends(friends?.filter((f) => online?.includes(f._id)));
  }, [friends, online]);

  // console.log({ onlineFriends, online, friends });

  return (
    <>
      {onlineFriends?.map((o) => (
        <div className="chatOnline" key={o._id}>
          <div className="chatOnline__img__container">
            <img
              src={o?.profilePicture || "/assets/person/noAvatar.png"}
              alt="user"
              className="chatOnline__img"
            />
            <div className="chatOnline__badge"></div>
          </div>

          <div className="chatOnline__username">{o?.username}</div>
        </div>
      ))}
    </>
  );
};

export default ChatOnline;
