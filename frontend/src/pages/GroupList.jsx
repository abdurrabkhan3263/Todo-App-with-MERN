import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import TodoApi from "@/Api/Todo";
import { AddCard } from "@/components";
import { List_Card } from "@/components";
import useApp from "@/context/context";

function GroupList() {
  const { id } = useParams();
  const { mode } = useApp();
  const {
    data: { data } = "",
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allGroupList"],
    queryFn: async () => await TodoApi.getGroupList(id),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div
        className={`text-6xl font-bold ${mode === "dark" ? "text-darkText" : "text-dark"}`}
      >
        {data?.name || ""}
      </div>
      <div className="mt-6 grid h-full w-full flex-1 grid-cols-4 gap-6">
        {Array.isArray(data?.lists) &&
          data?.lists.length > 0 &&
          data?.lists.map(({ _id, listName, description, theme }) => (
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

export default GroupList;
