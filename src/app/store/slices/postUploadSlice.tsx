import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

type PostUpload = {
  postMedia:[
    {
      name: string,
      size: string,
      type: string,
      previewUrl: string,
      order:number
    }
  ] | null,
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
    },
    swapPostMedia: (state, action: PayloadAction<{ from: number; to: number }>) => {
      if (!state.postMedia) return;

      const { from, to } = action.payload;

      if (
        from < 0 || to < 0 ||
        from >= state.postMedia.length ||
        to >= state.postMedia.length
      ) return;

      const temp = state.postMedia[from];
      state.postMedia[from] = state.postMedia[to];
      state.postMedia[to] = temp;
    },
  },
});

export const { addPostMedia, changeActiveIndex, deleteActiveIndex, swapPostMedia} = createPostSlice.actions;
export default createPostSlice.reducer;