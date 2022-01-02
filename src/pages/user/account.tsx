import React from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import muoolLogo from "../../images/logoMuoolJinBlue.svg";

export const Account = () => {
  const location = useLocation();

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <Link to="/">
          <img alt="Muool" src={muoolLogo} className=" w-80 mb-5" />
        </Link>
        <Outlet />

        <NavLink
          to="/create-account"
          className={
            location.pathname === "/create-account"
              ? "text-sky-500 hover:underline font-bold"
              : "text-sky-500 hover:underline opacity-50"
          }
        >
          <span className="text-black">계정이 없습니까? </span>
          회원가입
        </NavLink>

        <NavLink
          to="/"
          className={
            location.pathname === "/"
              ? "text-sky-500 hover:underline font-bold"
              : "text-sky-500 hover:underline opacity-50"
          }
        >
          <span className="text-black">이미 계정이 있습니까? </span>
          로그인
        </NavLink>
      </div>
    </div>
  );
};
