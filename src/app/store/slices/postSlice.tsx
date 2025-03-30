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

const initialState : {url:string | null,postDetail:postDetail,listTitle:string | null,listUrl:string | null,commentId:string | null,userList:[] | null,commentList:[] | null} = {
  url: null,
  postDetail:null,
  listUrl:null,
  listTitle:null,
  userList:null,
  commentId:null,
  commentList:null
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
    changeListUrl: (state, action) => {
      console.log(action.payload,state.listUrl)
      if(action.payload == state.listUrl) return
      state.listUrl = action.payload; 
    },
    changeListTitle: (state, action) => {
      state.listTitle = action.payload;
    },
    toggleLikeComment: (state,action) => {
      if(state.commentList){
        state.commentList.map((item)=>{
          if(item.id == action.payload.id){
            if(action.payload.action == 'like'){
              if(!item.is_liked){
                item.is_liked = true
                item.like_count += 1
              }
            }
            else{
              if(item.is_liked){
                item.is_liked = false
                item.like_count -= 1
              }
            }
          }
        })
      }
    },
    changeCommentId: (state, action) => {
      state.commentId = action.payload
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
            ...action.payload.map(item => ({ ...item, isLoading: false }))
        ];
      } else {
          state.userList = action.payload.map(item => ({ ...item, isLoading: false }));
      }
    },
    addCommentList: (state, action) => {
      if (state.commentList) {
        state.commentList = [
            ...state.commentList, 
            ...action.payload
        ];
      } else {
        state.commentList = action.payload
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
    listToggleIsLoading: (state, action) => {
      state.userList.map((item)=>{
        if(item.username == action.payload.username){
          item.isLoading = action.payload.result
        }
      })
    },
  },
});

export const { remove, changeUrl, addPostDetail ,likePost, unlikePost, savePost, unsavePost, changeListUrl, changeListTitle,addUserList, followUserList, listToggleIsLoading, clearUserList, addCommentList, changeCommentId, toggleLikeComment} = postSlice.actions;
export default postSlice.reducer;