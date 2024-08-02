import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TodoApi from "@/Api/Todo";
import { useNavigate } from "react-router-dom";
import useApp from "@/context/context";

function AddTodo() {
  const { register, handleSubmit, setValue } = useForm();
  const { mode } = useApp();
  const navigate = useNavigate();
  const client = useQueryClient();

  const handleFormMutation = useMutation({
    mutationKey: ["crTodo"],
    mutationFn: async (data) => TodoApi.createTodo(data),
    onSuccess: async (result) => {
      toast.success(result.message);
      setValue("content", "");
      setValue("todoName", "");
      setValue("remindMe", "");
      setValue("dueDate", "");
      client.invalidateQueries({ queryKey: ["todos"] });
    },
    onMessage: async (result) => toast.success(result.message),
  });

  const formSubmit = (data) => {
    handleFormMutation.mutate(data);
  };

  return (
    <div
      className={`flex h-[70vh] w-[27vw] flex-col items-center ${mode === "dark" ? "border-white" : "border-gray-700"} justify-between rounded-xl border bg-slate-300 p-5 shadow-lg`}
    >
      <div className="flex h-12 w-full items-center justify-between">
        <p className="text-3xl font-semibold text-gray-700">Todo</p>
        <button className="h-full" onClick={() => navigate("/")}>
          <X width={"35px"} height={"35px"} />
        </button>
      </div>
      <div className="w-full flex-1 pt-3">
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="flex h-full flex-col justify-between"
        >
          <div className="flex flex-col gap-y-6">
            <div>
              <label htmlFor="todo_name">Todo name</label>
              <Input id="todo_name" {...register("todoName")} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="des">Todo description</label>
              <textarea
                id="des"
                className="h-[110px] resize-none rounded-md p-2 outline-none ring-darkCard focus:ring-1"
                {...register("content", { required: true })}
              ></textarea>
            </div>
            <div className="flex flex-col">
              <label htmlFor="remind_me">Remind me</label>
              <input
                type="datetime-local"
                id="remind_me"
                className="rounded-md px-3 py-2 outline-none ring-darkCard focus:ring-1"
                {...register("remindMe")}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="due_date">Due date</label>
              <input
                type="datetime-local"
                id="due_date"
                className="rounded-md px-3 py-2 outline-none ring-darkCard focus:ring-1"
                {...register("dueDate")}
              />
            </div>
          </div>
          <Button size={"lg"} type={"submit"}>
            Add
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddTodo;
