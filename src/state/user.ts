import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export type UserState = {
  ip: string;
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
  ip: "",
  counter: 0,
  location: {},
  weatherChange: {},
};
const syncWithLocalStorage = {
  ip: true,
  counter: true,
};

// To avoid NextJS Hydration errors - we must fetch data or access local storage inside useEffect.
// Alternatively, a function can be passed to createSlice instead of the typical initialState object,
// but that does not work with SSR (even in "use client" components).
// ```initialState: () => syncData(initialState);```
export const useSyncUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    // sync from local storage
    const local: Partial<UserState> = {};
    local.counter = parseInt(window.localStorage.getItem("counter") || "0");
    local.ip = window.localStorage.getItem("ip") || "";
    dispatch({ type: "user/set", payload: local });
    // sync from server
    (async () => {
      const remote = await fetchUserData();
      dispatch({ type: "user/set", payload: remote });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // initial or current state
  return useSelector((state: { user: UserState }) => state.user);
};
const fetchUserData = async () => {
  console.log("useFetchUserData");
  const user: Partial<UserState> = {};
  const jsDateTomorrow = new Date();
  jsDateTomorrow.setDate(new Date().getDate() + 1);
  const jsDateYesterday = new Date();
  jsDateYesterday.setDate(new Date().getDate() - 1);
  const strTomorrow = jsDateTomorrow.toISOString().split("T")[0];
  const strYesterday = jsDateYesterday.toISOString().split("T")[0];
  //
  // ip
  const ipData = await fetch("https://api.ipify.org?format=json&dateCache=${strTomorrow}", {
    // cache: "force-cache", // add a wrapper function that caches the result from fetch
  }).then((res) => res.json());
  user.ip = ipData.ip;
  //
  // location
  const locationData = await fetch(`http://ip-api.com/json/${user.ip}?dateCache=${strTomorrow}`, {
    // cache: "force-cache", // add a wrapper function that caches the result from fetch
  }).then((res) => res.json());
  if (!user.location) user.location = {};
  user.location.countryName = locationData.country;
  user.location.countryCode = locationData.countryCode;
  user.location.regionCode = locationData.region;
  user.location.regionName = locationData.regionName;
  user.location.city = locationData.city;
  user.location.lat = locationData.lat;
  user.location.lon = locationData.lon;
  user.location.timezone = locationData.timezone;
  //
  // weather
  const url = `https://meteostat.p.rapidapi.com/point/daily?lat=${user.location.lat}&lon=${user.location.lon}&start=${strYesterday}&end=${strTomorrow}`;
  console.log("get weather", url);
  const weatherData = await fetch(url, {
    cache: "force-cache", // this will auto-clear every day
    headers: {
      "x-rapidapi-host": "meteostat.p.rapidapi.com",
      "x-rapidapi-key": "11dc13858emshc2393c506bb7d52p12d7e3jsnc48d54772625",
    },
  }).then((res) => res.json());
  if (!user.weatherChange) user.weatherChange = {};
  const w0 = weatherData.data[0];
  const w1 = weatherData.data[1];
  const w2 = weatherData.data[2];
  user.weatherChange.prcpToday = w1.prcp < w0.prcp ? "Sunnier" : w1.prcp > w0.prcp ? "Rainier" : "Same";
  user.weatherChange.prcpTomorrow = w2.prcp < w1.prcp ? "Sunnier" : w2.prcp > w1.prcp ? "Rainier" : "Same";
  user.weatherChange.tempToday = w1.temp < w0.temp ? "Cooler" : w1.temp > w0.temp ? "Warmer" : "Same";
  user.weatherChange.tempTomorrow = w2.temp < w1.temp ? "Cooler" : w2.temp > w1.temp ? "Warmer" : "Same";
  user.weatherChange.wspdToday = w1.wspd < w0.wspd ? "Calmer" : w1.wspd > w0.wspd ? "Windier" : "Same";
  user.weatherChange.wspdTomorrow = w2.wspd < w1.wspd ? "Calmer" : w2.wspd > w1.wspd ? "Windier" : "Same";
  // done
  return user;
};

/* Choose one of 2 ways to update the state: */
/**
 * 1) edit user state - set any subset of properties
 * ```
 *   const setUser = useSetUser();
 *   onClick={() => setUser({counter: user.counter + 1})}
 * ```
 */
export const useSetUser = () => {
  const dispatch = useDispatch();
  return (user: UserState) => dispatch({ type: "user/set", payload: user });
};
/**
 * 2) or set individual properties
 * ```
 *   const setUserCounter = useSetUserCounter();
 *   onClick={() => setUserCounter(user.counter + 1)}
 * ```
 */
export const useSetUserCounter = () => {
  const dispatch = useDispatch();
  return (counter: UserState["counter"]) => dispatch({ type: "user/set", payload: { counter } });
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
