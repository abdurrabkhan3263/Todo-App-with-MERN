import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { SideNav } from "./components";
import Container from "./components/Container/Container";
import { AppProvider } from "./context/context";

function App() {
  const [user, setUser] = useState("");
  const [mode, setMode] = useState("");

  const changeMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };
  const changeUser = () => {};
  useEffect(() => {
    if (mode.trim()) {
      localStorage.setItem("mode", JSON.stringify(mode));
    }
  }, [mode]);

  useEffect(() => {
    const mode = JSON.parse(localStorage.getItem("mode"));
    setMode(mode);
  }, []);

  return (
    <AppProvider value={{ mode, user, changeMode, changeUser }}>
      <div className="grid h-screen grid-cols-[repeat(15,1fr)] p-8">
        <SideNav />
        <Container>
          <Outlet />
        </Container>
      </div>
    </AppProvider>
  );
}

export default App;
