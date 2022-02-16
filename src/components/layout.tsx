import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./header";

export const Layout: React.FC = () => {
  return (
    <div className="h-screen divide-y divide-solid overflow-hidden">
      <Header />
      <Outlet />
    </div>
  );
};
