import { useContext, Provider } from "react";
import { createContext } from "react";

const appContext = createContext({
  user: {
    status: false,
    user: null,
  },
  mode: "light",
  changeMode: () => {},
  changeUser: () => {},
});

export const AppProvider = appContext.Provider;

export default function useApp() {
  return useContext(appContext);
}
