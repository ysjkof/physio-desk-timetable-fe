import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Header } from "../components/header";

export function Home() {
  return (
    <div className="divide-solid divide-y">
      <Header />
      <Outlet />
    </div>
  );
}
