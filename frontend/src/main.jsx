import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Todo, List, Group, Important, Auth } from "./pages/index.js";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
useQueryClient;
import { SignInForm, LoginForm } from "./components/index.js";
import { Toaster } from "./components/ui/sonner.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        path="/sign-in"
        element={
          <Auth>
            <SignInForm />
          </Auth>
        }
      />
      <Route
        path="/login"
        element={
          <Auth>
            <LoginForm />
          </Auth>
        }
      />
      <Route path="" element={<Todo />} />
      <Route path="/List" element={<List />} />
      <Route path="/group" element={<Group />} />
      <Route path="/important" element={<Important />} />
    </Route>,
  ),
);

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>,
);
