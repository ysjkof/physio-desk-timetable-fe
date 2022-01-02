import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NotFound } from "../pages/404";
import { Login } from "../pages/user/login";
import { Account } from "../pages/user/account";
import { CreateAccount } from "../pages/user/create-account";

export const LoggedOutRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Account />}>
          <Route index element={<Login />} />
          <Route path="create-account" element={<CreateAccount />} />
        </Route>
        <Route path="/about" element={<h1>hghh</h1>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
