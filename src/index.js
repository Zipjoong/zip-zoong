import React from "react";
import ReactDOM from "react-dom/client";
import router from "./Router";
import { RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);
