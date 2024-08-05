import React from "react";
import { AddCard, Group_Card, List_Card } from "@/components";
import { Outlet } from "react-router-dom";
import useApp from "@/context/context";
import { useQuery } from "@tanstack/react-query";
import TodoApi from "@/Api/Todo";

function Group() {
  const { mode } = useApp();

  const {
    data: { data } = "",
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["group"],
    queryFn: async () => TodoApi.getGroup(),
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
        {isLoading ? (
          "Loading......"
        ) : (
          <>
            <AddCard navLink={"add-group"} />
            {Array.isArray(data) && data.length > 0 ? (
              data.map(({ _id, name }) => (
                <div key={_id} className="relative">
                  <Group_Card id={_id} groupName={name} />
                </div>
              ))
            ) : (
              <div className="text-2xl">No Group Found</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Group;
