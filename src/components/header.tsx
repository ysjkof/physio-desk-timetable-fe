import { useReactiveVar } from "@apollo/client";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../libs/variables";
import { useMe } from "../hooks/useMe";
import muoolLogo from "../images/logoMuoolJinBlue.svg";

export const Header: React.FC = () => {
  const { data } = useMe();
  const location = useLocation();
  // const state = location.state as { startDate: Date };
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const navigate = useNavigate();
  const logoutBtn = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    // authTokenVar(token);
    isLoggedInVar(false);
    navigate("/");
  };
  console.log("HEADER LOCATION", location);

  return (
    <>
      {data && !data?.me.verified && (
        <div className="bg-red-500 p-3 text-center">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4">
        <div className="container mx-auto  flex w-full items-center justify-between space-x-4 px-5 xl:px-0">
          <Link to="/">
            <img src={muoolLogo} className="w-36" alt="Muool" />
          </Link>
          <div className="h-6 w-40 bg-pink-200">
            {location.pathname === "/tt" && ""}
          </div>
          <input
            type={"search"}
            className="w-full rounded-full border"
            placeholder="Search..."
          />
          <span className="flex items-center gap-5 text-xs">
            {isLoggedIn ? (
              <>
                <Link to="/tt">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </Link>
                <Link to="/edit-profile">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
                <button className="text-3xl" onClick={logoutBtn}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <Link to="/account/login">
                <span className="whitespace-nowrap">로그인/회원가입</span>
              </Link>
            )}
          </span>
        </div>
      </header>
    </>
  );
};
