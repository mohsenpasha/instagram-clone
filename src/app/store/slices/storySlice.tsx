import { createSlice } from "@reduxjs/toolkit";

type singleStoryType = {
  file:string,
  media_type: 'image' | 'video',
  created_at:{
     t_ago: string,
      t: string
  }
}
type storyType = {
  storyToggle:boolean,
  userStories: null | []
  storiesHolder: null | [
    {
      activeStatus:boolean,
      stories:[singleStoryType]
    }
  ],
  storyListType: null | 'userStory' | 'highlighs' | 'homeStories',
  isStoryMuted:boolean,
}

const initialState : storyType = {
  storyToggle:false,
  userStories: null,
  storiesHolder : null,
  storyListType: null,
  isStoryMuted:true
};

const storySlice = createSlice({
  name: "storySlice",
  initialState,
  reducers: {
    changeStoryToggle: (state, action) => {
      state.storyToggle = action.payload
    },
    changeStoryType: (state, action) => {
      state.storyListType = action.payload
    },
    changeUserStories: (state, action) => {
      state.userStories = action.payload.map((item)=>{
        item.activeStatus = false
        return item
      })
    },
    seenUserStories: (state, action) => {
      if(!state.userStories) return
      state.userStories = state.userStories.map((item,index)=>{
        if(index > action.payload){
          item.activeStatus = false
        }
        else{
          item.activeStatus = true
        }
        return item
      })
    },
    resetUserStories: (state) => {
      if(!state.userStories) return
      state.userStories = state.userStories.map((item,index)=>{
          item.activeStatus = false
        return item
      })
    },
    clearUserStories: (state) => {
      state.userStories = null
    },
    changeStoriesHolder: (state, action) => {
      state.storiesHolder = action.payload.map((item)=>{
        item.activeStatus = false
        item.stories = item.stories.map((story)=>{
          story.activeStatus = false
          return story
        })
        return item
      })
    },
    activateStoriesHolder: (state, action) => {
      if(!state.storiesHolder) return
      state.storiesHolder = state.storiesHolder.map((item,index)=>{
        if(index != action.payload){
          item.activeStatus = false
        }
        else{
          item.activeStatus = true
        }
        return item
      })
    },
    seenStoriesHolderStory: (state, action) => {
      if(!state.storiesHolder) return
      state.storiesHolder = state.storiesHolder.map((item,index)=>{
        if(index != action.payload[0]){
          item.activeStatus = false
          return item
        }
        item.stories = item.stories.map((story,storyIndex)=>{
          if(storyIndex > action.payload[1]){
            story.activeStatus = false
          }
          else{
            story.activeStatus = true
          }
          return story
        })
        item.activeStatus = true
        return item
      })
    },
    resetStoriesHolder: (state) => {
      if(!state.storiesHolder) return
      state.storiesHolder = state.storiesHolder.map((item,index)=>{
        item.activeStatus = false
        item.stories = item.stories.map((story)=>{
          story.activeStatus = false
          return story
        })
        item.activeStatus = true
        return item
      })
    },
    clearStoriesHolder: (state) => {
      state.storiesHolder = null
    },
    changeIsStoryMuted: (state, action) => {
      state.isStoryMuted = action.payload
    },
  },
});

export const { changeStoryToggle, changeStoryType, changeUserStories, clearUserStories, changeStoriesHolder, clearStoriesHolder, activateStoriesHolder, seenStoriesHolderStory, changeIsStoryMuted, resetStoriesHolder, seenUserStories, resetUserStories} = storySlice.actions;
export default storySlice.reducer;