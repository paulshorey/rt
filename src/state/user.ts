import { useQuery } from "react-query";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export type UserState = {
  ip: string;
  counter: number;
};
const initialState = {
  ip: "",
  counter: 0,
};
const syncWithLocalStorage = {
  ip: true,
  counter: true,
};

// To avoid NextJS Hydration errors - we must fetch data or access local storage inside useEffect.
// Alternatively, a function can be passed to createSlice instead of initialState, but that does not work with SSR.
// ```const getInitialState = () => syncFromLocalStorage(initialState);```
export const useUser = () => {
  const dispatch = useDispatch();
  // initial or current state
  const user = { ...useSelector((state: { user: UserState }) => state.user) };
  // sync with local storage
  useEffect(() => {
    if (typeof window === "object") {
      user.counter = parseInt(window.localStorage.getItem("counter") || "0");
      user.ip = window.localStorage.getItem("ip") || "";
    }
    dispatch({ type: "user/set", payload: user });
  }, []);
  // fetch user ip
  useFetchUserIp();
  return user;
};

// There are 2 techniques to update the state:
// 1) edit user state - set any subset of properties
export const useSetUser = () => {
  const dispatch = useDispatch();
  return (user: UserState) => dispatch({ type: "user/set", payload: user });
};
// 2) or set individual properties
export const useSetUserCounter = () => {
  const dispatch = useDispatch();
  return (counter: UserState["counter"]) => dispatch({ type: "user/set", payload: { counter } });
};
export const useFetchUserIp = async () => {
  const dispatch = useDispatch();
  useQuery("user.ip", () => fetch("https://api.ipify.org?format=json").then((res) => res.json()), {
    onSuccess: (data) => {
      dispatch({ type: "user/set", payload: { ip: data.ip } });
    },
    onError: (error) => {
      console.error("error", error);
    },
  });
};

export default createSlice({
  name: "user",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<UserState>) => {
      const user = { ...state, ...action.payload };
      if (typeof window === "object") {
        for (let key in syncWithLocalStorage) {
          window.localStorage.setItem(key, user[key as keyof UserState].toString());
        }
      }
      return user;
    },
  },
}).reducer;
