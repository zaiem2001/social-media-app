import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserConversations } from "../actions/messageActions";
import { getUserById } from "../actions/userActions";
import { io } from "socket.io-client";

import ChatMessage from "../components/ChatMessage";
import ChatOnline from "../components/ChatOnline";
import Conversation from "../components/Conversation";
import Loader from "../components/Loader";
import Message from "../components/Message";
import "./messenger.css";

const Messenger = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const conversation = useSelector((state) => state.conversation);
  const { conversations, loading, error } = conversation;

  const [newMessage, setNewMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const conversationDel = useSelector((state) => state.conversationDel);
  const { success: delSuccess, error: delError } = conversationDel;

  const userById = useSelector((state) => state.userById);
  const { user: foundUser, loading: foundLoading } = userById;

  const dispatch = useDispatch();

  const scrollRef = useRef();

  const [online, setOnline] = useState([]);

  const friendId = currentChat?.members.find((m) => m !== userInfo?._id);

  const socket = useRef();
  const [arrivalMsg, setArrivalMsg] = useState(null);

  useEffect(() => {
    socket.current = io("https://zsocial-socket.herokuapp.com/");

    socket.current.on("getMessage", (data) => {
      setArrivalMsg({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
        _id: new Date().getMilliseconds(),
      });
    });
  }, []);

  useEffect(() => {
    if (arrivalMsg) {
      if (currentChat?.members.includes(arrivalMsg.sender)) {
        setMessages((prev) => [...prev, arrivalMsg]);
      }
    }
  }, [arrivalMsg, currentChat]);

  useEffect(() => {
    socket?.current.emit("addUser", userInfo?._id);
    socket.current.on("getUsers", (users) => {
      // console.log(users);
      setOnline(
        userInfo?.followings?.filter((f) => users?.some((u) => u.userId === f))
      );
    });
  }, [userInfo]);

  // console.log(online);
  // console.log(socket);

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserConversations(userInfo?._id));
    }
  }, [userInfo, dispatch]);

  // console.log(conversations);

  useEffect(() => {
    const getMessages = async () => {
      if (currentChat) {
        const url = `/api/messages/${currentChat?._id}`;

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo && userInfo.token}`,
          },
        };

        try {
          const { data } = await axios.get(url, config);
          setMessages(data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getMessages();
    setSuccess(false);
  }, [currentChat, userInfo, success, delSuccess]);

  // console.log(currentChat);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserById(friendId));
    }
  }, [userInfo, friendId, dispatch]);

  // SEND THE MESSAGE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo && userInfo.token}`,
      },
    };

    const url = `/api/messages`;

    if (newMessage.trim()) {
      const messageObj = {
        conversationId: currentChat._id,
        sender: userInfo && userInfo,
        text: newMessage,
      };

      socket.current.emit("sendMessage", {
        senderId: userInfo?._id,
        receiverId: friendId,
        text: newMessage,
      });

      try {
        await axios.post(url, messageObj, config);
        setSuccess(true);
        setNewMessage("");

        // console.log(data);
      } catch (error) {
        console.log(error);
        setSuccess(false);
      }
    }
  };

  return (
    <div className="messenger">
      <div className="messenger__friends">
        <div className="messenger__friends__wrapper">
          <input
            type="text"
            placeholder="Search for friends..."
            className="messenger__input"
          />
          {error && <Message variant="info">{error}</Message>}
          {!loading &&
            conversations?.map((c) => (
              <div key={c._id} onClick={() => setCurrentChat(c)}>
                <Conversation
                  c={c}
                  userId={userInfo && userInfo?._id}
                  token={userInfo && userInfo?.token}
                  currentChat={currentChat?._id}
                />
              </div>
            ))}
        </div>
      </div>

      <div className="messenger__chatbox">
        {loading && <Loader size="20px" />}
        {currentChat ? (
          <>
            <div className="messenger__chatbox__wrapper">
              <div className="chatbox__top">
                <div className="profile__user__intro">
                  {foundLoading && <Loader size="25px" />}
                  {!foundLoading && (
                    <>
                      <img
                        src={
                          foundUser?.profilePicture ||
                          "/assets/person/noAvatar.png"
                        }
                        alt="xd"
                      />
                      <span>{foundUser?.username}</span>
                    </>
                  )}
                </div>
                {delError && <Message variant="danger">{delError}</Message>}
                {messages?.length === 0 ? (
                  <p className="writeNewMsg">Write a Message</p>
                ) : (
                  messages?.map((m) => (
                    <div key={m._id} ref={scrollRef}>
                      <ChatMessage
                        m={m}
                        our={m.sender === userInfo?._id}
                        user={userInfo && userInfo}
                        friendId={friendId}
                      />
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSubmit} className="chatbox__bottom">
                <textarea
                  className="chatbox__textarea"
                  placeholder="Write Something..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                ></textarea>

                <button type="submit" className="chatbox__submit__button">
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <span className="noconversation__text">
            Tap To Start A Conversation
          </span>
        )}
      </div>

      <div className="messenger__online">
        <div className="messenger__online__wrapper">
          <div className="online__list__container">
            <span className="messenger__online__list">Online</span>
          </div>
          {online && online.length === 0 ? (
            <div className="my-3">
              <Message variant="info">No friends are Online</Message>
            </div>
          ) : (
            <ChatOnline
              online={online}
              id={userInfo?._id}
              token={userInfo?.token}
            />
          )}
        </div>

        <Link to="/">
          <button className="goBackButton" type="button">
            Go Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Messenger;
