import { lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GlobalLayout from "./layouts/global";
import "./global.css";
import { UserProvider } from "./contexts/user";
import AuthWrapper from "./wrappers/auth";

// Pages Import
const IndexPage = lazy(async () => await import("@/pages/index"));
const DashboardPage = lazy(async () => await import("@/pages/dashboard"));
const CoursesPage = lazy(async () => await import("@/pages/courses"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalLayout />,
    children: [
      { path: "/", element: <IndexPage /> },
      {
        path: "/",
        element: <AuthWrapper />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/courses", element: <CoursesPage /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
);
