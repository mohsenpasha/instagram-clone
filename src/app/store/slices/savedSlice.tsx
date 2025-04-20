import { createSlice } from "@reduxjs/toolkit";


const initialState : {posts: [] | [{}],folders: [] | [{}]} = {
  posts:[],
  folders:[]
};

const savedSlice = createSlice({
  name: "savedSlice",
  initialState,
  reducers: {
    addSavedPosts: (state,action) =>{
      try{
        state.posts = [...state.posts,...action.payload]
      }
      catch{
        state.posts = [action.payload,...state.posts]
      }
    },
    addSavedFolder: (state,action) =>{
      try{
        state.folders = [...state.folders,...action.payload]
      }
      catch{
        state.folders = [action.payload,...state.folders]
      }
    },
  },
});

export const { addSavedPosts, addSavedFolder} = savedSlice.actions;
export default savedSlice.reducer;