import React, { useMemo, useRef, useState, useEffect } from "react";
import useApp from "@/context/context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TodoApi from "@/Api/Todo";
import { toast } from "sonner";
import { Delete, Edit, MoveUpRight, Save } from "@/assets/icons";
import gsap from "gsap";
import "./ui/scroll.css";

function List_Card({ title, content, id, color }) {
  const [listData, setListData] = useState({ listName: title, content, color });
  const [disEdit, setDisEdit] = useState({
    status: true,
    isSave: true,
    initial: false,
  });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteList, setDeleteList] = useState(false);
  const client = useQueryClient();
  const edit = useRef(null);
  const save = useRef(null);
  const { mode } = useApp();

  function animateButton(isEdit) {
    const timeLine = gsap.timeline();

    const scale = { scale: 1, duration: 0.2, ease: "power2.inOut" };
    const minimize = { scale: 0, duration: 0.2, ease: "power2.inOut" };

    if (isEdit) {
      timeLine.to(save.current, minimize);
      timeLine.to(edit.current, scale);
    } else {
      timeLine.to(edit.current, minimize);
      timeLine.to(save.current, scale);
    }
  }

  const deleteMutation = useMutation({
    mutationKey: ["muDelete"],
    mutationFn: async (id) => TodoApi.deleteLists(id),
    onSuccess: (result) => {
      toast.success(result.message);
      client.invalidateQueries({ queryKey: ["lists"] });
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const updateListData = useMemo(() => {
    const updateValue = {};
    if (disEdit.initial) {
      if (title?.trim() !== listData.listName.trim())
        updateValue.listName = listData.listName;
      if (content?.trim() !== listData.content.trim())
        updateValue.description = listData.content;
    }
    return updateValue;
  }, [disEdit.initial, title, listData.listName, listData.content, content]);

  const updateMutation = useMutation({
    mutationKey: ["upList"],
    mutationFn: async () => {
      return await TodoApi.updateList(id, updateListData);
    },
    onSuccess: (result) => {
      client.invalidateQueries({ queryKey: ["lists"] });
      toast.success(result.message);
    },
    onError: (message) => toast.error(message),
  });

  useEffect(() => {
    if (disEdit.initial) {
      if (Object.keys(updateListData).length > 0 && disEdit.isSave) {
        updateMutation.mutate();
      }
      animateButton(disEdit.status);
    }
  }, [disEdit]);

  const handleDelete = () => {
    deleteMutation.mutate(id);
  };

  const handleListRouting = () => {
    console.log("routable");
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
        className={`wow relative flex h-[340px] w-full flex-col overflow-hidden rounded-2xl text-white transition-all hover:-translate-y-[-0.15rem] hover:scale-[1.02] ${mode === "dark" ? `shadow-lg shadow-light` : "shadow-lg shadow-dark"} p-4`}
        style={{
          backgroundColor:
            mode === "dark"
              ? color?.darkColor || "#322727"
              : color?.lightColor || "#9c9c9c",
        }}
      >
        <div className="flex items-center justify-between">
          <button
            className="fit relative h-[40px] w-[40px] rounded-full bg-slate-200 p-2 text-stone-700 hover:bg-lightNav hover:text-white"
            onClick={() =>
              setDisEdit((prev) => ({
                status: !prev.status,
                isSave: !prev.isSave,
                initial: true,
              }))
            }
          >
            <Edit
              className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2"
              ref={edit}
            />
            <Save
              className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 scale-0"
              ref={save}
            />
          </button>
          <button
            className="fit rounded-full bg-slate-200 p-2 text-stone-700 hover:bg-lightNav hover:text-white"
            onClick={() => setShowDelete(true)}
          >
            <Delete />
          </button>
        </div>
        <div className="flex-grow overflow-hidden">
          <div className="h-[60%] overflow-hidden">
            <textarea
              value={listData.listName}
              onChange={(e) =>
                setListData((prev) => ({ ...prev, listName: e.target.value }))
              }
              name="listName"
              disabled={disEdit.status}
              className="mt-2.5 h-full w-full resize-none bg-transparent text-center text-6xl font-bold outline-none"
            ></textarea>
          </div>
          <div className="h-[40%] overflow-hidden">
            <textarea
              value={listData.content}
              onChange={(e) =>
                setListData((prev) => ({ ...prev, content: e.target.value }))
              }
              name="content"
              disabled={disEdit.status}
              className="h-full w-full resize-none bg-transparent pt-2 text-xl font-medium outline-none"
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
}

export default List_Card;
