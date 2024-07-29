import useApp from "@/context/context";
import { Todo_Card } from "@/components";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import TodoApi from "@/Api/Todo";

function Important() {
  const { mode } = useApp();
  const { data, isLoading } = useQuery({
    queryKey: ["getImpTodo"],
    queryFn: async () => await TodoApi.getImportantTodo(),
  });
  return (
    <div className="flex h-full w-full flex-col">
      <div
        className={`text-6xl font-bold ${mode === "dark" ? "text-darkText" : "text-dark"}`}
      >
        Important Todo
      </div>
      <div className="mt-6 grid h-full w-full flex-1 grid-cols-4 gap-6">
        {isLoading
          ? "Loading......"
          : Array.isArray(data) && data.length > 0
            ? data.map(
                ({ _id, todoName, content, isCompleted, isImportant }) => (
                  <div key={_id}>
                    <Todo_Card
                      title={todoName}
                      content={content}
                      isCompleted={isCompleted}
                      isImportant={isImportant}
                      id={_id}
                    />
                  </div>
                ),
              )
            : "No Important found"}
      </div>
    </div>
  );
}

export default Important;
