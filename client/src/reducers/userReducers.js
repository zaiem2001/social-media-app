export const USER_CONSTANTS = {
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAIL: "LOGIN_FAIL",

  REGISTER_REQUEST: "REGISTER_REQUEST",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAIL: "REGISTER_FAIL",
  REGISTER_RESET: "REGISTER_RESET",

  USER_FRIENDS_REQUEST: "USER_FRIENDS_REQUEST",
  USER_FRIENDS_SUCCESS: "USER_FRIENDS_SUCCESS",
  USER_FRIENDS_FAIL: "USER_FRIENDS_FAIL",

  USER_POSTS_REQUEST: "USER_POSTS_REQUEST",
  USER_POSTS_SUCCESS: "USER_POSTS_SUCCESS",
  USER_POSTS_FAIL: "USER_POSTS_FAIL",

  USER_TIMELINE_REQUEST: "USER_TIMELINE_REQUEST",
  USER_TIMELINE_SUCCESS: "USER_TIMELINE_SUCCESS",
  USER_TIMELINE_FAIL: "USER_TIMELINE_FAIL",

  GET_USER_REQUEST: "GET_USER_REQUEST",
  GET_USER_SUCCESS: "GET_USER_SUCCESS",
  GET_USER_FAIL: "GET_USER_FAIL",

  UPDATE_USER_REQUEST: "UPDATE_USER_REQUEST",
  UPDATE_USER_SUCCESS: "UPDATE_USER_SUCCESS",
  UPDATE_USER_FAIL: "UPDATE_USER_FAIL",
  UPDATE_USER_RESET: "UPDATE_USER_RESET",

  FOLLOW_USER_REQUEST: "FOLLOW_USER_REQUEST",
  FOLLOW_USER_SUCCESS: "FOLLOW_USER_SUCCESS",
  FOLLOW_USER_FAIL: "FOLLOW_USER_FAIL",
  FOLLOW_USER_RESET: "FOLLOW_USER_RESET",

  GET_USER_FOLLOWERS_REQUEST: "GET_USER_FOLLOWERS_REQUEST",
  GET_USER_FOLLOWERS_SUCCESS: "GET_USER_FOLLOWERS_SUCCESS",
  GET_USER_FOLLOWERS_FAIL: "GET_USER_FOLLOWERS_FAIL",

  LOGOUT: "LOGOUT",
};

export const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CONSTANTS.LOGIN_REQUEST:
      return { loading: true };

    case USER_CONSTANTS.LOGIN_SUCCESS:
      return { userInfo: action.payload, loading: false };

    case USER_CONSTANTS.LOGIN_FAIL:
      return { error: action.payload, loading: false };

    case USER_CONSTANTS.LOGOUT:
      return {};

    default:
      return state;
  }
};

export const registerReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CONSTANTS.REGISTER_REQUEST:
      return { loading: true };

    case USER_CONSTANTS.REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload };

    case USER_CONSTANTS.REGISTER_FAIL:
      return { loading: false, error: action.payload };

    case USER_CONSTANTS.REGISTER_RESET:
      return {};

    default:
      return state;
  }
};

export const userFriendsReducer = (state = { friends: [] }, action) => {
  switch (action.type) {
    case USER_CONSTANTS.USER_FRIENDS_REQUEST:
      return { loading: true };

    case USER_CONSTANTS.USER_FRIENDS_SUCCESS:
      return { loading: false, friends: action.payload };

    case USER_CONSTANTS.USER_FRIENDS_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const userPostsReducer = (state = { posts: [] }, action) => {
  switch (action.type) {
    case USER_CONSTANTS.USER_POSTS_REQUEST:
      return { loading: true };

    case USER_CONSTANTS.USER_POSTS_SUCCESS:
      return { loading: false, posts: action.payload };

    case USER_CONSTANTS.USER_POSTS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const userTimelineReducer = (state = { posts: [] }, action) => {
  switch (action.type) {
    case USER_CONSTANTS.USER_TIMELINE_REQUEST:
      return { loading: true };

    case USER_CONSTANTS.USER_TIMELINE_SUCCESS:
      return { loading: false, posts: action.payload };

    case USER_CONSTANTS.USER_TIMELINE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const userUserByIdReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_CONSTANTS.GET_USER_REQUEST:
      return { loading: true };

    case USER_CONSTANTS.GET_USER_SUCCESS:
      return { loading: false, user: action.payload };

    case USER_CONSTANTS.GET_USER_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const userUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CONSTANTS.UPDATE_USER_REQUEST:
      return { loading: true };

    case USER_CONSTANTS.UPDATE_USER_SUCCESS:
      return { loading: false, success: true };

    case USER_CONSTANTS.UPDATE_USER_FAIL:
      return { loading: false, error: action.payload, success: false };

    case USER_CONSTANTS.UPDATE_USER_RESET:
      return {};

    default:
      return state;
  }
};

export const userFollowUnfollowReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CONSTANTS.FOLLOW_USER_REQUEST:
      return { loading: true };

    case USER_CONSTANTS.FOLLOW_USER_SUCCESS:
      return { loading: false, success: true };

    case USER_CONSTANTS.FOLLOW_USER_FAIL:
      return { loading: false, error: action.payload, success: false };

    case USER_CONSTANTS.FOLLOW_USER_RESET:
      return {};

    default:
      return state;
  }
};

export const userFollowersReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CONSTANTS.GET_USER_FOLLOWERS_REQUEST:
      return { loading: true };

    case USER_CONSTANTS.GET_USER_FOLLOWERS_SUCCESS:
      return { loading: false, followers: action.payload };

    case USER_CONSTANTS.GET_USER_FOLLOWERS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
