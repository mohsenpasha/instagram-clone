import { createSlice } from "@reduxjs/toolkit";

type UserDetail = null | {

}

const initialState : {username:null | string,unfollowDetail:null | {username:string,profile_pic:string}} = {
  username: null,
  unfollowDetail:null
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    changeUsername: (state, action) => {
      state.username = action.payload;
    },
    changeUnfollow: (state, action) => {
        state.unfollowDetail = action.payload;
      },
  },
});

export const { changeUsername, changeUnfollow } = userSlice.actions;
export default userSlice.reducer;