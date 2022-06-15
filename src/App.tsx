import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "./apollo";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/templates/layout";
import { Home } from "./pages/todoArrange/home";
import { Test } from "./pages/test";
import { NotFound } from "./pages/todoArrange/404";
import { Account } from "./pages/todoArrange/account";
import { ConfirmEmail } from "./pages/todoArrange/confirm-email";
import { EditProfile } from "./pages/todoArrange/edit-profile";
import { TimeTable } from "./pages/timetable";
import { CreateAccount } from "./pages/todoArrange/create-account";
import { Login } from "./pages/todoArrange/login";
import { Search } from "./pages/todoArrange/search";
import { ListPatient } from "./pages/todoArrange/list-patient";
import { Dashboard } from "./pages/dashboard";

function App() {
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
            <Route path="list-patient" element={<ListPatient />} />
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

export default App;
