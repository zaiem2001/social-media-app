import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { format } from "timeago.js";

import { getUserById, getUserFriends, logout } from "../actions/userActions";
import Online from "./Online";
import Message from "../components/Message";
import Loader from "../components/Loader";

import "./rightbar.css";

const HomeRightBar = () => {
  const userFriends = useSelector((state) => state.userFriends);
  const { friends } = userFriends;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  // console.log(friends);

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserFriends(userInfo._id));
    }
  }, [dispatch, userInfo]);

  return (
    <>
      <div className="rightbar__birthday__container">
        <img
          src="assets/gift.png"
          alt="gift"
          className="rightbar__birthday__img"
        />

        <span className="rightbar__birthday__text">
          {" "}
          Explore All <b> Features</b> In This <b>App</b>.{" "}
        </span>
      </div>

      <div className="rightbar__ad">
        <img src="assets/ad.png" alt="ad" className="rightbar__ad__img" />
      </div>

      {friends && friends.length === 0 ? (
        <Message variant="info">No Friends</Message>
      ) : (
        friends && friends.map((user) => <Online key={user?._id} user={user} />)
      )}
    </>
  );
};

const ProfileRightBar = ({ ourProfile }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const history = useHistory();

  const params = useParams();
  const id = params.id;

  const dispatch = useDispatch();

  const userById = useSelector((state) => state.userById);
  const { user } = userById;

  const userFriends = useSelector((state) => state.userFriends);
  const { friends, loading, error } = userFriends;

  useEffect(() => {
    if (!ourProfile) {
      dispatch(getUserById(id));
    }
  }, [ourProfile, id, dispatch]);

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (ourProfile) {
        dispatch(getUserFriends());
      } else {
        dispatch(getUserFriends(id));
      }
    }
  }, [dispatch, userInfo, history, id, ourProfile]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClick = (id) => {
    history.push(`/profile/${id}`);
  };

  return (
    <>
      <div className="profile__rightbar__logout">
        <h5 className="profile__details">
          {ourProfile ? "Your" : !loading && user?.username + "'s"} Info
        </h5>

        <button type="button" onClick={handleLogout} className="logout__button">
          Logout
        </button>
      </div>
      <hr className="profile__hr" />

      <div className="user__info">
        <div className="user__info__item">
          <div className="user__info__key">State:</div>
          <div className="user__info__value">
            {ourProfile
              ? userInfo?.state || "Nothing Added."
              : user?.state || "Nothing Added."}
          </div>
        </div>

        <div className="user__info__item">
          <div className="user__info__key">City:</div>
          <div className="user__info__value">
            {ourProfile
              ? userInfo?.city || "Nothing Added."
              : user?.city || "Nothing Added."}
          </div>
        </div>

        <div className="user__info__item">
          <div className="user__info__key">Relationship:</div>
          <div className="user__info__value">
            {ourProfile
              ? userInfo?.relationship === 1
                ? "Single"
                : userInfo?.relationship === 2
                ? "Couple"
                : userInfo?.relationship === 3
                ? "Other"
                : "Not Mentioned."
              : user?.relationship === 1
              ? "Single"
              : user?.relationship === 2
              ? "Couple"
              : user?.relationship === 3
              ? "Other"
              : "Not Mentioned."}
          </div>
        </div>

        <div className="user__info__item">
          <div className="user__info__key">
            {" "}
            {ourProfile ? "Account Created :" : "Joined :"}{" "}
          </div>
          <div className="user__info__value">
            {ourProfile
              ? format(userInfo?.createdAt) || "Null"
              : format(user?.createdAt) || "Null"}
          </div>
        </div>

        {ourProfile && (
          <div className="user__info__item">
            <div className="user__info__key">Account Last Updated :</div>
            <div className="user__info__value">
              {ourProfile
                ? format(userInfo?.updatedAt) || "Null"
                : format(user?.updatedAt) || "Null"}
            </div>
          </div>
        )}
      </div>

      <h5 className="profile__user__friends">
        {ourProfile ? "Your Friends" : `${user?.username} Friends`}
      </h5>

      <hr className="profile__hr" />

      {error && <Message variant="danger">{error}</Message>}
      {loading ? (
        <Loader />
      ) : (
        friends?.length !== 0 && (
          <div className="user__friends">
            {friends?.map((u) => (
              <div className="user__friend" key={u._id}>
                <img
                  src={u?.profilePicture || "/assets/person/noAvatar.png"}
                  alt="profile"
                  className="user__profile__img"
                  onClick={() => handleClick(u._id)}
                />
                <span className="user__friend__username">{u.username}</span>
              </div>
            ))}
          </div>
        )
      )}

      {!loading && friends?.length === 0 && (
        <Message variant="info">No Friends.</Message>
      )}
    </>
  );
};

const Rightbar = ({ profile, ourProfile }) => {
  return (
    <div className="rightbar">
      <div className="rightbar__wrapper">
        {profile ? (
          <ProfileRightBar ourProfile={ourProfile} />
        ) : (
          <HomeRightBar ourProfile={ourProfile} />
        )}
      </div>
    </div>
  );
};

export default Rightbar;
