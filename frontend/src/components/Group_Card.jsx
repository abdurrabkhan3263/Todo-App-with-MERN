import React, { useState } from "react";
import { Delete, Navigation } from "@/assets/icons";
import useApp from "@/context/context";
import "./ui/scroll.css";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit } from "@/assets/icons";
import TodoApi from "@/Api/Todo";
import { toast } from "sonner";
import { useEffect } from "react";

function Group_Card({ groupName, id }) {
  const { mode } = useApp();
  const headerBox = React.useRef(null);
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const client = useQueryClient();

  const handleMouseEnter = () => {
    headerBox.current.classList.remove("hidden");
    headerBox.current.classList.add("activeBox");
  };
  const handleMouseLeave = () => {
    headerBox.current.classList.add("hidden");
    headerBox.current.classList.remove("activeBox");
  };

  const deleteMutation = useMutation({
    mutationKey: ["deleteGroup"],
    mutationFn: async () => await TodoApi.deleteGroup(id),
    onSuccess: () => {
      toast.success("Group Deleted Successfully");
      client.invalidateQueries("group");
    },
    onError: (message) => toast.error(message),
  });

  const handleDelete = () => {
    deleteMutation.mutate();
    setShowDelete(false);
  };

  return (
    <>
      {showDelete && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="flex h-[20%] w-[20%] items-center justify-between bg-white px-4">
            <button
              onClick={() => setShowDelete(false)}
              className="rounded-lg border px-5 py-1 hover:bg-lightNav"
            >
              Close
            </button>
            <button
              className="rounded-lg border px-5 py-1 hover:bg-lightNav"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      <div
        key={id}
        className={`groupCard relative flex h-[340px] w-full flex-col overflow-hidden rounded-2xl text-white transition-all hover:-translate-y-1 hover:scale-105 ${mode === "dark" ? "bg-darkCard shadow-lg shadow-light" : "bg-lightCard shadow-lg shadow-dark"} p-4`}
        onMouseOver={handleMouseEnter}
        onMouseOut={handleMouseLeave}
      >
        <div
          className="headerBox absolute right-1/2 top-1/2 hidden h-full w-full -translate-y-1/2 translate-x-1/2"
          ref={headerBox}
        >
          <div className="flex items-center justify-between p-3">
            <button
              className="fit relative h-[40px] w-[40px] rounded-full bg-slate-200 p-2 text-stone-700 hover:bg-lightNav hover:text-white"
              onClick={() => navigate(`add-group/${id}`)}
            >
              <Edit className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2" />
            </button>
            <button
              className="fit rounded-full bg-slate-200 p-2 text-stone-700 hover:bg-lightNav hover:text-white"
              onClick={() => setShowDelete(true)}
            >
              <Delete />
            </button>
          </div>
          <div className="mb-8 flex w-full flex-1 items-center justify-center">
            <Link
              className="navBtn rotate-[25deg] p-5"
              to={`/group-list/${id}`}
            >
              <Navigation height={"35px"} width={"35px"} />
            </Link>
          </div>
        </div>
        <div className="flex flex-grow items-center justify-center overflow-hidden">
          <h1 className="text-center text-6xl font-semibold">
            {groupName?.trim().length > 30
              ? `${groupName?.slice(0, 30)}....`
              : groupName || ""}
          </h1>
        </div>
      </div>
    </>
  );
}

export default Group_Card;
