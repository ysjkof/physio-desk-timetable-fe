import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Home } from "../pages/home";
import { CreatePatient } from "../pages/patient/create-patient";
import { ListPatient } from "../pages/patient/list-patient";
import { CreateReservation } from "../pages/reservation/create-reservation";
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
          <Route
            index
            element={
              <>
                <h1 className=" text-3xl">홈의 인덱스</h1>
                <Link className="text-sky-400" to="/create-patient">
                  Create Patient
                </Link>
                <br />
                <Link className="text-sky-400" to="/list-patient">
                  List Patient
                </Link>
                <br />
                <Link className="text-sky-400" to="/reserve">
                  Reserve
                </Link>
              </>
            }
          />
          ,
          <Route path="confirm" element={<ConfirmEmail />} />,
          <Route path="edit-profile" element={<EditProfile />} />,
          <Route path="tt" element={<TimeTable />} />,
          <Route path="create-patient" element={<CreatePatient />} />,
          <Route path="list-patient" element={<ListPatient />} />,
          <Route path="reserve" element={<CreateReservation />} />,
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
