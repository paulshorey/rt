"use client";
import React from "react";
import type { RootState } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "./userSlice";
import classes from "./User.module.css";

function User() {
  const count = useSelector((state: RootState) => state.user.counter);
  const dispatch = useDispatch();

  return (
    <div className={"relative mt-10 p-10 border-red-500 border-[1px] " + classes.wrapper}>
      <div className={"w-full "}>
        <div className="flex justify-center gap-5">
          <button className="border-1px" aria-label="Increment value" onClick={() => dispatch(increment())}>
            +
          </button>
          <span>{count}</span>
          <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
            -
          </button>
        </div>
      </div>
    </div>
  );
}

export default User;