import React, { useRef, useState } from "react";
import { Star } from "../assets/icons";
import useApp from "@/context/context";
import gsap from "gsap";
import SimpleLoader from "@/assets/SimpleLoader";

function Todo_Card({ title, content, id, isImportant, isCompleted }) {
  const [todoData, setTodoData] = useState({ todoName: title, content });
  const [boolValue, setBoolValue] = useState({ isImportant, isCompleted });
  const { mode } = useApp();
  const star = useRef(null);
  const loader = useRef(null);
  const handleIsImpotent = () => {
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
  };
  return (
    <div
      className={`flex h-[340px] w-full flex-col overflow-hidden rounded-2xl text-white transition-all hover:-translate-y-[-0.15rem] hover:scale-[1.02] ${mode === "dark" ? "bg-darkCard shadow-lg shadow-light" : "bg-lightCard shadow-lg shadow-dark"} p-4`}
    >
      <div className="flex items-center justify-between bg-blue-500">
        <input type="checkbox" name="" id="" className="h-6 w-6" />
        <button className="relative h-full w-8" onClick={handleIsImpotent}>
          <Star
            height={"35px"}
            width={"35px"}
            stroke={isCompleted ? "#FFFF00" : "#FFFFFF"}
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
      <div className="flex-grow">
        <div className="h-[60%]">
          <textarea
            value={todoData.todoName}
            className="mt-2.5 h-full w-full resize-none bg-transparent text-center text-6xl font-bold outline-none"
          ></textarea>
        </div>
        <div className="h-[40%]">
          <textarea
            value={todoData.content}
            className="h-full w-full resize-none bg-transparent pt-2 text-xl font-medium outline-none"
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default Todo_Card;
