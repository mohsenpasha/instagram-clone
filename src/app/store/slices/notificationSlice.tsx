import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";


const initialState : {notificationList:{}[],isNotificationCloseAnimationStarted:boolean} = {
  notificationList:[],
  isNotificationCloseAnimationStarted:false
};

const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState,
  reducers: {
    addNotification: (state,action) =>{
      try{
        state.notificationList = [...state.notificationList,...action.payload]
      }
      catch{
        state.notificationList = [action.payload,...state.notificationList]
      }
    },
    toggleNotification: (state,action) =>{
      state.isNotificationCloseAnimationStarted = action.payload
    },
    seenMessages: (state) => {
      state.notificationList = state.notificationList.map((item) => ({
        ...item,
        is_read: true
      }));
    },
  },
});

export const { addNotification, toggleNotification, seenMessages} = notificationSlice.actions;
export default notificationSlice.reducer;