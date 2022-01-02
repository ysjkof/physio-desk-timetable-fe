import { useReactiveVar } from "@apollo/client";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { isLoggedInVar } from "../apollo";
import { useMe } from "../hooks/useMe";
import muoolLogo from "../images/logoMuoolJinBlue.svg";

export const Header: React.FC = () => {
  const { data } = useMe();
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  return (
    <>
      {isLoggedIn && !data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-base">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5  xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={muoolLogo} className="w-44" alt="Muool" />
          </Link>
          <span className="text-xs">
            {isLoggedIn ? (
              <Link to="/edit-profile">
                <FontAwesomeIcon icon={faUser} className="text-3xl" />
                {data?.me.email}
              </Link>
            ) : (
              <Link to="/login">
                <span className="text-3xl">LOG-IN</span>
              </Link>
            )}
          </span>
        </div>
      </header>
    </>
  );
};
