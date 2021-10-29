import { Cancel, PermMedia } from "@material-ui/icons";
import { useState } from "react";
import { storage } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { CircularProgress } from "@material-ui/core";
import { ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";

import Message from "../components/Message";
import "./updateProfile.css";
import { updateUser } from "../actions/userActions";
import Loader from "../components/Loader";
import { Helmet } from "react-helmet";

const UpdateProfile = ({ user, id }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [customError, setCustomError] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const [desc, setDesc] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [relationship, setRelationship] = useState(0);
  const [profilePicture, setProfilePicture] = useState(null);

  const [progress, setProgress] = useState(0);
  const [adding, setAdding] = useState(false);

  const userUpdate = useSelector((state) => state.userUpdate);
  let { loading, success, error } = userUpdate;

  const dispatch = useDispatch();

  const history = useHistory();

  if (success) {
    history.push(`/profile/${id}`);
  }

  const updateProfileHandler = (e) => {
    e.preventDefault();

    if (newPassword.trim() !== confirmPassword.trim()) {
      setCustomError("Passwords Do Not Match");
    } else {
      if (
        !username.trim() &&
        !email.trim() &&
        !newPassword.trim() &&
        !oldPassword.trim() &&
        !confirmPassword.trim() &&
        !desc.trim() &&
        !city.trim() &&
        !relationship &&
        !state.trim() &&
        !profilePicture
      ) {
        setCustomError("Fill Atleast One Field");
      } else {
        if (profilePicture) {
          const uploadTask = storage
            .ref(`images/${profilePicture.name}`)
            .put(profilePicture);
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
                .child(profilePicture.name)
                .getDownloadURL()
                .then((url) => {
                  // console.log(url);
                  dispatch(
                    updateUser({
                      username,
                      email,
                      profilePicture: url,
                      desc,
                      state,
                      city,
                      relationship,
                      oldPassword,
                      newPassword,
                    })
                  );
                  setProfilePicture(null);
                  setAdding(false);
                });
            }
          );
        } else {
          dispatch(
            updateUser({
              username,
              email,
              desc,
              state,
              city,
              relationship,
              oldPassword,
              newPassword,
            })
          );
        }
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Z social - Update Profile</title>
        <meta
          name="description"
          content="Meet your friends online with this app and chat with them."
        />
      </Helmet>

      <form className="updateProfile" onSubmit={updateProfileHandler}>
        {loading && (
          <div
            className="up__loader"
            style={{ position: "absolute", bottom: "10%", left: "20%" }}
          >
            <Loader />
          </div>
        )}

        {customError && (
          <div
            className="customError"
            style={{ position: "absolute", top: "18%", left: "11%" }}
          >
            {customError && <Message variant="danger">{customError}</Message>}
          </div>
        )}

        {error && (
          <div className="customError">
            {error && <Message variant="danger">{error}</Message>}
          </div>
        )}

        <h3 className="up__heading">Update Profile ( {user} )</h3>

        <h5 className="up__info">
          You won't be able to change your profile for next 24 hrs
        </h5>

        <Link to="/">
          <button type="button" className="up__back__button">
            Go Back
          </button>
        </Link>

        <div className="up__wrapper">
          <div className="up__left">
            <input
              type="text"
              className="up__username"
              placeholder="Enter Username."
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              className="up__email"
              placeholder="Enter Email."
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type={showPassword ? "text" : "password"}
              className="up__oldPwd"
              placeholder="Enter Your Old Passoword."
              onChange={(e) => {
                setOldPassword(e.target.value);
                setCustomError(null);
              }}
              autoComplete="true"
            />
            <input
              type={showPassword ? "text" : "password"}
              className="up__newPwd"
              placeholder="Enter Your New Passoword."
              onChange={(e) => {
                setNewPassword(e.target.value);
                setCustomError(null);
              }}
              autoComplete="true"
            />
            <input
              type={showPassword ? "text" : "password"}
              className="up__confirm__newPwd"
              placeholder="Confirm Password."
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setCustomError(null);
              }}
              autoComplete="true"
            />

            <i
              className={
                showPassword
                  ? "fas fa-eye my-1 mb-3"
                  : "fas fa-eye-slash my-1 mb-3"
              }
              style={{ cursor: "pointer", position: "absolute", bottom: "21%" }}
              onClick={() => setShowPassword((prev) => !prev)}
            ></i>
          </div>

          <div className="up__right">
            <input
              type="text"
              className="up__desc"
              placeholder="Enter BIO"
              onChange={(e) => setDesc(e.target.value)}
            />
            <input
              type="text"
              className="up__state"
              placeholder="Enter Your State."
              onChange={(e) => setState(e.target.value)}
            />
            <input
              type="text"
              className="up__city"
              placeholder="Enter Your City."
              onChange={(e) => setCity(e.target.value)}
            />

            <select
              name="relationship"
              id="r"
              className="up__relationship"
              onChange={(e) => setRelationship(Number(e.target.value))}
            >
              <option value="" disabled defaultChecked>
                Choose
              </option>
              <option value="1">Single</option>
              <option value="2">Couple</option>
              <option value="3">Other</option>
            </select>

            <label htmlFor="profile" style={{ width: "300px" }}>
              <div
                className="up__profile__container"
                style={{ cursor: "pointer" }}
              >
                Choose Profile Pic
                <PermMedia htmlColor="tomato" style={{ marginLeft: "10px" }} />
              </div>
              <input
                style={{ display: "none" }}
                id="profile"
                type="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                className="up__profile__image"
              />
            </label>

            {profilePicture && (
              <div className="up__profile__picture__container">
                <img
                  src={URL.createObjectURL(profilePicture)}
                  alt="userProfile"
                />

                <Cancel
                  className="up__cancel"
                  onClick={() => setProfilePicture(null)}
                />
              </div>
            )}
          </div>
        </div>

        <button className="up__update" type="submit" disabled={loading}>
          {loading ? (
            <CircularProgress size="20px" color="secondary" />
          ) : (
            "Update"
          )}
        </button>

        {adding && (
          <ProgressBar
            now={progress}
            label={`${progress}%`}
            className="up__progress__bar"
          />
        )}
      </form>
    </>
  );
};

export default UpdateProfile;
