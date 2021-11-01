export const MESSAGE_CONSTANTS = {
  GET_MSG_REQUEST: "GET_MSG_REQUEST",
  GET_MSG_SUCCESS: "GET_MSG_SUCCESS",
  GET_MSG_FAIL: "GET_MSG_FAIL",

  DEL_MSG_REQUEST: "DEL_MSG_REQUEST",
  DEL_MSG_SUCCESS: "DEL_MSG_SUCCESS",
  DEL_MSG_FAIL: "DEL_MSG_FAIL",
};

export const fetchConvReducer = (state = { conversations: [] }, action) => {
  switch (action.type) {
    case MESSAGE_CONSTANTS.GET_MSG_REQUEST:
      return { loading: true };

    case MESSAGE_CONSTANTS.GET_MSG_SUCCESS:
      return { loading: false, conversations: action.payload };

    case MESSAGE_CONSTANTS.GET_MSG_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const deleteConvReducer = (state = {}, action) => {
  switch (action.type) {
    case MESSAGE_CONSTANTS.DEL_MSG_REQUEST:
      return { loading: true };

    case MESSAGE_CONSTANTS.DEL_MSG_SUCCESS:
      return { loading: false, success: true };

    case MESSAGE_CONSTANTS.DEL_MSG_FAIL:
      return { loading: false, error: action.payload, success: false };

    default:
      return state;
  }
};
