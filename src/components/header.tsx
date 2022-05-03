import { useReactiveVar } from "@apollo/client";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../variables";
// import muoolLogo from "../images/logoMuoolJinBlue.svg";
import { useForm } from "react-hook-form";
import { useMe } from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-regular-svg-icons";

export const Header: React.FC = () => {
  // 비로그인일 때 useMe 호출되면 디버거 상태됨. 추후 처리할 것. 따로 모달창을 만드는 것 고려.
  const { error } = useMe();
  // const location = useLocation();
  // const state = location.state as { startDate: Date };
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const navigate = useNavigate();

  const { register, handleSubmit, getValues, setValue } = useForm();
  const onSubmitSearch = () => {
    const { search } = getValues();
    const searchTrim = search.trim();
    setValue("search", searchTrim);
    navigate(`/search?name=${searchTrim}`);
  };
  const logoutBtn = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    authTokenVar(null);
    isLoggedInVar(false);
    navigate("/");
  };

  useEffect(() => {
    if (error) {
      logoutBtn();
    }
  }, [error]);

  // console.log("HEADER LOCATION", location);
  return (
    <>
      {/* {data && !data?.me.verified && (
        <div className="bg-red-500 p-3 text-center">
          <span>Please verify your email.</span>
        </div>
      )} */}
      <header className="mb-2 border-b py-1">
        <div className="container mx-auto flex w-full items-center justify-between space-x-4 px-5  xl:px-0">
          <div className="flex w-full items-center gap-10">
            <Link to="/">
              {/* <img src={muoolLogo} className="w-36" alt="Muool" /> */}
              <span className="text-2xl font-black text-sky-500">Muool</span>
            </Link>
            <Link to="/community">
              <span className="text-lg text-gray-600">커뮤니티</span>
            </Link>
          </div>
          <div className="flex w-full items-baseline justify-end gap-4">
            <form onSubmit={handleSubmit(onSubmitSearch)}>
              <input
                {...register("search", { required: true })}
                type={"search"}
                placeholder="Search..."
                className="input-search w-28 rounded-md py-0"
              />
            </form>
            <span className="flex items-baseline gap-4">
              {isLoggedIn ? (
                <>
                  <Link to="/tt">
                    <span className="whitespace-nowrap text-lg text-gray-600">
                      시간표
                    </span>
                  </Link>
                  <div className="group relative cursor-pointer">
                    <FontAwesomeIcon fontSize={"large"} icon={faBell} />
                    <div className="dropdown absolute top-6 right-0 z-50 hidden h-80 w-60 flex-col items-center overflow-y-scroll border bg-white py-2 px-4 shadow-cst group-hover:flex">
                      {/* <span className="break-all">
                        apple apple apple appleappleappleapple apple apple apple
                        apple apple apple appleapple
                      </span> */}
                    </div>
                  </div>
                  <div className="group relative cursor-pointer">
                    <FontAwesomeIcon fontSize={"large"} icon={faUser} />
                    <div className="dropdown absolute top-6 right-0 z-50 hidden w-40 flex-col items-center border bg-white py-2 px-4 shadow-cst group-hover:flex">
                      <Link
                        to="/edit-profile"
                        className="w-full text-center hover:bg-blue-200"
                      >
                        프로필
                      </Link>
                      <div className="seperate-bar"></div>
                      <Link
                        to="/group"
                        className="w-full text-center hover:bg-blue-200"
                      >
                        병의원
                      </Link>
                      <div className="seperate-bar"></div>
                      <button
                        className="w-full text-center hover:bg-blue-200"
                        onClick={logoutBtn}
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link to="/account/login">
                  <span className="whitespace-nowrap">로그인/회원가입</span>
                </Link>
              )}
            </span>
          </div>
        </div>
      </header>
    </>
  );
};
