import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import Feed from "../components/Feed";
import Loader from "../components/Loader";
import Message from "../components/Message";
import NavBar from "../components/NavBar";
import Rightbar from "../components/Rightbar";
import Sidebar from "../components/Sidebar";
import "./homepage.css";

const HomePage = () => {
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
      {loading && <Loader />}

      {error && <Message variant="danger">{error}</Message>}
      <div className="homepage">
        <NavBar />
        <div className="homepage__container">
          <Sidebar />
          <Feed />
          <Rightbar />
        </div>
      </div>
    </>
  );
};

export default HomePage;
