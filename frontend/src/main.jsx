import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Todo,
  List,
  Group,
  Important,
  Auth,
  List_Todo,
} from "./pages/index.js";
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
import {
  SignInForm,
  LoginForm,
  AddTodo,
  AddList,
  AddGroup,
} from "./components/index.js";
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
      <Route path="" element={<Todo />}>
        <Route path="/todo" element={<AddTodo />} />
      </Route>
      <Route path="/List" element={<List />}>
        <Route path="add-list" element={<AddList />} />
      </Route>
      <Route path="/group" element={<Group />}>
        <Route path="add-group" element={<AddGroup />} />
      </Route>
      <Route path="/important" element={<Important />} />
      <Route path="/todo/:id" element={<List_Todo />}>
        <Route path="todo" element={<AddTodo />} />
      </Route>
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
