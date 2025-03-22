import { createSlice } from "@reduxjs/toolkit";

type postDetail = null | {
    is_saved:boolean,
    is_liked:boolean,
    caption:string,
    like_count:number,
    user:{
        username:string,
        profile_pic:string,
        like_count:number
    },
    media:[{
        file:string,
        media_type: 'image' | 'video',
    }]
}

const initialState : {url:string | null,postDetail:postDetail,likeUrl:string | null,userList:[] | null} = {
  url: null,
  postDetail:null,
  likeUrl:null,
  userList:null
};

const postSlice = createSlice({
  name: "popupPost",
  initialState,
  reducers: {
    remove: (state) => {
      state.url = null;
      state.postDetail=null
    },
    changeUrl: (state, action) => {
      state.url = action.payload; 
    },
    changeLikeUrl: (state, action) => {
      state.likeUrl = action.payload; 
    },
    addPostDetail: (state, action) => {
      state.postDetail = action.payload;
    },
    likePost: (state) => {
      if(state.postDetail){
        if(!state.postDetail.is_liked){
          state.postDetail.is_liked = true
          state.postDetail.like_count += 1
        }
      }
    },
    unlikePost: (state) => {
      if(state.postDetail){
        if(state.postDetail.is_liked){
          state.postDetail.is_liked = false  
          state.postDetail.like_count -= 1
        }
      }
    },
    savePost: (state) => {
      if(state.postDetail){
          state.postDetail.is_saved = true
      }
    },
    unsavePost: (state) => {
      if(state.postDetail){
          state.postDetail.is_saved = false
      }
    },
    clearUserList: (state) => {
      state.userList = null
    },
    addUserList: (state, action) => {
      if (state.userList) {
        state.userList = [
            ...state.userList, 
            ...action.payload.map(like => ({ ...like, isLoading: false }))
        ];
      } else {
          state.userList = action.payload.map(like => ({ ...like, isLoading: false }));
      }
    },
    followUserList: (state, action) => {
      state.userList.map((item)=>{
        if(item.username == action.payload.username){
          if(action.payload.action == 'follow'){
            item.is_following = true
          }
          else{
            item.is_following = false
          }
        }
      })
    },
    toggleIsLoading: (state, action) => {
      state.userList.map((item)=>{
        if(item.username == action.payload.username){
          item.isLoading = action.payload.result
        }
      })
    },
  },
});

export const { remove, changeUrl, addPostDetail ,likePost, unlikePost, savePost, unsavePost, changeLikeUrl, addUserList, followUserList, toggleIsLoading, clearUserList} = postSlice.actions;
export default postSlice.reducer;