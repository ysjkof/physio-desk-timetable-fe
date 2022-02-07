import React from "react";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "./apollo";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { CreatePatient } from "./pages/create-patient";
import { Test } from "./pages/test";
import { NotFound } from "./pages/404";
import { Account } from "./pages/account";
import { useMe } from "./hooks/useMe";
import { ConfirmEmail } from "./pages/confirm-email";
import { EditProfile } from "./pages/edit-profile";
import { TimeTable } from "./pages/time-table";
import { Reserve } from "./pages/reserve";
import { ListPatient } from "./pages/list-patient";
import { CreateAccount } from "./pages/create-account";
import { Login } from "./pages/login";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
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
        {isLoggedIn ? (
          <>
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
          </>
        ) : (
          <>
            <Route path="/" element={<Account />}>
              <Route index element={<Login />} />
              <Route path="create-account" element={<CreateAccount />} />
            </Route>
          </>
        )}
        <Route path="/about" element={<h1>hghh</h1>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
