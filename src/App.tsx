import React from "react";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "./apollo";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { CreatePatient } from "./pages/create-patient";
import { Test } from "./pages/test";
import { NotFound } from "./pages/404";
import { Account } from "./pages/account";
import { ConfirmEmail } from "./pages/confirm-email";
import { EditProfile } from "./pages/edit-profile";
import { TimeTable } from "./pages/time-table";
import { Reserve } from "./pages/reserve";
import { ListPatient } from "./pages/list-patient";
import { CreateAccount } from "./pages/create-account";
import { Login } from "./pages/login";
import { Search } from "./pages/search";
import { PateintDetail } from "./pages/patient-detail";
import { ModalPortal } from "./components/modal-portal";
import { Dashboard } from "./pages/dash-board";
import { Group } from "./pages/group";
import { useMe } from "./hooks/useMe";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const navigate = useNavigate();
  // const { data, loading, error } = useMe();
  // if (!data || loading || error) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <span className="text-xl font-medium tracking-wide">Loading...</span>
  //     </div>
  //   );
  // }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {isLoggedIn ? (
          <>
            <Route path="confirm" element={<ConfirmEmail />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="tt" element={<TimeTable />}>
              <Route
                path="reserve"
                element={
                  <ModalPortal
                    closeAction={() => navigate(-1)}
                    children={<Reserve />}
                  />
                }
              />
            </Route>
            <Route path="create-patient" element={<CreatePatient />} />
            <Route path="list-patient" element={<ListPatient />} />
            <Route path="search" element={<Search />} />
            <Route path="patient" element={<PateintDetail />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="group" element={<Group />} />

            <Route path="test" element={<Test />} />
          </>
        ) : (
          <>
            <Route path="/account" element={<Account />}>
              <Route path="login" element={<Login />} />
              <Route path="create" element={<CreateAccount />} />
            </Route>
          </>
        )}
        <Route path="/about" element={<h1>hghh</h1>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
