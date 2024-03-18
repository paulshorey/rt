import { configureStore } from "@reduxjs/toolkit";
import userReducer, { UserState } from "./user";
// import logger from "redux-logger";

export type RootState = {
  user: UserState;
};
export const reducers = {
  user: userReducer,
};

export const store = configureStore({
  reducer: reducers,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type AppDispatch = typeof store.dispatch;
