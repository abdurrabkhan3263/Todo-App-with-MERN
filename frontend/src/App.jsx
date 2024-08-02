import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SideNav } from "./components";
import Container from "./components/Container/Container";
import { AppProvider } from "./context/context";
import { useQuery } from "@tanstack/react-query";
import UserApi from "./Api/User";

function App() {
  const [user, setUser] = useState({ status: false, user: null });
  const [mode, setMode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const url = JSON.parse(localStorage.getItem("url"));
        const response = await UserApi.getCurrentUser();
        navigate(url);
        loginUser(response?.data);
      } catch (error) {
        setIsError(true);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [navigate]);

  const changeMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };
  const logoutUser = () => {
    setUser({ status: false, user: null });
  };
  const loginUser = (userData) => {
    setUser({ status: true, user: userData });
  };

  useEffect(() => {
    if (mode.trim()) {
      localStorage.setItem("mode", JSON.stringify(mode));
    }
  }, [mode]);

  useEffect(() => {
    const mode = JSON.parse(localStorage.getItem("mode"));
    setMode(mode || "light");
  }, []);

  return (
    <AppProvider value={{ mode, user, changeMode, loginUser, logoutUser }}>
      <div
        className={`min-h-screen ${mode === "light" ? "bg-white" : "bg-dark"}`}
      >
        {isLoading ? (
          <div
            className={`flex h-screen w-screen items-center justify-center ${mode === "light"}`}
          >
            loading.....
          </div>
        ) : !user?.status ? (
          <Outlet />
        ) : (
          <div className={`flex w-full p-4`}>
            <SideNav />
            <Container>
              <Outlet />
            </Container>
          </div>
        )}
      </div>
    </AppProvider>
  );
}

export default App;
