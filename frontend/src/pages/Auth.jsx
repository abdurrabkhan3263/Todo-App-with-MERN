import useApp from "../context/context";
import React from "react";

function Auth({ children }) {
  const { mode } = useApp();

  return (
    <div
      className={`flex h-screen w-screen items-center justify-center ${mode === "light" ? "bg-white" : "bg-dark"}`}
    >
      {children}
    </div>
  );
}

export default Auth;
