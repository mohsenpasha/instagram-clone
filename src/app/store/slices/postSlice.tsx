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

type postPopupType = {
  url:string | null,
  postDetail:postDetail,
  listTitle:string | null,
  listUrl:string | null,
  commentId:string | null,
  userList:[] | null,
  commentList:null,
  replied_to:{id:string,username:string} | null,
  commentHoverIsLoading:boolean,
  postList:[],
  postListUrl: string | null
}
const initialState : postPopupType = {
  url: null,
  postDetail:null,
  postList:[],
  postListUrl:null,
  listUrl:null,
  listTitle:null,
  userList:null,
  commentId:null,
  commentList:[],
  replied_to:null,
  commentHoverIsLoading:false
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
    changePostListUrl: (state, action) => {
      state.postListUrl = action.payload; 
    },
    addPostList: (state, action) => {
      action.payload.map((item)=>{
        item.activeStatus = false
        state.postList = [...state.postList,item];
      })
    },
    likeActivePostList: (state) => {
        state.postList = state.postList.map((item)=>{
          if(item.activeStatus){
            item.is_liked = true
            item.like_count += 1

          }
          return item
        })
    },
    saveActivePostList: (state) => {
        state.postList = state.postList.map((item)=>{
          if(item.activeStatus){
            item.is_saved = true
          }
          return item
        })
    },
    unsaveActivePostList: (state) => {
        state.postList = state.postList.map((item)=>{
          if(item.activeStatus){
            item.is_saved = false
          }
          return item
        })
    },
    unlikeActivePostList: (state) => {
      state.postList = state.postList.map((item)=>{
        if(item.activeStatus){
          item.is_liked = false
          item.like_count -= 1
        }
        return item
      })
  },
    activatePostListStatus: (state, action) => {
      state.postList = state.postList.map((item)=>{
        if(action.payload == item.id){
          item.activeStatus = true
        }
        else{
          item.activeStatus = false
        }
        return item
      })
    },
    clearPostList: (state) => {
      state.postList = [];
    },
    increasePostListCommentCount: (state) => {
      state.postList = state.postList.map((item)=>{
        if(item.activeStatus){
          item.comment_count += 1
        }
        return item
      })
    },
    changeListUrl: (state, action) => {
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
                if(!item.like_count){
                  item.like_count = 0
                }
                item.like_count += 1
              }
            }
            else{
              if(item.is_liked){
                item.is_liked = false
                if(item.like_count - 1 == 0){
                  item.like_count = null
                }
                else{
                  item.like_count -= 1
                }
              }
            }
          }
        })
      }
    },
    toggleLikeReplyComment: (state,action) => {
      if(!state.commentList) return
        state.commentList.map((item)=>{
          if(item.id != action.payload.commentId) return
            item.replyList.map((replyItem)=>{
              if(replyItem.id != action.payload.replyId) return
              if(action.payload.action == 'like'){
                if(!replyItem.is_liked){
                  replyItem.is_liked = true
                  if(replyItem.like_count){
                    replyItem.like_count += 1
                  }
                  else{
                    replyItem.like_count = 1
                  }
                }
              }
              else{
                if(replyItem.is_liked){
                  replyItem.is_liked = false
                  if(replyItem.like_count == 1){
                    replyItem.like_count = null
                  }
                  else{
                    replyItem.like_count -= 1
                  }
                }
              }
            })
        })
    },
    changeCommentId: (state, action) => {
      state.commentId = action.payload
    },
    addPostDetail: (state, action) => {
      state.postDetail = action.payload;
    },
    changeRepliedTo: (state, action) => {
      state.replied_to = action.payload;
    },
    toggleCommentHoverLoading: (state, action) => {
      state.commentHoverIsLoading = action.payload;
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
    addReplyList: (state, action) => {
      if (!state.commentList) return;
      state.commentList = state.commentList.map((item) => {
          if (action.payload.id === item.id) {
              return {
                  ...item,
                  replyList: [
                      ...(item.replyList || []),
                      action.payload.newReply
                  ]
              };
          }
          return item;
      });
  },
  increaseReplyCount: (state, action) => {
    if (!state.commentList) return;
    state.commentList = state.commentList.map((item) => {
        if (action.payload === item.id) {
          if(!item.reply_count){
            item.reply_count = 0
          }
          item.reply_count += 1
            return item
        }
        return item;
    });
},
increaseCommentCount: (state) => {
  if (!state.postDetail) return;
  state.postDetail.comment_count += 1
},
  clearReplyList: (state, action) => {
    if (!state.commentList) return;
    state.commentList = state.commentList.map((item) => {
        if (action.payload === item.id) {
            item.replyList = null
        }
        return item;
    });
},
    addCommentList: (state, action) => {
      console.log(state.commentList)
      console.log(action.payload)
      if (state.commentList) {
        state.commentList = [
            ...state.commentList, 
            ...action.payload
        ];
      } else {
        state.commentList = action.payload
      }
    },
    clearCommentList: (state) => {
        state.commentList = null
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
    followPostListUser: (state, action) => {
      state.postList.map((item)=>{
        if(item.user.username == action.payload.username){
          if(action.payload.action == 'follow'){
            item.user.is_following = true
          }
          else{
            item.user.is_following = false
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

export const { remove, changeUrl, addPostDetail ,likePost, unlikePost, savePost, unsavePost, changeListUrl, changeListTitle, addUserList, followUserList, listToggleIsLoading, clearUserList, addCommentList, changeCommentId, toggleLikeComment, toggleLikeReplyComment, addReplyList, clearReplyList, changeRepliedTo, increaseReplyCount, toggleCommentHoverLoading, increaseCommentCount, clearCommentList, addPostList, changePostListUrl, clearPostList ,activatePostListStatus, likeActivePostList, unlikeActivePostList, followPostListUser, saveActivePostList,unsaveActivePostList, increasePostListCommentCount} = postSlice.actions;
export default postSlice.reducer;