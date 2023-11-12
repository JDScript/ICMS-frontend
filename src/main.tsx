import { lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GlobalLayout from "./layouts/global";
import "./global.css";
import { UserProvider } from "./contexts/user";
import AuthWrapper from "./wrappers/auth";
import { ConfigProvider } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Hong_Kong");
dayjs.extend(duration);

// Pages Import
const IndexPage = lazy(async () => await import("@/pages/index"));
const DashboardPage = lazy(async () => await import("@/pages/dashboard"));
const CoursesPage = lazy(async () => await import("@/pages/courses"));
const CourseDetailPage = lazy(
  async () => await import("@/pages/courses/$course_id")
);
const ActivitiesPage = lazy(async () => await import("@/pages/activities"));
const CalendarPage = lazy(async () => await import("@/pages/calendar"));

// Error Pages
const NotFoundPage = lazy(async () => await import("@/pages/404"));
const InternalServerErrorPage = lazy(async () => await import("@/pages/500"));

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
          {
            path: "/courses/:course_id",
            element: <CourseDetailPage />,
          },
          { path: "/activities", element: <ActivitiesPage /> },
          { path: "/calendar", element: <CalendarPage /> },
        ],
        errorElement: <InternalServerErrorPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
    errorElement: <InternalServerErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <ConfigProvider locale={en_US} timeZone={"Asia/Hong_Kong"}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </UserProvider>
);
