import React, { useCallback, useReducer, useRef, useState } from "react";
import { Star } from "../assets/icons";
import useApp from "@/context/context";
import gsap from "gsap";
import SimpleLoader from "@/assets/SimpleLoader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TodoApi from "@/Api/Todo";
import { toast } from "sonner";
import "./ui/scroll.css";
import { debounce } from "lodash";

const reducer = (currentState, actionMethod) => {
  if (actionMethod.type === "DEC_COUNTER") {
    return {
      ...currentState,
      delCounter: actionMethod.value,
    };
  }
  if (actionMethod.type === "TOGGLE_SHOW_DELETE") {
    return { ...currentState, showDelete: actionMethod.value };
  }
  if (actionMethod.type === "TOGGLE_IS_COMPETED") {
    return { ...currentState, completed: !currentState?.completed };
  }
};

let Count_Num = 5;
let interval;

function Todo_Card({
  title,
  content,
  id,
  isImportant,
  isCompleted,
  belongsTo,
}) {
  const initialState = {
    showDelete: false,
    completed: isCompleted,
    delCounter: Count_Num,
  };
  const [todoData, setTodoData] = useState({ todoName: title, content });
  const [preventDoubleClick, setPreventDoubleClick] = useState(false);
  const [deleteReducer, delDispatch] = useReducer(reducer, initialState);
  const { mode } = useApp();
  const star = useRef(null);
  const loader = useRef(null);
  const Title_Ref = useRef(null);
  const Content_Ref = useRef(null);
  const client = useQueryClient();

  const importantMutation = useMutation({
    mutationKey: ["imp"],
    mutationFn: async () => await TodoApi.setIsImportant(id),
    onSuccess: (result) => {
      toast.success(result.message);
      setTimeout(() => {
        gsap.to(loader.current, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            gsap.to(star.current, {
              scale: 1,
              opacity: 1,
              duration: 0.2,
            });
          },
        });
      }, 500);
      setPreventDoubleClick(false);
      belongsTo === "todo"
        ? client.invalidateQueries({ queryKey: ["todos"] })
        : client.invalidateQueries({ queryKey: ["listTodos"] });

      setTimeout(() => {
        client.invalidateQueries({ queryKey: ["getImpTodo"] });
      }, 510);
    },
    onError: (error) => {
      setPreventDoubleClick(false);
      toast.error(error);
      setTimeout(() => {
        gsap.to(loader.current, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            gsap.to(star.current, {
              scale: 1,
              opacity: 1,
              duration: 0.2,
            });
          },
        });
      }, 500);
    },
    onSettled: () => {
      setPreventDoubleClick(false);
    },
  });

  const handleIsImpotent = () => {
    if (preventDoubleClick) return;
    setPreventDoubleClick(true);
    gsap.to(star.current, {
      scale: 0,
      duration: 0.2,
      opacity: 0,
      onComplete: () => {
        gsap.to(loader.current, {
          scale: 1,
          duration: 0.2,
          opacity: 100,
        });
      },
    });
    importantMutation.mutate();
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTodoData((prev) => ({ ...prev, [name]: value }));
  };

  const completedMutation = useMutation({
    mutationFn: async () => {
      if (isCompleted !== deleteReducer.completed) {
        return await TodoApi.setIsCompleted(id, deleteReducer.completed);
      }
      return "";
    },
    onSuccess: (result) => {
      result?.message && toast.success(result.message);
      client.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.log("THIS IS ERROR:- ", error);
      toast.error(error);
    },
  });

  const handleShowDelete = () => {
    delDispatch({ type: "TOGGLE_SHOW_DELETE", value: true });
    interval = setInterval(() => {
      Count_Num = Count_Num - 1;
      delDispatch({ type: "DEC_COUNTER", value: Count_Num });
      if (Count_Num === 0) {
        clearInterval(interval);
        delDispatch({ type: "TOGGLE_SHOW_DELETE", value: false });
      }
    }, 1000);
  };

  const deb = useCallback(
    debounce((completed) => {
      completedMutation.mutate();
      if (!completed) handleShowDelete();
    }, 800),
    [],
  );

  const handleIsCompleted = () => {
    deb(deleteReducer.completed);
    delDispatch({ type: "TOGGLE_IS_COMPETED" });
  };

  const deleteMutation = useMutation({
    mutationKey: ["deleteMut"],
    mutationFn: async () => await TodoApi.deleteTodo(id),
    onSuccess: (result) => {
      toast.success(result.message);
      client.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const updateMutation = useMutation({
    mutationKey: ["update_todo"],
    mutationFn: async (data) => await TodoApi.updateTodo(data, id),
    onSuccess: (result) => {
      toast.success(result.message);
      client.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const changeDataDeb = useCallback(
    debounce(() => {
      updateMutation.mutate(todoData);
    }, 500),
    [todoData],
  );

  return (
    <>
      {deleteReducer?.showDelete && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="flex h-[20%] w-[20%] items-center justify-between bg-white px-4">
            <p>Automatic Close on {deleteReducer.delCounter}</p>
            <button
              onClick={() => {
                delDispatch({ type: "TOGGLE_SHOW_DELETE", value: false });
                clearInterval(interval);
              }}
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
        className={`wow flex h-[340px] w-full flex-col overflow-hidden rounded-2xl text-white transition-all hover:-translate-y-[-0.15rem] hover:scale-[1.02] ${mode === "dark" ? "bg-darkCard shadow-lg shadow-light" : "bg-lightCard shadow-lg shadow-dark"} p-4`}
      >
        <div className="flex items-center justify-between">
          <input
            checked={deleteReducer.completed}
            type="checkbox"
            name=""
            id=""
            className="h-6 w-6"
            onChange={handleIsCompleted}
          />
          <button className="relative h-full w-8" onClick={handleIsImpotent}>
            <Star
              height={"35px"}
              width={"35px"}
              stroke={isImportant ? "#FFFF00" : "#FFFFFF"}
              className="absolute right-0 top-[-20%] z-50"
              ref={star}
            />
            <div
              className="absolute right-0 top-[-20%] scale-0 opacity-0"
              ref={loader}
            >
              <SimpleLoader width={"35px"} height={"35px"} fill={"#FFFFFF"} />
            </div>
          </button>
        </div>
        <div className="flex-grow overflow-hidden">
          <div className="h-[60%] overflow-hidden">
            <textarea
              value={todoData.todoName}
              onChange={handleChange}
              onBlur={changeDataDeb}
              name="todoName"
              disabled={deleteReducer.completed}
              ref={Title_Ref}
              className={`mt-2.5 h-full w-full ${deleteReducer.completed ? "line-through" : "no-underline"} resize-none bg-transparent text-center text-6xl font-bold outline-none`}
            ></textarea>
          </div>
          <div className="h-[40%] overflow-hidden">
            <textarea
              value={todoData.content}
              onChange={handleChange}
              onBlur={changeDataDeb}
              name="content"
              disabled={deleteReducer.completed}
              ref={Content_Ref}
              className={`h-full w-full resize-none ${deleteReducer.completed ? "line-through" : "no-underline"} bg-transparent pt-2 text-xl font-medium outline-none`}
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
}

export default Todo_Card;
