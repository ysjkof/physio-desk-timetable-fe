import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateAccount } from "../pages/create-account";
import { Login } from "../pages/login";

export const LoggedOutRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="create-account" element={<CreateAccount />} />
      </Routes>
    </BrowserRouter>
  );
};
