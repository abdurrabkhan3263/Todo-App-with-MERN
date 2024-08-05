import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "./ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import useApp from "@/context/context";
import TodoApi from "@/Api/Todo";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

function AddGroup() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
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

  const { mutate } = useMutation({
    mutationKey: ["addGroup"],
    mutationFn: async (data) => await TodoApi.createGroup(data),
    onSuccess: () => {
      toast.success("Group Created Successfully");
      client.invalidateQueries("group");
      client.invalidateQueries("listsForGroup");
      navigate(-1);
    },
    onError: (message) => toast.error(message),
  });
  const formSubmit = (data) => {
    data = { ...data, listIds: ids };
    mutate(data);
  };

  const handleRemoveIds = (id) => {
    if (!group_id) {
      setIds((prev) => [...prev.filter((ids) => ids !== id)]);
    } else {
      console.log("hai bhai");
    }
  };

  const handleAddIds = (_id) => {
    setIds((prev) => [...prev, _id]);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

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
      <div className="w-full flex-1 pt-3">
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="flex h-full w-full flex-col justify-between"
        >
          <div className="flex w-full flex-col gap-y-6">
            <div className="h-fit">
              <label htmlFor="list_name">Group Name</label>
              <Input id="list_name" {...register("name", { required: true })} />
            </div>
            <div className="h-96 overflow-y-auto">
              <table className="w-full text-center">
                <thead className="bg-blue-500">
                  <tr>
                    <td className="py-2">List Name</td>
                    <td className="py-2">Action</td>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data) && data.length > 0
                    ? data.map(({ _id, listName, isInGroup }) => (
                        <tr key={_id} className="bg-red-400">
                          <td className="py-2">{listName}</td>
                          <td className="py-2">
                            {ids.includes(_id) || isInGroup ? (
                              <Button onClick={() => handleRemoveIds(_id)}>
                                Remove
                              </Button>
                            ) : (
                              <Button onClick={() => handleAddIds(_id)}>
                                Add
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    : "No List Availabe"}
                </tbody>
              </table>
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

export default AddGroup;
