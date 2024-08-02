import useApp from "@/context/context";
import React from "react";
import { Outlet } from "react-router-dom";
import { AddCard, List_Card } from "@/components";
import { useQuery } from "@tanstack/react-query";
import TodoApi from "@/Api/Todo";
import { toast } from "sonner";

function List() {
  const { mode } = useApp();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["lists"],
    queryFn: async () => await TodoApi.getLists(),
  });
  React.useEffect(() => {}, [data]);
  if (isError) {
    toast.error(error);
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="fixed bottom-1/2 right-[42%] z-[70] translate-x-1/2 translate-y-1/2">
        <Outlet />
      </div>
      <div
        className={`text-6xl font-bold ${mode === "dark" ? "text-darkText" : "text-dark"}`}
      >
        List
      </div>
      <div className="mt-6 grid h-full w-full flex-1 grid-cols-4 gap-6">
        <AddCard navLink={"add-list"} />
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

export default List;
