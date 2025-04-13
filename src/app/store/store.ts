import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./slices/postSlice";
import userReducer from "./slices/userSlice";
import searchReducer from "./slices/searchSlice";
import notificationReducer from "./slices/notificationSlice";
import createPostReducer from "./slices/postUploadSlice";

export const store = configureStore({
  reducer: {
    popupPost: postReducer,
    currentUser:userReducer,
    searchInfo:searchReducer,
    notificationInfo:notificationReducer,
    createData:createPostReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;