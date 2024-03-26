import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userQuery } from "@/requests/userQuery";

export type UserState = {
  ipAddress: string;
  counter: number;
  location: {
    countryName?: string;
    countryCode?: string;
    regionCode?: string;
    regionName?: string;
    city?: string;
    lat?: number;
    lon?: number;
    timezone?: string;
  };
  weatherChange: {
    prcpToday?: "Sunnier" | "Rainier" | "Same";
    prcpTomorrow?: "Sunnier" | "Rainier" | "Same";
    tempToday?: "Cooler" | "Warmer" | "Same";
    tempTomorrow?: "Cooler" | "Warmer" | "Same";
    wspdToday?: "Calmer" | "Windier" | "Same";
    wspdTomorrow?: "Calmer" | "Windier" | "Same";
  };
};
const initialState = {
  ipAddress: "",
  counter: 0,
  location: {},
  weatherChange: {},
};

/**
 * Basic usage, display or use values from state
 */
export const useUser = () => useSelector((state: { user: UserState }) => state.user);

let useSyncUserRanOnce = false;
/**
 * Get latest state from local storage and server, also return the state
 * To avoid NextJS Hydration errors - we must fetch data or access local storage inside useEffect.
 * Alternatively, a function can be passed to createSlice instead of the typical initialState object,
 * but that does not work with SSR (even in "use client" components).
 * ```initialState: () => syncData(initialState);```
 */
export const useSyncUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    // run this only once (React 18)
    if (useSyncUserRanOnce) return;
    useSyncUserRanOnce = true;
    // sync from local storage
    const local = {} as UserState;
    let counter = window.localStorage.getItem("user.counter");
    if (counter) local.counter = parseInt(counter);
    dispatch({ type: "user/set", payload: local });
    // sync from server
    userQuery().then((remote) => {
      dispatch({ type: "user/set", payload: remote });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // initial or current state
  return useSelector((state: { user: UserState }) => state.user);
};

/**
 * Edit state
 * ```
 *   const setUserCounter = useSetUserCounter();
 *   onClick={() => setUserCounter(user.counter + 1)}
 * ```
 */
export const useSetUserCounter = () => {
  const dispatch = useDispatch();
  return (counter: UserState["counter"]) => dispatch({ type: "user/set", payload: { counter } });
};

/**
 * User slice
 * https://redux-toolkit.js.org/api/createslice
 */
export default createSlice({
  name: "user",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<UserState>) => {
      const user: UserState = { ...state, ...action.payload };
      return user;
    },
  },
}).reducer;
