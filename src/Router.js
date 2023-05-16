
import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import Stopwatch from "./components/Stopwatch";
import Test from "./components/Test";
import Landing from "./components/Landing";
import TodoListPage from "./components/TodoListPage";
import TodoDetailsPage from "./components/TodoDetailsPage";



const router = createBrowserRouter([
    {
    path: "/",
    element: <Test />,

    
    children:[
        {
            path:"stop",
            element: <Stopwatch />,
        },
        {
            path:"face",
            element: <App />,
            
        },
        {
            path:"landing",
            element: <Landing />,
        },
        {
            path:"todo",
            element: <TodoListPage />,
        },
        {
            path:'todo/detail/:Uid',
            element: <TodoDetailsPage />,
        },
        
    ]

}
]);

export default router;