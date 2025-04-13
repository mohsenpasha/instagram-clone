import { createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

type PostUpload = {
  postMedia:{} | null,
  activeIndex:number | null
}
const initialState : PostUpload = {
  postMedia:null,
  activeIndex:null
};

const createPostSlice = createSlice({
  name: "createPostSlice",
  initialState,
  reducers: {
    addPostMedia: (state, action) => {
      if(state.postMedia){
        state.postMedia = [...state.postMedia,action.payload]
      }
      else{
        state.postMedia = [action.payload]
      }
    },
    changeActiveIndex: (state, action) => {
      state.activeIndex = action.payload
    },
    deleteActiveIndex: (state)=>{
      state.postMedia = state.postMedia.filter((_, index) => index !== state.activeIndex);     
    }
  },
});

export const { addPostMedia, changeActiveIndex, deleteActiveIndex} = createPostSlice.actions;
export default createPostSlice.reducer;