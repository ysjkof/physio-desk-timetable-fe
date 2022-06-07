import { useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN, ONE_WEEK } from "../variables";
import { useForm } from "react-hook-form";
import { useMe } from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  FindMyClinicsQuery,
  useFindMyClinicsQuery,
} from "../graphql/generated/graphql";
import { ClinicWithOptions } from "../libs/timetable-utils";
import {
  loggedInUserVar,
  selecteMe,
  selectedClinicVar,
  viewOptionsVar,
} from "../store";
import {
  LOCALSTORAGE_SELECTED_CLINIC,
  LOCALSTORAGE_VIEW_OPTION,
  LOCALSTORAGE_CLINIC_LISTS,
} from "../variables";
import { saveClinicLists, saveSelectedClinic } from "../libs/utils";

function filterActivatedMemberInClinic(
  data: FindMyClinicsQuery | undefined | null,
  loggedInUserId: number
) {
  const result: ClinicWithOptions[] = [];
  if (data && data.findMyClinics.clinics) {
    data.findMyClinics.clinics.forEach((clinic) => {
      const isAccepted = clinic.members.find(
        (member) => member.user.id === loggedInUserId && member.accepted
      );
      if (isAccepted) {
        const members = clinic.members
          .filter((member) => member.accepted && member.staying)
          .map((member) => ({
            ...member,
            activation: true,
            loginUser: member.user.id === loggedInUserId && true,
          }));
        if (Array.isArray(members) && members[0]) {
          result.push({ ...clinic, members });
        }
      }
    });
  }
  return result;
}
interface Notice {
  __typename?: "Notice" | undefined;
  message: string;
  read: boolean;
}

export const Header = () => {
  const { data: meData, error } = useMe();
  const [notices, setNotices] = useState<Notice[] | null>(null);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const viewOptions = useReactiveVar(viewOptionsVar);

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
      console.error("Error : User Data,", error);
      logoutBtn();
    }
  }, [error]);

  useEffect(() => {
    console.log(1, "시작 Header : in useEffect");
    if (!meData) return;
    if (meData.me.notice) {
      setNotices(meData.me.notice);
    }
    const localViewOptions = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_VIEW_OPTION + meData.me.id)!
    );

    if (localViewOptions === null) {
      localStorage.setItem(
        LOCALSTORAGE_VIEW_OPTION + meData.me.id,
        JSON.stringify(viewOptions)
      );
    } else {
      viewOptionsVar(localViewOptions);
    }
    loggedInUserVar(meData.me);
  }, [meData]);

  const { data: findMyClinicsData } = useFindMyClinicsQuery({
    variables: { input: { includeInactivate: true } },
  });

  useEffect(() => {
    console.log(2, "시작 Header : in useEffect");
    if (!meData) return;
    let updatedMyClinics: ClinicWithOptions[] = [];
    const myClinics = filterActivatedMemberInClinic(
      findMyClinicsData,
      meData.me.id
    );

    const localClinics: ClinicWithOptions[] = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_CLINIC_LISTS + meData.me.id)!
    );
    if (localClinics) {
      updatedMyClinics = myClinics.map((g) => {
        const existLocalClinic = localClinics.find((lg) => lg.id === g.id);
        if (existLocalClinic) {
          return {
            id: g.id,
            name: g.name,
            members: g.members.map((gm) => {
              const sameMember = existLocalClinic.members.find(
                (lgm) => lgm.id === gm.id
              );
              return {
                ...gm,
                ...(sameMember && { activation: sameMember.activation }),
              };
            }),
          };
        } else {
          return g;
        }
      });
    } else {
      updatedMyClinics = myClinics;
    }
    saveClinicLists(updatedMyClinics, meData.me.id);

    const localSelectClinic: typeof selecteMe = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_SELECTED_CLINIC + meData.me.id)!
    );
    if (
      localSelectClinic &&
      myClinics.find((g) => g.id === localSelectClinic.id)
    ) {
      selectedClinicVar(localSelectClinic);
    } else {
      saveSelectedClinic(selecteMe, meData.me.id);
    }
  }, [findMyClinicsData]);

  return (
    <>
      {/* {data && !data?.me.verified && (
        <div className="bg-red-500 p-3 text-center">
          <span>Please verify your email.</span>
        </div>
      )} */}
      <header className="header" id="header">
        <div className="flex w-full items-center gap-10 py-1">
          <Link to="/">
            {/* <img src={muoolLogo} className="w-36" alt="Muool" /> */}
            <span className="header-title">Muool</span>
          </Link>
          <Link to="/community">
            <span>커뮤니티</span>
          </Link>
        </div>
        <div className="flex w-full items-center justify-end gap-6">
          <form onSubmit={handleSubmit(onSubmitSearch)}>
            <input
              {...register("search", { required: true })}
              type={"search"}
              placeholder="Search..."
              className="header-search w-28 rounded-md"
            />
          </form>

          {isLoggedIn ? (
            <>
              <Link to="/tt">
                <span className="whitespace-nowrap  ">시간표</span>
              </Link>
              <div className="group relative cursor-pointer">
                <FontAwesomeIcon fontSize={24} icon={faBell} />
                <div className="dropdown absolute top-6 right-0 z-50 hidden h-80 w-60 flex-col items-center overflow-y-scroll border bg-white py-2 px-4 shadow-cst group-hover:flex">
                  {!notices || notices.length === 0
                    ? "알림이 없습니다."
                    : notices.map((notice) => (
                        <span className="break-all">{notice.message}</span>
                      ))}
                </div>
              </div>
              <div className="group relative cursor-pointer">
                <FontAwesomeIcon fontSize={24} icon={faUser} />
                <div className="dropdown absolute top-6 right-0 z-50 hidden w-40 flex-col items-center border bg-white py-2 px-4 shadow-cst group-hover:flex">
                  <Link
                    to="/edit-profile"
                    className="w-full text-center hover:bg-blue-200"
                  >
                    프로필
                  </Link>
                  <div className="seperate-bar"></div>
                  <Link
                    to="/dashboard"
                    className="w-full text-center hover:bg-blue-200"
                  >
                    대시보드
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
        </div>
      </header>
    </>
  );
};
