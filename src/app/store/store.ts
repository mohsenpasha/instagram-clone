import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./slices/postSlice";
import userReducer from "./slices/userSlice";
import searchReducer from "./slices/searchSlice";

export const store = configureStore({
  reducer: {
    popupPost: postReducer,
    currentUser:userReducer,
    searchInfo:searchReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;