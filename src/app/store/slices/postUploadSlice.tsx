import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

type PostUpload = {
  postMedia: {
    name: string;
    size: string;
    type: string;
    previewUrl: string;
    order: number;
    alt?:string,
    tagged_user?:[
      {
        username:string,coordinates:
        {
          x:number,
          y:number
        }
      }
  ],
    transform?: {
      position: { x: number, y: number };
      scale: number;
    };
    croppedDataURL?: string;
  }[] | null;
  activeIndex: number | null;
  addingTaggedUser?:false,
  addingTagCoordinates :{
    x:number,
    y:number
  }
};
const initialState : PostUpload = {
  postMedia:null,
  activeIndex:null,
  addingTaggedUser:false,
  addingTagCoordinates:{x:0,y:0},
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
    updateImageTransform: (state, action) => {
      const { index, transform } = action.payload;
      if (state.postMedia && state.postMedia[index]) {
        state.postMedia[index].transform = transform;
      }
    },
    saveCroppedImage: (state, action) => {
      const { index, croppedDataURL } = action.payload;
      if (state.postMedia && state.postMedia[index]) {
        state.postMedia[index].croppedDataURL = croppedDataURL;
      }
    },
    changeMediaAlt: (state, action) => {
      const { index, alt } = action.payload;
      if (state.postMedia && state.postMedia[index]) {
        state.postMedia[index].alt = alt;
      }
    },
    addMediaUserTag: (state, action) => {
      const { username, coordinates } = action.payload;
      const index = state.activeIndex;
    
      if (state.postMedia && index !== null && state.postMedia[index]) {
        const currentMedia = state.postMedia[index];
        currentMedia.tagged_user = [
          ...(currentMedia.tagged_user || []),
          { username, coordinates }
        ];
      }
    },
    removeMediaUserTag: (state, action) => {
      const index = state.activeIndex;
    
      if (state.postMedia && index !== null && state.postMedia[index]) {
        const currentMedia = state.postMedia[index];
        if(!currentMedia.tagged_user) return
        currentMedia.tagged_user = currentMedia.tagged_user.filter((item)=> item.username != action.payload ? true : false)
      }
    },
    moveMediaUserTagCoordinates: (state, action) => {
      const index = state.activeIndex;
      if (state.postMedia && index !== null && state.postMedia[index]) {
        const currentMedia = state.postMedia[index];
        if(!currentMedia.tagged_user) return
        currentMedia.tagged_user = currentMedia.tagged_user.map((item) => {
          if (item.username !== action.payload.username) return item;
        
          const newCoordinates = {
            x: item.coordinates.x + action.payload.coordinates.x,
            y: item.coordinates.y + action.payload.coordinates.y
          };
        
          return {
            ...item,
            coordinates: newCoordinates
          };
        });
      }
    },
    changeAddingTaggedUser: (state, action) => {
      state.addingTaggedUser = action.payload
    },
    changeAddingTagCoordinates: (state, action) => {
      state.addingTagCoordinates = action.payload
    },
    
    
  },
});

export const { addPostMedia, changeActiveIndex, deleteActiveIndex, swapPostMedia, updateImageTransform, saveCroppedImage, changeMediaAlt, addMediaUserTag, changeAddingTaggedUser, changeAddingTagCoordinates, removeMediaUserTag, moveMediaUserTagCoordinates} = createPostSlice.actions;
export default createPostSlice.reducer;