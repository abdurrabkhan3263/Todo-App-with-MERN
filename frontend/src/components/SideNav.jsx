import React, { useState } from "react";
import { List, ListTodo, Group, Star, Moon, Sun } from "../assets/icons";
import { useContext } from "react";
import { useEffect } from "react";
import useApp from "@/context/context";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

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
  const [activeNav, setActiveNav] = useState(0);
  const { mode } = useApp();

  return (
    <div className="col-span-3 h-full overflow-hidden rounded-2xl bg-lightNav">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-1 flex-col justify-between bg-red-500">
          <h3>Menu</h3>
          <div>
            <p>Tasks</p>
            <div>
              {navInfo.map(({ name, Icon, path }) => (
                <Link to={path} key={name}>
                  {<Icon />}
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="h-16 bg-blue-500">Login things</div>
      </div>
    </div>
  );
}

export default SideNav;
