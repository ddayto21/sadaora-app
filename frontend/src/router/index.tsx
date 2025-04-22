// src/router/index.tsx

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { FeedPage } from "../pages/feed-page";
import { ProfilePage } from "../pages/profile-page";
import { PublicProfilePage } from "../pages/public-profile-page";

import { LoginPage } from "../pages/login-page";
import { MainLayout } from "../layouts/main-layout";
import { ProtectedRoute } from "./protected-route";

const ProtectedMainLayout = () => (
  <ProtectedRoute>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </ProtectedRoute>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedMainLayout />,
    children: [
      { index: true, element: <FeedPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "profile/:id", element: <PublicProfilePage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
