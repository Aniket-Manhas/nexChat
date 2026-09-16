import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import NotFound from "./pages/NotFound.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    path: "/",
    children: [
      { path: "", element: <Home /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthProvider>
      <SocketProvider>
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>
  </ThemeProvider>
);

