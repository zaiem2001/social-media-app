import axios from "axios";

import { MESSAGE_CONSTANTS } from "../reducers/messageReducers";

export const getUserConversations = (id) => async (dispatch, getState) => {
  dispatch({ type: MESSAGE_CONSTANTS.GET_MSG_REQUEST });

  //   /api/posts
  const url = `/api/conversations/conversation/${id}`;

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

      dispatch({ type: MESSAGE_CONSTANTS.GET_MSG_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: MESSAGE_CONSTANTS.GET_MSG_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
};

export const deleteUserMessage = (id) => async (dispatch, getState) => {
  dispatch({ type: MESSAGE_CONSTANTS.DEL_MSG_REQUEST });

  const url = `/api/messages/${id}`;

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
      const { data } = await axios.delete(url, config);

      if (data) {
        dispatch({ type: MESSAGE_CONSTANTS.DEL_MSG_SUCCESS });
      }
    } catch (error) {
      dispatch({
        type: MESSAGE_CONSTANTS.DEL_MSG_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
};
