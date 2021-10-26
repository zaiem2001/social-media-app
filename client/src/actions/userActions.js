import axios from "axios";

import { USER_CONSTANTS } from "../reducers/userReducers";

export const login = (username, password) => async (dispatch) => {
  dispatch({ type: USER_CONSTANTS.LOGIN_REQUEST });

  const url = "/api/users/login";

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const { data } = await axios.post(url, { username, password }, config);

    dispatch({ type: USER_CONSTANTS.LOGIN_SUCCESS, payload: data });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_CONSTANTS.LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const register = (username, email, password) => async (dispatch) => {
  dispatch({ type: USER_CONSTANTS.REGISTER_REQUEST });

  const url = `/api/users/register`;

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const { data } = await axios.post(
      url,
      { username, email, password },
      config
    );

    dispatch({ type: USER_CONSTANTS.REGISTER_SUCCESS, payload: data });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_CONSTANTS.REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getUserFriends =
  (id = "") =>
  async (dispatch, getState) => {
    dispatch({ type: USER_CONSTANTS.USER_FRIENDS_REQUEST });

    const url = `/api/users/friends?userId=${id}`;

    const {
      userLogin: { userInfo },
    } = getState();

    if (userInfo) {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      try {
        const { data } = await axios.get(url, config);

        dispatch({ type: USER_CONSTANTS.USER_FRIENDS_SUCCESS, payload: data });
      } catch (error) {
        dispatch({
          type: USER_CONSTANTS.USER_FRIENDS_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        });
      }
    }
  };

export const getUserPosts =
  (id = "") =>
  async (dispatch, getState) => {
    dispatch({ type: USER_CONSTANTS.USER_POSTS_REQUEST });

    const url = `/api/posts?id=${id}`;

    const {
      userLogin: { userInfo },
    } = getState();

    if (userInfo) {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      try {
        const { data } = await axios.get(url, config);

        dispatch({ type: USER_CONSTANTS.USER_POSTS_SUCCESS, payload: data });
      } catch (error) {
        dispatch({
          type: USER_CONSTANTS.USER_POSTS_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        });
      }
    }
  };

export const getTimelinePosts = () => async (dispatch, getState) => {
  dispatch({ type: USER_CONSTANTS.USER_TIMELINE_REQUEST });

  const url = `/api/posts/timeline`;

  const {
    userLogin: { userInfo },
  } = getState();

  if (userInfo) {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      const { data } = await axios.get(url, config);

      dispatch({ type: USER_CONSTANTS.USER_TIMELINE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: USER_CONSTANTS.USER_TIMELINE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
};

export const getUserById = (userId) => async (dispatch, getState) => {
  dispatch({ type: USER_CONSTANTS.GET_USER_REQUEST });

  const id = userId?.toString();

  const url = `/api/users/${id}`;

  const {
    userLogin: { userInfo },
  } = getState();

  if (userInfo) {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      const { data } = await axios.get(url, config);

      dispatch({ type: USER_CONSTANTS.GET_USER_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: USER_CONSTANTS.GET_USER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
};

export const updateUser = (user) => async (dispatch, getState) => {
  dispatch({ type: USER_CONSTANTS.UPDATE_USER_REQUEST });

  const url = `/api/users/profile`;

  const {
    userLogin: { userInfo },
  } = getState();

  if (userInfo) {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.put(url, user, config);

      dispatch({ type: USER_CONSTANTS.UPDATE_USER_SUCCESS });

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_CONSTANTS.UPDATE_USER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
};

export const followUser = (type, id) => async (dispatch, getState) => {
  dispatch({ type: USER_CONSTANTS.FOLLOW_USER_REQUEST });

  let url = "";

  url =
    type === "follow" ? `/api/users/follow/${id}` : `/api/users/unfollow/${id}`;

  const {
    userLogin: { userInfo },
  } = getState();

  if (userInfo) {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      await axios.get(url, config);

      dispatch({ type: USER_CONSTANTS.FOLLOW_USER_SUCCESS });
    } catch (error) {
      dispatch({
        type: USER_CONSTANTS.FOLLOW_USER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
};

export const getUserFollowers = (id) => async (dispatch, getState) => {
  dispatch({ type: USER_CONSTANTS.GET_USER_FOLLOWERS_REQUEST });

  const url = `/api/users/${id}/followers`;

  const {
    userLogin: { userInfo },
  } = getState();

  if (userInfo) {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      const { data } = await axios.get(url, config);

      // console.log(data);

      dispatch({
        type: USER_CONSTANTS.GET_USER_FOLLOWERS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_CONSTANTS.GET_USER_FOLLOWERS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");

  dispatch({ type: USER_CONSTANTS.LOGOUT });
  dispatch({ type: USER_CONSTANTS.REGISTER_RESET });
};
