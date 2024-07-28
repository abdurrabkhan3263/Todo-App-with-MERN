import React, { useState } from "react";
import {
  List,
  ListTodo,
  Group,
  Star,
  Moon,
  Sun,
  LogOut,
} from "../assets/icons";
import useApp from "@/context/context";
import { Button } from "./ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserApi from "@/Api/User";

const navInfo = [
  {
    name: "Todo",
    Icon: ListTodo,
    path: "/",
  },
  {
    name: "List",
    Icon: List,
    path: "/list",
  },
  {
    name: "Group",
    Icon: Group,
    path: "/group",
  },
  {
    name: "Important",
    Icon: Star,
    path: "/important",
  },
];

function SideNav() {
  const { mode, changeMode, logoutUser } = useApp();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await UserApi.logoutUser();
      toast.success(response?.message);
      logoutUser();
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      logoutUser();
      navigate("/login");
    }
  };
  return (
    <div
      className={`fixed top-1/2 w-[320px] -translate-y-1/2 overflow-hidden rounded-2xl px-4 shadow-xl shadow-[#00000030] ${mode === "light" ? "bg-lightNav" : "border border-white bg-dark text-white"} `}
      style={{ height: "calc(100% - 2rem)" }}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-1 flex-col pt-6">
          <h3 className="text-2xl font-semibold">Menu</h3>
          <div className="pt-14">
            <p className="text-xl font-normal">Tasks</p>
            <div className="flex flex-col gap-y-6 pt-6">
              {navInfo.map(({ name, Icon, path }) => (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    `flex w-full justify-start gap-x-6 rounded-md px-4 shadow-md ${!isActive ? (mode === "light" ? "bg-white text-dark" : "bg-darkBtn text-white") : mode === "light" ? "bg-darkBtn text-white" : "bg-white text-dark"} ${mode === "dark" ? "shadow-[#ffffff40]" : "shadow-[#00000012]"} py-3.5 font-medium`
                  }
                >
                  {<Icon />}
                  {name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-x-4">
            <button onClick={handleLogout}>
              <LogOut width={"35px"} height={"35px"} />
            </button>
            <p className="text-lg font-medium">Sign Out</p>
          </div>
          <Button onClick={() => changeMode()}>{mode}</Button>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
