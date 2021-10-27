import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  followUser,
  getUserById,
  getUserFollowers,
  getUserPosts,
} from "../actions/userActions";
import MyVerticallyCenteredModal from "../components/Modal";
import { USER_CONSTANTS } from "../reducers/userReducers";
import Feed from "../components/Feed";
import NavBar from "../components/NavBar";
import Rightbar from "../components/Rightbar";
import Sidebar from "../components/Sidebar";
import "./profilepage.css";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProfilePage = () => {
  const userLogin = useSelector((state) => state.userLogin);
  let { userInfo } = userLogin;

  const [modalShow, setModalShow] = useState(false);

  const [loggedUser, setLoggedUser] = useState(null);

  const userById = useSelector((state) => state.userById);
  const { user } = userById;

  const dispatch = useDispatch();

  const params = useParams();
  const userId = params.id;

  let ourProfile = userInfo && userInfo._id === userId;

  // if (!userId) {
  //   ourProfile = true;
  // }

  const userUpdate = useSelector((state) => state.userUpdate);
  const { success } = userUpdate;

  useEffect(() => {
    if (success) {
      dispatch({ type: USER_CONSTANTS.UPDATE_USER_RESET });

      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, [success, dispatch]);
  const history = useHistory();

  const userFollow = useSelector((state) => state.userFollow);
  const {
    error: followError,
    loading: followLoading,
    success: followSuccess,
  } = userFollow;

  const userFollowers = useSelector((state) => state.userFollowers);
  const {
    error: followersError,
    followers,
    loading: followersLoading,
  } = userFollowers;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }
  }, [history, userInfo]);

  useEffect(() => {
    if (!ourProfile) {
      dispatch(getUserById(userId));
      dispatch(getUserPosts(userId));
    } else {
      dispatch(getUserPosts());
    }
  }, [dispatch, userId, ourProfile]);

  useEffect(() => {
    if (userInfo) {
      const getUserProfile = async () => {
        try {
          const url = "/api/users/profile";
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };

          const { data } = await axios.get(url, config);

          setLoggedUser(data);
        } catch (error) {
          console.log(error);
        }
      };

      getUserProfile();
    }
  }, [dispatch, userInfo, followSuccess]);

  useEffect(() => {
    if (followSuccess) {
      dispatch(getUserById(userId));
    }
  }, [followSuccess, dispatch, userId]);

  // console.log({ loggedUser, user });

  const userPosts = useSelector((state) => state.userPosts);
  const { posts } = userPosts;

  const followHandler = (type) => {
    dispatch(followUser(type, userId));
  };

  const followersHandler = () => {
    if (ourProfile) {
      dispatch(getUserFollowers(userInfo._id));
    } else {
      dispatch(getUserFollowers(userId));
    }

    if (!followersLoading && !followersError) {
      setModalShow(true);
    }
  };

  // const userDeleteHandler = async () => {
  //   if (window.confirm("Are you sure?")) {
  //     const url = "/api/users/profile";

  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${userInfo.token}`,
  //       },
  //     };

  //     try {
  //       const { data } = await axios.delete(url, config);

  //       if (data) {
  //         history.replace("/login");
  //         dispatch(logout());
  //       }
  //     } catch (error) {
  //       console.log({ error, resp: error.response.data.Message });
  //     }
  //   }
  // };


  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
        followers={followers}
        loading={followersLoading}
      />

      <NavBar />
      <div className="profilepage">
        <Sidebar />

        <div className="profile__right">
          <div className="profile__top__right">
            <div className="profile__cover">
              <div className="profile__friends__info">
                <div className="profile__posts__info">
                  <b>{posts?.length} </b>
                  <span> Posts</span>
                </div>

                <div
                  className="profile__Followers__info"
                  style={{ cursor: "pointer" }}
                  onClick={followersHandler}
                >
                  <b>
                    {ourProfile
                      ? loggedUser?.followers && loggedUser?.followers.length
                      : user?.followers && user?.followers.length}
                  </b>
                  <span> Followers</span>
                </div>

                <div className="profile__Followings__info">
                  <b>
                    {ourProfile
                      ? loggedUser?.followers && loggedUser?.followings.length
                      : user?.followers && user?.followings.length}
                  </b>
                  <span> Followings</span>
                </div>
              </div>

              <img
                src={
                  ourProfile
                    ? (userInfo && userInfo.coverPicture) ||
                      "/assets/post/8.jpeg"
                    : user?.coverPicture || "/assets/post/8.jpeg"
                }
                alt="post"
                className="profile__cover__img"
              />
              <img
                src={
                  ourProfile
                    ? (userInfo && userInfo.profilePicture) ||
                      "/assets/person/noAvatar.png"
                    : user?.profilePicture || "/assets/person/noAvatar.png"
                }
                alt="user"
                className="profile__user__img"
              />

              {ourProfile ? (
                <>
                  <Link to="/update" className="profile__update__button">
                    <div>Edit Profile</div>
                  </Link>

                  {/* <button
                    type="button"
                    onClick={userDeleteHandler}
                    className="profile__delete__button"
                  >
                    Delete Account
                  </button> */}
                </>
              ) : (
                <div className="profile__follow__button">
                  {userInfo &&
                  user?.followers &&
                  user?.followers.includes(userInfo._id) ? (
                    <button
                      type="button"
                      onClick={() => followHandler("unfollow")}
                    >
                      UnFollow
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => followHandler("follow")}
                    >
                      Follow
                    </button>
                  )}

                  {followLoading && (
                    <div
                      className="follow__loader"
                      style={{
                        position: "absolute",
                        right: "-40%",
                        bottom: "10%",
                      }}
                    >
                      <Loader size="30px" />
                    </div>
                  )}
                  {followError && (
                    <div
                      className="follow__error"
                      style={{
                        position: "absolute",
                        right: "-40%",
                        bottom: "10%",
                      }}
                    >
                      <Message variant="danger">{followError}</Message>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="profile__info">
              <h4 className="profile__info__name">
                {ourProfile
                  ? userInfo && userInfo?.username.toUpperCase()
                  : user?.username && user?.username.toUpperCase()}
              </h4>
              <span className="profile__desc">
                {ourProfile
                  ? userInfo?.desc || "Nothing to Read..."
                  : user?.desc || "Nothing to Read..."}
              </span>
            </div>
          </div>
          <div className="profile__bottom__right">
            <Feed profile ourProfile={ourProfile} />
            <Rightbar profile ourProfile={ourProfile} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
