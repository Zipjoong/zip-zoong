import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Stopwatch from "./components/Stopwatch";
import Test from "./components/Test";
import Landing from "./components/Landing";
import TodoListPage from "./components/TodoListPage";
import TodoDetailsPage from "./components/TodoDetailsPage";
import CamStudy from "./components/CamStudy";
import MyCalendar from "./components/MyCalendar";
import MyChart from "./components/MyChart";
import JamesTest from "./components/JamesTest";
import CallToActionWithAnnotation from "./components/Main";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Test />,

    children: [
      {
        path: "stop",
        element: <Stopwatch />,
      },
      {
        path: "face",
        element: <App />,
      },
      {
        path: "landing",
        element: <Landing />,
      },
      {
        path: "todo",
        element: <TodoListPage />,
      },
      {
        path: "todo/detail/:Uid",
        element: <TodoDetailsPage />,
      },
      {
        path: "cam-study",
        element: <CamStudy />,
      },
      {
        path: "calendar",
        element: <MyCalendar />,
      },
      {
        path: "chart",
        element: <MyChart />,
      },
      {
        path: "main",
        element: <CallToActionWithAnnotation />,
      },
    ],
  },
  {
    path: "/james",
    element: <JamesTest />,
  },
]);

export default router;
