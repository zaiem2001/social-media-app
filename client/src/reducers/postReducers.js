export const POST_CONSTANTS = {
  ADD_POST_REQUEST: "ADD_POST_REQUEST",
  ADD_POST_SUCCESS: "ADD_POST_SUCCESS",
  ADD_POST_FAIL: "ADD_POST_FAIL",
};

export const postAddReducer = (state = {}, action) => {
  switch (action.type) {
    case POST_CONSTANTS.ADD_POST_REQUEST:
      return { loading: true };

    case POST_CONSTANTS.ADD_POST_SUCCESS:
      return { loading: false, success: true };

    case POST_CONSTANTS.ADD_POST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
