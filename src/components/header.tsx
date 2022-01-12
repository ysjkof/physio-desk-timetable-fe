import { useReactiveVar } from "@apollo/client";
import {
  faSignOutAlt,
  faTable,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { useMe } from "../hooks/useMe";
import muoolLogo from "../images/logoMuoolJinBlue.svg";

export const Header: React.FC = () => {
  const { data } = useMe();
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const navigate = useNavigate();
  const logoutBtn = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    // authTokenVar(token);
    isLoggedInVar(false);
    navigate("/");
  };

  return (
    <>
      {data && !data?.me.verified && (
        <div className="bg-red-500 p-3 text-center">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5  xl:px-0 container mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={muoolLogo} className="w-44" alt="Muool" />
          </Link>
          <span className="text-xs flex gap-5 items-center">
            {isLoggedIn ? (
              <>
                <Link to="/tt">
                  <FontAwesomeIcon icon={faTable} className="text-3xl" />
                </Link>
                <Link to="/edit-profile">
                  <FontAwesomeIcon icon={faUser} className="text-3xl" />
                </Link>
                <button className="text-3xl" onClick={logoutBtn}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-3xl" />
                </button>
              </>
            ) : (
              <Link to="/login">
                <span className="text-3xl">Log-in</span>
              </Link>
            )}
          </span>
        </div>
      </header>
    </>
  );
};
