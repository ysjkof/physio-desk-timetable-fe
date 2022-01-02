import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "../component/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Home } from "../pages/home";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";

const CLientRoutes = [
  <Route key={1} path="confirm" element={<ConfirmEmail />} />,
  <Route key={2} path="edit-profile" element={<EditProfile />} />,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        {CLientRoutes}
      </Routes>
    </BrowserRouter>
  );
};
