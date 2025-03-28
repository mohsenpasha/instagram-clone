import { createSlice } from "@reduxjs/toolkit";

type UserDetail = null | {

}

const initialState : {myUsername:null | string,unfollowDetail:null | {username:string,profile_pic:string},currentVisitingUser:null | {}} = {
  myUsername: null,
  unfollowDetail:null,
  currentVisitingUser:null
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    changeMyUsername: (state, action) => {
      state.myUsername = action.payload;
    },
    changeUnfollow: (state, action) => {
        state.unfollowDetail = action.payload;
      },
    changeCurrentVisitingUser: (state, action) => {
      action.payload['isLoading'] = false
      state.currentVisitingUser = action.payload
    },
    toggleIsLoading: (state, action) => {
      state.currentVisitingUser.isLoading = action.payload
    },
    toggleIsFollowing: (state, action) => {
      state.currentVisitingUser.is_following = action.payload
    },
  },
});

export const { changeMyUsername, changeUnfollow, changeCurrentVisitingUser, toggleIsLoading, toggleIsFollowing} = userSlice.actions;
export default userSlice.reducer;