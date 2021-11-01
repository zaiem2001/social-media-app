import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router";

import Feed from "../components/Feed";
import Loader from "../components/Loader";
import Message from "../components/Message";
import NavBar from "../components/NavBar";
import Rightbar from "../components/Rightbar";
import Sidebar from "../components/Sidebar";
import "./homepage.css";

const HomePage = ({ socket }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, loading, error } = userLogin;

  const history = useHistory();

  useEffect(() => {
    if (!userInfo) {
      history.replace("/login");
    }
  }, [history, userInfo]);

  return (
    <>
      <Helmet>
        <title>Z social - Home Page</title>
        <meta
          name="description"
          content="Meet your friends online with this app and chat with them."
        />

        <meta
          name="keywords"
          content="social media app, instagaram, instagaram clone, facebook, facebook clone, Chat with friends, Video call with friends, meet new friends online, make new friends faster and easier"
        />
      </Helmet>

      {loading && <Loader />}

      {error && <Message variant="danger">{error}</Message>}
      <div className="homepage">
        <NavBar socket={socket} />
        <div className="homepage__container">
          <Sidebar />
          <Feed socket={socket} />
          <Rightbar />
        </div>
      </div>
    </>
  );
};

export default HomePage;
