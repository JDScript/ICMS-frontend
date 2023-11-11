import { lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GlobalLayout from "./layouts/global";
import "./global.css";
import { UserProvider } from "./contexts/user";
import AuthWrapper from "./wrappers/auth";
import { ConfigProvider } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";

// Pages Import
const IndexPage = lazy(async () => await import("@/pages/index"));
const DashboardPage = lazy(async () => await import("@/pages/dashboard"));
const CoursesPage = lazy(async () => await import("@/pages/courses"));
const ActivitiesPage = lazy(async () => await import("@/pages/activities"));

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
          { path: "/activities", element: <ActivitiesPage /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <ConfigProvider locale={en_US}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </UserProvider>
);
