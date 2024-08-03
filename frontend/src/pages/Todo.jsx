import React from "react";
import { AddCard, Todo_Card } from "@/components";
import useApp from "@/context/context";
import TodoApi from "@/Api/Todo";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

function Todo() {
  const { mode } = useApp();
  const {
    data = "",
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => await TodoApi.getDirectTodo(),
  });
  return (
    <div className="flex h-full w-full flex-col">
      <div className="fixed bottom-1/2 right-[42%] z-[70] translate-x-1/2 translate-y-1/2">
        <Outlet />
      </div>
      <div
        className={`text-6xl font-bold ${mode === "dark" ? "text-darkText" : "text-dark"}`}
      >
        Todo
      </div>
      <div className="mt-6 grid h-full w-full flex-1 grid-cols-4 gap-6">
        <AddCard navLink={"/todo"} />
        {isLoading
          ? "Loading......"
          : Array.isArray(data) &&
            data.length > 0 &&
            data.map(({ _id, todoName, content, isCompleted, isImportant }) => (
              <div key={_id}>
                <Todo_Card
                  title={todoName}
                  content={content}
                  isCompleted={isCompleted}
                  isImportant={isImportant}
                  id={_id}
                  belongsTo={"todo"}
                />
              </div>
            ))}
      </div>
    </div>
  );
}

export default Todo;
