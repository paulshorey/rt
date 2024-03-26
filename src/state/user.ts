import { userQuery } from "@/requests/userQuery";
import { create } from "zustand";

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
  // Methods
  fetchData: () => UserState;
  setCounter: (counter: UserState["counter"]) => void;
};

/**
 * Temporary, not exported
 */
const initialState = {
  ipAddress: "",
  counter: 0,
  clicks: 0,
  reloads: 0,
  location: {},
  weatherChange: {},
};

/**
 * User store (state and actions in one)
 */
export const userStore = create((set: (newState: Partial<UserState>) => void, get: () => UserState) => ({
  ...initialState,

  /**
   * Get latest state from local storage and server
   */
  fetchData: () => {
    // fetchData from local storage
    const local = {} as UserState;
    local.counter = parseInt(window.localStorage.getItem("user.counter") || "0");
    set(local);
    // fetchData from server
    userQuery().then((remote: Partial<UserState>) => {
      // persist
      window.localStorage.setItem("user.ipAddress", remote.ipAddress || "");
      // update
      set(remote);
    });
    // current state
    return get();
  },

  /**
   * Set counter
   */
  setCounter: (counter: UserState["counter"]) => {
    window.localStorage.setItem("user.counter", counter.toString());
    set({ counter });
  },
}));
