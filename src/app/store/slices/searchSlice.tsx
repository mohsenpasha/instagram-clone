import { createSlice } from "@reduxjs/toolkit";


const initialState : {isSearchLoading:boolean,isSearchCloseAnimationStarted:boolean,searchChangeList:null | [],searchHistory: [],searchType:('user' | 'tag') | null} = {
  isSearchCloseAnimationStarted: false,
  searchChangeList:null,
  searchHistory:[],
  searchType: null,
  isSearchLoading:false
};

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    changeSearchChange: (state, action) => {
      state.searchChangeList = action.payload
    },
    changeSearchType: (state, action) => {
      state.searchType = action.payload
    },
    toggleSearch: (state, action) => {
      state.isSearchCloseAnimationStarted = action.payload
    },
    toggleSearchLoading: (state, action) => {
      state.isSearchLoading = action.payload
    },
    addSearchHistory: (state, action) => {
      const clearedHistory = state.searchHistory.filter((item)=>{
        if(item.type == action.payload.type && item.id == action.payload.id){
          return false
        }
        return true
      })
      console.log(clearedHistory)
      state.searchHistory = [...clearedHistory,action.payload]
    },
    clearSearchHistory: (state) => {
      state.searchHistory = []
    },
    removeSearchHistoryItem: (state, action) => {
      const newSearchHistory = state.searchHistory.filter((item)=>{
        if(item.type == action.payload.type && item.id == action.payload.id){
          return false
        }
        else{
          return true
        }
      })
      state.searchHistory = newSearchHistory
    },
  },
});

export const { changeSearchChange, changeSearchType, addSearchHistory, clearSearchHistory, removeSearchHistoryItem, toggleSearch, toggleSearchLoading} = searchSlice.actions;
export default searchSlice.reducer;