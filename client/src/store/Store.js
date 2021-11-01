import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
  loginReducer,
  registerReducer,
  userFollowersReducer,
  userFollowUnfollowReducer,
  userFriendsReducer,
  userPostsReducer,
  userTimelineReducer,
  userUpdateReducer,
  userUserByIdReducer,
} from "../reducers/userReducers";
import { postAddReducer } from "../reducers/postReducers";
import {
  deleteConvReducer,
  fetchConvReducer,
} from "../reducers/messageReducers";

export const reducer = combineReducers({
  userLogin: loginReducer,
  userRegister: registerReducer,
  userFriends: userFriendsReducer,
  userPosts: userPostsReducer,
  userTimeline: userTimelineReducer,
  userById: userUserByIdReducer,
  userUpdate: userUpdateReducer,
  userFollow: userFollowUnfollowReducer,
  userFollowers: userFollowersReducer,

  conversation: fetchConvReducer,
  conversationDel: deleteConvReducer,

  postAdd: postAddReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
  userRegister: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
