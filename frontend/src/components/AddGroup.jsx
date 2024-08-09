import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import useApp from "@/context/context";
import TodoApi from "@/Api/Todo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function AddGroup() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [ids, setIds] = useState([]);
  const { mode } = useApp();
  const client = useQueryClient();

  const {
    data = "",
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["listsForGroup"],
    queryFn: async () => await TodoApi.getListForAdding(null),
  });

  const { mutate } = useMutation({
    mutationKey: ["addGroup"],
    mutationFn: async (data) => await TodoApi.createGroup(data),
    onSuccess: () => {
      toast.success("Group Created Successfully");
      client.invalidateQueries("group");
      client.invalidateQueries("listsForGroup");
      navigate("/group");
    },
    onError: (message) => toast.error(message),
  });

  const formSubmit = (data) => {
    data = { ...data, listIds: ids };
    mutate(data);
  };

  const handleRemoveIds = (id) => {
    setIds((prev) => [...prev.filter((ids) => ids !== id)]);
  };

  const handleSetIds = (id) => {
    setIds((prev) => [...prev, id]);
  };

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <div
      className={`flex h-[70vh] w-[27vw] flex-col items-center ${mode === "dark" ? "border-white" : "border-gray-700"} justify-between rounded-xl border bg-slate-300 p-5 shadow-lg`}
    >
      <div className="flex h-12 w-full items-center justify-between">
        <p className="text-3xl font-semibold text-gray-700">Group</p>
        <button className="h-full" onClick={() => navigate(-1)}>
          <X width={"35px"} height={"35px"} />
        </button>
      </div>
      <form
        onSubmit={handleSubmit(formSubmit)}
        className="w-full"
        style={{ height: "calc(100% - 48px" }}
      >
        <div className="flex h-full flex-col">
          <div className="h-fit">
            <label htmlFor="list_name" className="text-lg font-medium">
              Group Name
            </label>
            <Input
              id="list_name"
              {...register("name", { required: true })}
              className="mt-1.5"
              placeholder="Enter name"
            />
          </div>
          <div className="mt-3 flex w-full flex-1 flex-col overflow-auto">
            <div className="h-full w-full">
              <div className="sticky top-0 flex rounded-md bg-blue-500 text-center text-white">
                <div className="w-1/2 py-2 font-medium">ListName</div>
                <div className="w-1/2 py-2 font-medium">Action</div>
              </div>
              {Array.isArray(data?.lists) && data.lists.length > 0 ? (
                data.lists.map(({ _id, listName }) => (
                  <div
                    key={_id}
                    className="my-2 flex items-center rounded-md bg-gray-400 text-center text-white"
                  >
                    <div className="h-full w-1/2 py-2">{listName}</div>
                    <div className="w-1/2 py-2">
                      {ids.includes(_id) ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveIds(_id)}
                          className="rounded-md bg-teal-700 px-7 py-1 hover:bg-teal-900"
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetIds(_id)}
                          className="rounded-md bg-teal-700 px-7 py-1 hover:bg-teal-900"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full text-center">
                  <p className="mt-3 text-xl font-semibold text-red-500">
                    No List Available
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-2 h-fit">
            <Button size={"lg"} type={"submit"} className="w-full">
              Add
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddGroup;
