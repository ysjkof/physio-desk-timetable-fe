import { useReactiveVar } from "@apollo/client";
import { Route, Routes } from "react-router-dom";
import { isLoggedInVar } from "../apollo";
import { Layout } from "../components/templates/layout";
import { Dashboard } from "../pages/dashboard";
import { Home } from "../pages/home";
import { Test } from "../pages/test";
import { TimeTable } from "../pages/timetable";
import { NotFound } from "../pages/404";
import { Account } from "../pages/account";
import { ConfirmEmail } from "../pages/confirm-email";
import { CreateAccount } from "../pages/create-account";
import { EditProfile } from "../pages/edit-profile";
import { Login } from "../pages/login";
import { Search } from "../pages/search";

function Router() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {isLoggedIn ? (
          <>
            <Route path="confirm" element={<ConfirmEmail />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="tt" element={<TimeTable />}>
              <Route path="reserve" element={<TimeTable />} />
              <Route path="edit" element={<TimeTable />} />
              <Route path="create-patient" element={<TimeTable />} />
            </Route>
            <Route path="search" element={<Search />} />
            <Route path="dashboard" element={<Dashboard />} />
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

export default Router;
