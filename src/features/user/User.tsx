"use client";

import React from "react";
import classes from "./User.module.css";
import { useUser, useSetUserCounter } from "@/state/user";

function User() {
  const user = useUser();
  const setUserCounter = useSetUserCounter();

  return (
    <div className={"mt-10 p-10 border-red-500 border-[1px] text-center " + classes.wrapper}>
      <div className={"w-full "}>
        <div>Counter (saved in local storage):</div>
        <div className="pt-2 flex justify-center gap-5">
          <button className="border rounded px-2 border-gray-300 shadow-sm" aria-label="Increment value" onClick={() => setUserCounter(user.counter + 1)}>
            +
          </button>
          <b>{user.counter}</b>
          <button className="border rounded px-2 border-gray-300 shadow-sm" aria-label="Decrement value" onClick={() => setUserCounter(user.counter - 1)}>
            -
          </button>
        </div>
        <div className={"mt-7"}>
          <div>Your IP (API response): </div>
          <div className="pt-1">
            <b>{user.ip}</b>
          </div>
        </div>
        <div className={"mt-7"}>
          <div>
            Weather in your area <br />
            (request sent after the IP response was received):{" "}
          </div>
          <div className="pt-1">
            <b>{user.ip}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
