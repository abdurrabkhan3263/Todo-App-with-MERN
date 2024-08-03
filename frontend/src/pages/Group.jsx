import React from "react";
import { AddCard, List_Card } from "@/components";
import { Outlet } from "react-router-dom";
import useApp from "@/context/context";
import { useQuery } from "@tanstack/react-query";

function Group() {
  const { mode } = useApp();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["group"],
    queryFn: async () => "",
  });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="fixed bottom-1/2 right-[42%] z-[70] translate-x-1/2 translate-y-1/2">
        <Outlet />
      </div>
      <div
        className={`text-6xl font-bold ${mode === "dark" ? "text-darkText" : "text-dark"}`}
      >
        Group
      </div>
      <div className="mt-6 grid h-full w-full flex-1 grid-cols-4 gap-6">
        <AddCard navLink={"add-group"} />
        {isLoading
          ? "Loading......"
          : Array.isArray(data) &&
            data.length > 0 &&
            data.map(({ _id, listName, description, theme }) => (
              <div key={_id}>
                <List_Card
                  title={listName}
                  content={description || ""}
                  color={theme}
                  id={_id}
                />
              </div>
            ))}
      </div>
    </div>
  );
}

export default Group;
