
import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import Stopwatch from "./components/Stopwatch";
import Test from "./components/Test";
import Landing from "./components/Landing";



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
        
    ]

}
]);

export default router;