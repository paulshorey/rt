"use client";

import React from "react";
import { userStore } from "@/state/user";

type Props = {};

function Header({}: Props) {
  const user = userStore();
  return (
    <nav className="flex justify-between items-center px-5 py-3 border-b-black border-b-[1px]">
      <a
        href="https://github.com/paulshorey/nextjs-state-management"
        target="_blank"
        className="px-4 py-2 border-[1px] border-black rounded-full hover:shadow-md transition-all duration-200 hover:bg-gray-100"
      >
        GitHub
      </a>
      <span>
        <span>#{user.counter}</span>
        <span className="pl-2">
          {user.location.regionCode}, {user.location.countryCode}
        </span>
        <span className="pl-2">
          {user.weatherChange.prcpToday === "Sunnier" && "☀️"}
          {user.weatherChange.prcpToday === "Rainier" && "☁️"}
          {user.weatherChange.tempToday === "Warmer" && "🥰"}
          {user.weatherChange.tempToday === "Cooler" && "🥶"}
          {user.weatherChange.wspdToday === "Windier" && "💨"}
          {user.weatherChange.wspdToday === "Calmer" && "🙂"}
        </span>
      </span>
    </nav>
  );
}

export default Header;
