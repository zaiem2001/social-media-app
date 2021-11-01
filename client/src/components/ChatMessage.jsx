import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "timeago.js";
import { deleteUserMessage } from "../actions/messageActions";

import { getUserById } from "../actions/userActions";
import "./chatMessage.css";
import Loader from "../components/Loader";

const ChatMessage = ({ m, our, user, friendId }) => {
  const userById = useSelector((state) => state.userById);
  const { user: foundUser } = userById;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!our) {
      dispatch(getUserById(friendId));
    }
  }, [our, friendId, dispatch]);

  const conversationDel = useSelector((state) => state.conversationDel);
  const { loading } = conversationDel;

  // console.log(friendId);

  const handleClick = (id) => {
    // console.log(id);
    dispatch(deleteUserMessage(id));
  };

  return (
    <div className={our ? "chatMessage our" : "chatMessage"}>
      <div className="chatMessage__top">
        <img
          src={
            our
              ? user?.profilePicture || "/assets/person/noAvatar.png"
              : foundUser?.profilePicture || "/assets/person/noAvatar.png"
          }
          alt="person"
          className="chatMessage__img"
        />
        <p className="chatMessage__text">{m.text}</p>
        {our &&
          (loading ? (
            <Loader size="20px" />
          ) : (
            <i
              className="fas fa-trash-alt trashbin"
              onClick={() => handleClick(m._id)}
            ></i>
          ))}
      </div>
      <div className="chatMessage__bottom">
        <span>{format(m.createdAt)}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
