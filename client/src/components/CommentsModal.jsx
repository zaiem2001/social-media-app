import { Button, Modal } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { useParams } from "react-router-dom";

import "./commentsModal.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getTimelinePosts, getUserPosts } from "../actions/userActions";

function CommentsModal(props) {
  const { loading, data, error } = props.data;
  const { post, token, setpostcomments, ourprofile, show, userId, userPostId } =
    props;

  const [deleteComment, setDeleteComment] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const updatedComments = data.map((c) => {
    if (c.user === userId) {
      c.mine = true;
    }
    if (userId === userPostId) {
      c.userPost = true;
    }
    return c;
  });

  // console.log(myComments);

  const [comment, setComment] = useState("");

  updatedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const [addComment, setAddComment] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const params = useParams();
  const id = params.id;

  const addCommentHandler = async (id) => {
    // POST /api/posts/:id/comment
    const url = `/api/posts/${id}/comment`;

    if (!comment.trim()) {
      setAddComment((prev) => {
        return { ...prev, error: "Comment is empty" };
      });
    } else {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      try {
        const { data } = await axios.post(url, { comment }, config);

        setComment("");
        if (data) {
          setAddComment({ loading: false, success: true, error: null });
        }
      } catch (error) {
        setAddComment({
          error:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
          loading: false,
          success: false,
        });
      }
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (addComment.success || deleteComment.success) {
      if (!show) {
        if (ourprofile === "true") {
          dispatch(getUserPosts());
        } else {
          dispatch(getUserPosts(id));
          dispatch(getTimelinePosts());
        }
      } else {
        const getComments = async () => {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const url = `/api/posts/${post}/comment`;

          try {
            const { data } = await axios.get(url, config);

            setpostcomments({ data });
          } catch (error) {
            setpostcomments({
              error:
                error.response && error.response.data.message
                  ? error.response.data.message
                  : error.message,
            });
          }
        };
        getComments();
      }
    }

    // return () => setAddComment({});
  }, [
    addComment.success,
    post,
    token,
    setpostcomments,
    dispatch,
    ourprofile,
    show,
    id,
    deleteComment.success,
  ]);

  const deleteCommentHandler = async (id) => {
    // /api/posts/:postId/comment/:commendId/delete
    const url = `/api/posts/${post}/comment/${id}/delete`;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    setDeleteComment({ loading: true, success: false, error: null });

    try {
      const { data } = await axios.delete(url, config);

      if (data) {
        setDeleteComment({ loading: false, error: null, success: true });
      }
    } catch (error) {
      console.log(error);
      setDeleteComment({
        loading: false,
        error:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        success: false,
      });
    }
  };

  const commentRef = useRef();

  useEffect(() => {
    if (!addComment?.error) {
      commentRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [updatedComments, addComment.error]);

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{
        backdropFilter: "blur(2px)",
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          minHeight: "250px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {loading && <Loader size="40px" />}
        {error && <Message variant="danger">{error}</Message>}
        {!loading && data.length === 0 ? (
          <Message variant="info">No Comments</Message>
        ) : (
          <>
            <ul
              className="post__comments"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
              ref={commentRef}
            >
              {addComment.error && (
                <Message variant="danger">{addComment.error}</Message>
              )}
              {deleteComment.error && (
                <Message variant="danger">{deleteComment.error}</Message>
              )}

              {!loading &&
                updatedComments.map((d) => (
                  <li
                    key={d._id}
                    style={{
                      margin: "10px 0",
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <img
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                      src={d.profile || "/assets/person/noAvatar.png"}
                      alt="user"
                    />
                    <span
                      style={{
                        marginRight: "20px",
                        fontWeight: "600",
                        fontSize: "20px",
                      }}
                    >
                      {d.name}
                    </span>

                    <span
                      className="comment__text"
                      style={{
                        padding: "5px",
                        paddingRight: "10px",
                      }}
                    >
                      {d.comment}
                    </span>

                    {d && (d?.mine || d.userPost) && (
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          position: "absolute",
                          right: "12px",
                          top: "25%",
                        }}
                        className="delete__comment"
                        onClick={() => deleteCommentHandler(d._id)}
                        disabled={deleteComment.loading}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </li>
                ))}
            </ul>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <input
          value={comment}
          className="comment__input"
          type="text"
          placeholder="Comment..."
          style={{
            padding: "10px",
            paddingLeft: "20px",
            width: "80%",
            border: "none",
            fontSize: "20px",
            fontWeight: "500",
            borderRadius: "8px",
          }}
          onChange={(e) => {
            setComment(e.target.value);
            setAddComment({ error: null, success: false, loading: false });
            setDeleteComment({ error: null, loading: false, success: false });
          }}
        />
        <Button
          onClick={() => addCommentHandler(post)}
          disabled={addComment.loading}
        >
          {loading || addComment.loading || deleteComment.loading ? (
            <Loader size="20px" />
          ) : (
            "Comment"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CommentsModal;
