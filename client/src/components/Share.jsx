import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storage } from "../firebase";
import { Link } from "react-router-dom";
import { ProgressBar } from "react-bootstrap";

import "./share.css";
import { createPost } from "../actions/postActions";
import Loader from "./Loader";
import Message from "./Message";

const Share = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [progress, setProgress] = useState(0);
  const [customError, setCustomError] = useState(null);

  const postAdd = useSelector((state) => state.postAdd);
  const { loading, error } = postAdd;

  if (error) {
    console.log(error);
  }

  const dispatch = useDispatch();

  const desc = useRef();
  const [file, setFile] = useState(null);
  const [adding, setAdding] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();

    if (file && desc.current.value.trim()) {
      setCustomError(null);
      const uploadTask = storage.ref(`images/${file.name}`).put(file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          setAdding(true);
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(file.name)
            .getDownloadURL()
            .then((url) => {
              // console.log(url);
              dispatch(createPost(url, desc.current.value));
              setFile(null);
              desc.current.value = "";
              setAdding(false);
            });
        }
      );
    } else {
      setCustomError("Please Upload an Image AND Description.");
    }

    // console.log(desc.current.value);
  };

  return (
    <div className="share">
      <div className="share__wrapper">
        <div className="share__top">
          <Link to={`/profile/${userInfo && userInfo._id}`}>
            <img
              className="share__img"
              src={
                (userInfo && userInfo.profilePicture) ||
                "/assets/person/noAvatar.png"
              }
              alt="user"
            />
          </Link>
          <input
            type="text"
            className="share__input"
            ref={desc}
            onChange={() => setCustomError(null)}
            placeholder={`What's in your mind ${
              userInfo && userInfo.username
            }?`}
          />
        </div>
        <hr className="share__hr" />

        {file && (
          <div className="share__image__container">
            <img
              src={URL.createObjectURL(file)}
              alt="user_img"
              className="share__image"
            />

            <Cancel className="share__cancel" onClick={() => setFile(null)} />
          </div>
        )}

        <form className="share__bottom" onSubmit={submitHandler}>
          <div className="share__container">
            <label htmlFor="file" className="share__item">
              <PermMedia htmlColor="tomato" className="share__icon" />
              <span className="item__name">Media or Video</span>
              <input
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setCustomError(null);
                }}
                style={{ display: "none" }}
              />
            </label>

            <div className="share__item tag">
              <Label htmlColor="skyblue" className="share__icon" />
              <span className="item__name">Tag</span>
            </div>

            <div className="share__item loc">
              <Room htmlColor="green" className="share__icon" />
              <span className="item__name">Location</span>
            </div>

            <div className="share__item feelings">
              <EmojiEmotions htmlColor="gold" className="share__icon" />
              <span className="item__name">Feelings</span>
            </div>
          </div>

          <button type="submit" className="share__button" disabled={loading}>
            Share
          </button>
        </form>
      </div>
      {loading && <Loader size={"50px"} />}
      {adding && (
        <ProgressBar
          now={progress}
          label={`${progress}%`}
          style={{
            margin: "5px auto 15px",
            width: "300px",
            backgroundColor: "#eee",
            color: "black",
          }}
        />
      )}
      {customError && <Message variant="info">{customError}</Message>}
    </div>
  );
};

export default Share;
