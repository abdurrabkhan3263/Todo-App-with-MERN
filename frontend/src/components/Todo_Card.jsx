import React, { useRef, useState } from "react";
import { Star } from "../assets/icons";
import useApp from "@/context/context";
import gsap from "gsap";
import SimpleLoader from "@/assets/SimpleLoader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TodoApi from "@/Api/Todo";
import { toast } from "sonner";
import "./ui/scroll.css";

function Todo_Card({ title, content, id, isImportant, isCompleted }) {
  const [todoData, setTodoData] = useState({ todoName: title, content });
  const [preventDoubleClick, setPreventDoubleClick] = useState(false);
  const [boolValue, setBoolValue] = useState({ isImportant, isCompleted });
  const { mode } = useApp();
  const star = useRef(null);
  const loader = useRef(null);
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
      client.invalidateQueries({ queryKey: ["todos"] });
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
  return (
    <div
      className={`wow flex h-[340px] w-full flex-col overflow-hidden rounded-2xl text-white transition-all hover:-translate-y-[-0.15rem] hover:scale-[1.02] ${mode === "dark" ? "bg-darkCard shadow-lg shadow-light" : "bg-lightCard shadow-lg shadow-dark"} p-4`}
    >
      <div className="flex items-center justify-between">
        <input type="checkbox" name="" id="" className="h-6 w-6" />
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
            name="todoName"
            className="mt-2.5 h-full w-full resize-none bg-transparent text-center text-6xl font-bold outline-none"
          ></textarea>
        </div>
        <div className="h-[40%] overflow-hidden">
          <textarea
            value={todoData.content}
            onChange={handleChange}
            name="content"
            className="h-full w-full resize-none bg-transparent pt-2 text-xl font-medium outline-none"
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default Todo_Card;
