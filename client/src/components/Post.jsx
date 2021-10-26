import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Chat, MoreVert } from "@material-ui/icons";
import { format } from "timeago.js";

// import Comments from "./Comments";
// import { Users } from "../dummyData";
import "./post.css";
import { getUserPosts } from "../actions/userActions";
import Loader from "./Loader";
import Message from "./Message";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import CommentsModal from "./CommentsModal";

const Post = ({ post, ourProfile }) => {
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [modalShow, setModalShow] = useState(false);

  // console.log(post);
  const [like, setLike] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);

  const [showHeart, setShowHeart] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  const [postComments, setPostComments] = useState({
    loading: false,
    data: [],
    error: null,
  });

  const userPosts = useSelector((state) => state.userPosts);
  const { loading, error } = userPosts;

  // const userById = useSelector((state) => state.userById);
  // const { user } = userById;

  const [deletePost, setDeletePost] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const history = useHistory();
  // console.log(user);

  // useEffect(() => {
  //   if (userInfo) {
  //     dispatch(getUserById(post.user));
  //   }
  // }, [dispatch, userInfo, post.user]);

  useEffect(() => {
    if (userInfo) {
      setIsLiked(post.likes.includes(userInfo._id));
    }
  }, [userInfo, post.likes]);

  const handleClick = (id) => {
    // console.log(id);
    history.push(`/profile/${id}`);
  };

  const likeHandler = async () => {
    setShowHeart(true);

    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked((prev) => !prev);

    setTimeout(() => {
      setShowHeart(false);
    }, 1000);

    // /api/posts/:id/like

    const url = `/api/posts/${post._id}/like`;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(url, "", config);

      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async (id) => {
    if (window.confirm("Are You Sure ?")) {
      console.log("deleted");

      // DELETE /api/posts/:id
      const url = `/api/posts/${id}`;

      setDeletePost((prev) => {
        return { ...prev, loading: true };
      });

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      try {
        const { data } = await axios.delete(url, config);

        if (data && data?.msg.includes("success")) {
          setDeletePost({ loading: false, success: true, error: null });
        }
      } catch (error) {
        setDeletePost((prev) => {
          return {
            error,
            loading: false,
            success: false,
          };
        });
      }
    }
  };

  useEffect(() => {
    if (deletePost?.success) {
      dispatch(getUserPosts());
      setDeletePost({ ...deletePost, success: false });
    }
  }, [deletePost, dispatch]);

  const commentsHandler = async (id) => {
    setModalShow(true);

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const url = `/api/posts/${id}/comment`;
    setPostComments({ loading: true, error: null, data: [] });

    try {
      const { data } = await axios.get(url, config);

      setPostComments({ loading: false, error: null, data });
    } catch (error) {
      setPostComments({ loading: false, error: error.message });
    }
  };

  return (
    <div className="post">
      {loading && <Loader size="40px" />}
      {error && <Message variant="danger">{error}</Message>}

      <CommentsModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={postComments}
        post={post?._id}
        userPostId={post?.user}
        token={userInfo && userInfo.token}
        setpostcomments={setPostComments}
        ourprofile={ourProfile && ourProfile.toString()}
        userId={userInfo && userInfo._id}
      />

      <div className="post__wrapper">
        {deletePost.loading && <Loader size="30px" />}
        {deletePost.error && (
          <Message variant="danger">{deletePost.error}</Message>
        )}
        <div className="post__top">
          <div
            className="post__top__left"
            onClick={() => handleClick(post?.user)}
          >
            <img
              src={
                ourProfile
                  ? (userInfo && userInfo.profilePicture) ||
                    "/assets/person/noAvatar.png"
                  : post?.profilePic || "/assets/person/noAvatar.png"
              }
              alt="user"
              className="post__profile__img"
            />
            <span className="post__username">
              {ourProfile ? userInfo && userInfo.username : post?.username}
            </span>
            <span className="post__date">{format(post.createdAt)}</span>
          </div>
          <div className="post__top__right">
            {ourProfile ? (
              <Dropdown>
                <Dropdown.Toggle
                  variant="dark"
                  id="dropdown-basic"
                  className="post__dropdown"
                  style={{ border: "none" }}
                >
                  <MoreVert style={{ cursor: "pointer" }} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => deletePostHandler(post._id)}>
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <MoreVert style={{ cursor: "pointer" }} />
            )}
          </div>
        </div>
        <div className="post__center" onDoubleClick={likeHandler}>
          <span className="post__desc">{post.desc}</span>
          <span className={showHeart ? "post__heart active" : "post__heart"}>
            ❤
          </span>
          <img src={post.image || "/assets/post/1.jpeg"} alt="post" />
        </div>

        <div className="post__bottom">
          <div className="post__bottom__like__container">
            <img
              src="/assets/heart.png"
              className="post__like"
              alt="heart"
              onClick={likeHandler}
            />
            <img
              src="/assets/like.png"
              className="post__like"
              alt="heart"
              onClick={likeHandler}
            />
            <div className="post__like__count">
              {" "}
              <span className="like__number">{like} </span>Likes
            </div>
          </div>

          <div
            className="post__comments"
            onClick={() => commentsHandler(post._id)}
          >
            <Chat className="post__icon" htmlColor="rebeccapurple" />
            <span className="post__comments__count">
              {post.numComments} Comments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
