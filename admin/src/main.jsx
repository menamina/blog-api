import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./app";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import AddPost from "./components/newPost";
import EditPost from "./components/editPost";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/new-post", element: <AddPost /> },
      { path: "/edit-post/:postID", element: <EditPost /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>,
);
