import { Plus } from "@/assets/icons";
import useApp from "@/context/context";
import React from "react";

function AddCard() {
  const { mode } = useApp();
  return (
    <div
      className={`flex h-[340px] w-full flex-col overflow-hidden rounded-2xl text-white transition-all hover:-translate-y-[-0.15rem] hover:scale-[1.02] ${mode === "dark" ? "bg-darkCard shadow-lg shadow-light" : "bg-lightCard shadow-lg shadow-dark"} p-4`}
    >
      <div className="flex h-full w-full items-center justify-center">
        <button>
          <Plus width={"40%"} height={"40%"} className="m-auto" />
        </button>
      </div>
    </div>
  );
}

export default AddCard;
