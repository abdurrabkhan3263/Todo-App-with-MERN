import React from "react";
import { X } from "lucide-react";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import useApp from "@/context/context";

function AddGroup() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { mode } = useApp();

  const formSubmit = (data) => {
    console.log(data);
  };

  return (
    <div
      className={`flex h-[70vh] w-[27vw] flex-col items-center ${mode === "dark" ? "border-white" : "border-gray-700"} justify-between rounded-xl border bg-slate-300 p-5 shadow-lg`}
    >
      <div className="flex h-12 w-full items-center justify-between">
        <p className="text-3xl font-semibold text-gray-700">Group</p>
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
              <label htmlFor="list_name">Group</label>
              <Input id="list_name" {...register("name", { required: true })} />
            </div>
            <div></div>
          </div>
          <Button size={"lg"} type={"submit"}>
            Add
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddGroup;
