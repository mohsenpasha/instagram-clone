import { createSlice } from "@reduxjs/toolkit";

type UserTypes = {
  myUsername:null | string,
  unfollowDetail:null | {username:string,profile_pic:string},
  currentVisitingUser:null | {
    name:string,
    username:string,
    isLoading:boolean,
    is_following:boolean,
    profile_pic:string,
    is_private:boolean,
    follower_count:number,
    following_count:number,
    post_count:number
  }
}

const initialState : UserTypes = {
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
      if(action.payload != null){
        action.payload['isLoading'] = false
      }
      state.currentVisitingUser = action.payload
    },
    toggleIsLoading: (state, action) => {
      if(!state.currentVisitingUser) return
      state.currentVisitingUser.isLoading = action.payload
    },
    toggleIsFollowing: (state, action) => {
      if(!state.currentVisitingUser) return
      state.currentVisitingUser.is_following = action.payload
    },
  },
});

export const { changeMyUsername, changeUnfollow, changeCurrentVisitingUser, toggleIsLoading, toggleIsFollowing} = userSlice.actions;
export default userSlice.reducer;