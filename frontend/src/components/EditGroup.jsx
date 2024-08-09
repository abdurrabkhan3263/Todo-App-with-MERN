import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "./ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import useApp from "@/context/context";
import TodoApi from "@/Api/Todo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function EditGroup() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const { group_id } = useParams();
  const [ids, setIds] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]); // its work if we have ids from params
  const { mode } = useApp();
  const client = useQueryClient();

  const {
    data = "",
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["listsForGroup", group_id],
    queryFn: async () => await TodoApi.getListForAdding(group_id),
  });

  const updateMutation = useMutation({
    mutationKey: ["updateGroup"],
    mutationFn: async (data) => await TodoApi.updateGroup(data[0], data[1]),
    onSuccess: () => {
      toast.success("Group Updated Successfully");
      client.invalidateQueries("group");
      client.invalidateQueries("listsForGroup");
      navigate("/group");
    },
    onError: (message) => toast.error(message),
  });

  const formSubmit = (data) => {
    const updatedData = { ...data, listIds: ids, deletedIds };
    updateMutation.mutate([updatedData, group_id]);
  };

  const handleRemoveIds = (id) => {
    setIds((prev) => [...prev.filter((ids) => ids !== id)]);
  };

  const handleDeletedIds = (id) => {
    if (deletedIds.includes(id)) {
      setDeletedIds(() => [...deletedIds.filter((ids) => ids !== id)]);
    } else {
      setDeletedIds((prev) => [...prev, id]);
    }
  };

  const handleAddIds = (_id) => {
    setIds((prev) => [...prev, _id]);
  };

  useEffect(() => {
    if (group_id) {
      setValue("name", data?.name || "");
    }
  }, [data, group_id]);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <div
      className={`flex h-[70vh] w-[27vw] flex-col ${
        mode === "dark" ? "border-white" : "border-gray-700"
      } rounded-xl border bg-slate-300 p-5 shadow-lg`}
    >
      <div className="mb-3 flex h-12 w-full items-center justify-between">
        <p className="text-3xl font-semibold text-gray-700">Group</p>
        <button className="h-full" onClick={() => navigate(-1)}>
          <X width={"35px"} height={"35px"} />
        </button>
      </div>
      <div className="flex flex-grow flex-col overflow-hidden">
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="flex h-full flex-col"
        >
          <div className="mb-3">
            <label htmlFor="list_name" className="mb-1 block font-medium">
              Group Name
            </label>
            <Input id="list_name" {...register("name", { required: true })} />
          </div>
          <div className="flex flex-grow flex-col overflow-hidden">
            <div className="relative mb-2 flex-1 overflow-auto">
              <div className="sticky top-0 flex rounded-md bg-blue-500 text-center text-white">
                <div className="w-1/2 py-2 font-medium">ListName</div>
                <div className="w-1/2 py-2 font-medium">Action</div>
              </div>
              {Array.isArray(data.lists?.notAdded) &&
              data.lists?.notAdded.length > 0 ? (
                data.lists?.notAdded.map(({ _id, listName }) => (
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
                          onClick={() => handleAddIds(_id)}
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
                  <p className="text-xl font-semibold text-red-500">
                    No List Available
                  </p>
                </div>
              )}
            </div>
            <div className="relative mb-2 flex-1 overflow-auto">
              <div className="flex h-8 items-center">
                <p className="font-medium">Already Added Lists</p>
              </div>
              <div
                style={{ height: "calc(100% - 32px)" }}
                className="overflow-auto"
              >
                {Array.isArray(data.lists?.added) &&
                data.lists?.added.length > 0 ? (
                  data.lists?.added.map(({ _id, listName }) => (
                    <div
                      key={_id}
                      className="my-2 flex items-center rounded-md bg-gray-400 text-center text-white"
                    >
                      <div className="h-full w-1/2 py-2">{listName}</div>
                      <div className="w-1/2 py-2">
                        {!deletedIds.includes(_id) ? (
                          <button
                            type="button"
                            onClick={() => handleDeletedIds(_id)}
                            className="rounded-md bg-teal-700 px-7 py-1 hover:bg-teal-900"
                          >
                            Delete
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeletedIds(_id)}
                            className="rounded-md bg-teal-700 px-7 py-1 hover:bg-teal-900"
                          >
                            Undo
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center">
                    <p className="text-xl font-semibold text-red-500">
                      No List Available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 text-end">
            <Button size={"lg"} type={"submit"} className="w-full">
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditGroup;
