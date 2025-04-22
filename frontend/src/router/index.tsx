// src/router/index.tsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FeedPage } from "../pages/feed-page";
import { ProfilePage } from "../pages/profile-page";
import { LoginPage } from "../pages/login-page";

// import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  { path: "/", element: <FeedPage /> },
  { path: "/login", element: <LoginPage /> },

  {
    path: "/profile",
    element: <ProfilePage />,

    // element: (
    //   <ProtectedRoute>
    //     <ProfilePage />
    //   </ProtectedRoute>
    // ),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
