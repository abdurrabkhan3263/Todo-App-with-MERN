import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TodoApi from "@/Api/Todo";
import { useNavigate } from "react-router-dom";
import useApp from "@/context/context";
import { darkColor, lightColor } from "@/lib/colors";

function AddList() {
  const { register, handleSubmit, setValue } = useForm();
  const [darkColorF, setDarkColor] = useState("");
  const [lightColorF, setLightColor] = useState("");

  const { mode } = useApp();
  const navigate = useNavigate();
  const client = useQueryClient();

  const handleFormMutation = useMutation({
    mutationKey: ["addList"],
    mutationFn: async (data) => TodoApi.createList(data),
    onSuccess: async (result) => {
      toast.success(result.message);
      setValue("listName", "");
      setValue("description", "");
      setValue("theme", {});
      client.invalidateQueries({ queryKey: ["lists"] });
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
        <p className="text-3xl font-semibold text-gray-700">List</p>
        <button className="h-full" onClick={() => navigate("/list")}>
          <X width={"35px"} height={"35px"} />
        </button>
      </div>
      <div className="w-full flex-1 pt-3">
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="flex h-full w-full flex-col justify-between"
        >
          <div className="flex w-full flex-col gap-y-6">
            <div>
              <label htmlFor="list_name">List name</label>
              <Input
                id="list_name"
                {...register("listName", { required: true })}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="des">List description</label>
              <textarea
                id="des"
                className="h-[110px] resize-none rounded-md p-2 outline-none ring-darkCard focus:ring-1"
                {...register("description")}
              ></textarea>
            </div>
            <div className="w-full">
              <label htmlFor="light_mode_color">Choose light mode color</label>
              <div className="flex w-full gap-x-4 overflow-x-auto">
                {lightColor.map((color) => {
                  return (
                    <div
                      key={color}
                      value={color}
                      className={`h-[40px] w-[40px] flex-shrink-0 cursor-pointer rounded-full ${lightColorF === color && "border-2"} border-white`}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setLightColor(color);
                        setValue("theme.lightColor", color);
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="light_mode_color">Choose dark mode color</label>
              <div className="flex w-full gap-x-4 overflow-x-auto">
                {darkColor.map((color) => {
                  return (
                    <div
                      key={color}
                      value={color}
                      className={`h-[40px] w-[40px] flex-shrink-0 cursor-pointer rounded-full ${darkColorF === color && "border-2"} border-white`}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setDarkColor(color);
                        setValue("theme.darkColor", color);
                      }}
                    ></div>
                  );
                })}
              </div>
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

export default AddList;
