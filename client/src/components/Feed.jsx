import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { getTimelinePosts, getUserPosts } from "../actions/userActions";
import Post from "./Post";
import Share from "./Share";
// import { Posts } from "../dummyData";
import Message from "./Message";
import "./feed.css";

const Feed = ({ profile, ourProfile }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const params = useParams();
  const userId = params.id;

  const postAdd = useSelector((state) => state.postAdd);
  const { success } = postAdd;

  const userPosts = useSelector((state) => state.userPosts);
  const { posts, loading } = userPosts;
  // console.log(posts);

  const formatedPosts = posts?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const userTimeline = useSelector((state) => state.userTimeline);
  const { posts: timelinePosts } = userTimeline;

  const formatedTimelinePosts = timelinePosts?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const showShare = ourProfile || !profile;

  const dispatch = useDispatch();

  // console.log(ourProfile);

  useEffect(() => {
    if (ourProfile) {
      dispatch(getUserPosts());
    }
  }, [success, dispatch, ourProfile]);

  useEffect(() => {
    if (userInfo) {
      if (!ourProfile) {
        dispatch(getUserPosts(userId));
      }
    }
  }, [dispatch, userId, ourProfile, userInfo]);

  useEffect(() => {
    if (userInfo) {
      if (profile && ourProfile) {
        dispatch(getUserPosts());
      } else {
        dispatch(getTimelinePosts());
      }
    }
  }, [dispatch, userInfo, profile, ourProfile]);

  // console.log(timelinePosts);

  return (
    <div className="feed">
      <div className="feed__wrapper">
        {showShare && <Share />}

        {!profile && timelinePosts && timelinePosts.length === 0 && (
          <Message variant="info"> You Dont Have Any Friends. </Message>
        )}

        {profile && posts && posts.length === 0 && (
          <Message variant="info">No Posts</Message>
        )}

        {!loading && profile
          ? formatedPosts?.map((post) => (
              <Post ourProfile={ourProfile} key={post._id} post={post} />
            ))
          : formatedTimelinePosts?.map((post) => (
              <Post key={post._id} post={post} />
            ))}
      </div>
    </div>
  );
};

export default Feed;
