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
  userHighlights: null | [
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
  userHighlights : null,
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
      state.userStories = action.payload
    },
    clearUserStories: (state) => {
      state.userStories = null
    },
    changeUserHighlights: (state, action) => {
      state.userHighlights = action.payload.map((item)=>{
        item.activeStatus = false
        item.stories = item.stories.map((story)=>{
          story.activeStatus = false
          return story
        })
        return item
      })
    },
    activateHighlight: (state, action) => {
      if(!state.userHighlights) return
      state.userHighlights = state.userHighlights.map((item,index)=>{
        if(index != action.payload){
          item.activeStatus = false
        }
        else{
          item.activeStatus = true
        }
        return item
      })
    },
    seenHighlightStory: (state, action) => {
      if(!state.userHighlights) return
      state.userHighlights = state.userHighlights.map((item,index)=>{
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
    resetHighlightStory: (state) => {
      if(!state.userHighlights) return
      state.userHighlights = state.userHighlights.map((item,index)=>{
        item.activeStatus = false
        item.stories = item.stories.map((story)=>{
          story.activeStatus = false
          return story
        })
        item.activeStatus = true
        return item
      })
    },
    clearUserHighlights: (state) => {
      state.userHighlights = null
    },
    changeIsStoryMuted: (state, action) => {
      state.isStoryMuted = action.payload
    },
    
  },
});

export const { changeStoryToggle, changeStoryType, changeUserStories, clearUserStories, changeUserHighlights, clearUserHighlights, activateHighlight, seenHighlightStory, changeIsStoryMuted, resetHighlightStory} = storySlice.actions;
export default storySlice.reducer;