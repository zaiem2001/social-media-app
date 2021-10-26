import axios from "axios";

import { POST_CONSTANTS } from "../reducers/postReducers";

export const createPost = (image, desc) => async (dispatch, getState) => {
  dispatch({ type: POST_CONSTANTS.ADD_POST_REQUEST });

  //   /api/posts
  const url = `/api/posts`;

  const {
    userLogin: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    await axios.post(url, { image, desc }, config);

    dispatch({ type: POST_CONSTANTS.ADD_POST_SUCCESS });
  } catch (error) {
    dispatch({
      type: POST_CONSTANTS.ADD_POST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
