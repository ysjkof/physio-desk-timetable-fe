import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "../component/header";
import { NotFound } from "../pages/404";
import { CreateAccount } from "../pages/create-account";
import { Home } from "../pages/home";
import { Login } from "../pages/login";

const ClientRoutes = [
  <Route key={1} path="login" element={<Login />} />,
  <Route key={2} path="create-account" element={<CreateAccount />} />,
];

export const LoggedOutRouter = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />,
        <Route path="*" element={<NotFound />} />
        {ClientRoutes}
      </Routes>
    </BrowserRouter>
  );
};
