import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Home } from "../pages/home";
import { CreatePatient } from "../pages/patient/create-patient";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { TimeTable } from "../pages/user/time-table";

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
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<p>홈의 인덱스</p>} />,
          <Route path="confirm" element={<ConfirmEmail />} />,
          <Route path="edit-profile" element={<EditProfile />} />,
          <Route path="tt" element={<TimeTable />} />,
          <Route path="create-patient" element={<CreatePatient />} />,
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
