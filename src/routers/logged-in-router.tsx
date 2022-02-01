import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "../components/layout";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Home } from "../pages/home";
import { CreatePatient } from "../pages/patient/create-patient";
import { ListPatient } from "../pages/patient/list-patient";
import { Reserve } from "../pages/reservation/reserve";
import { Test } from "../pages/test";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { TimeTable } from "../pages/user/time-table";

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-xl font-medium tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="confirm" element={<ConfirmEmail />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="tt" element={<TimeTable />}>
            <Route path="reserve" element={<Reserve />} />
          </Route>
          <Route path="create-patient" element={<CreatePatient />} />
          <Route path="list-patient" element={<ListPatient />} />
          <Route path="reserve" element={<Reserve />} />
        </Route>
        <Route path="test" element={<Test />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
