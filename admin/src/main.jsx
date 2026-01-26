import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./app";
import Login from "./components/login";
import Dashboard from "./components/dashboard";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/admin-login", element: <Login /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/new-post", element: <Dashboard /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>,
);
