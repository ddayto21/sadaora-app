// src/layouts/MainLayout.tsx
import { NavigationBar } from "../components/navigation-bar";
import { Outlet } from "react-router-dom";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <NavigationBar />
      <main className="flex-1 lg:ml-64">
        {children}
        <Outlet />
      </main>
    </div>
  );
};
