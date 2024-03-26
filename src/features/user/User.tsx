"use client";

import React, { useEffect } from "react";
import classes from "./User.module.css";
import { useSyncUser, useSetUserCounter } from "@/state/user";

function User() {
  const user = useSyncUser();
  const setUserCounter = useSetUserCounter();

  return (
    <div className={"mt-10 p-10 border-red-500 border-[1px] text-center " + classes.wrapper}>
      <div className={"w-full "}>
        <div>Counter (saved in local storage):</div>
        <div className="pt-2 flex justify-center gap-5">
          <button className="border rounded px-2 border-gray-300 shadow-sm" aria-label="Decrement value" onClick={() => setUserCounter(user.counter - 1)}>
            -
          </button>
          <b>{user.counter}</b>
          <button className="border rounded px-2 border-gray-300 shadow-sm" aria-label="Increment value" onClick={() => setUserCounter(user.counter + 1)}>
            +
          </button>
        </div>
        <div className={"mt-7 " + (!user.ipAddress ? "invisible" : "")}>
          <div>Your IP: </div>
          <div className="pt-1">
            <b>{user.ipAddress}</b>
          </div>
        </div>
        <div className={"mt-7 " + (!user.location.countryName ? "invisible" : "")}>
          <div>Your location:</div>
          <div className="pt-1">
            <b>
              {user.location.city} {user.location.regionCode}, {user.location.countryName}
            </b>
          </div>
        </div>
        <div className={"mt-7 " + (!user.weatherChange.prcpToday ? "invisible" : "")}>
          <div>Weather today:</div>
          <WeatherReport which={"☀️"} change={user.weatherChange.prcpToday} />
          <WeatherReport which={"🌡️"} change={user.weatherChange.tempToday} />
          <WeatherReport which={"💨"} change={user.weatherChange.wspdToday} />
        </div>
        <div className={"mt-7 " + (!user.weatherChange.prcpTomorrow ? "invisible" : "")}>
          <div>Tomorrow:</div>
          <WeatherReport which={"☀️"} change={user.weatherChange.prcpTomorrow} />
          <WeatherReport which={"🌡️"} change={user.weatherChange.tempTomorrow} />
          <WeatherReport which={"💨"} change={user.weatherChange.wspdTomorrow} />
        </div>
      </div>
    </div>
  );
}

export default User;

function WeatherReport({ change = "", which = "" }) {
  if (!change || change === "Same") return null;
  return (
    <div className="pt-0">
      {which} <b>{change}</b>
    </div>
  );
}
