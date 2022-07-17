import { useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../variables";
import { useForm } from "react-hook-form";
import { useMe } from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  ClinicType,
  useFindMyClinicsQuery,
} from "../graphql/generated/graphql";
import {
  IClinicList,
  IClinic,
  loggedInUserVar,
  viewOptionsVar,
  ISelectedClinic,
} from "../store";
import {
  LOCALSTORAGE_SELECTED_CLINIC,
  LOCALSTORAGE_VIEW_OPTION,
  LOCALSTORAGE_CLINIC_LISTS,
} from "../variables";
import { saveClinicLists, saveSelectedClinic } from "../libs/utils";

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
    if (!findMyClinicsData || !findMyClinicsData.findMyClinics.clinics) return;

    const { clinics } = findMyClinicsData.findMyClinics;
    let updatedMyClinics: IClinicList[] = [];

    function injectKeyValue(clinics: IClinic[]): IClinicList[] {
      return clinics.map((clinic) => {
        const members = clinic.members.map((member) => ({
          ...member,
          isActivate: true,
        }));
        return { ...clinic, members };
      });
    }

    const myClinics = injectKeyValue(clinics);

    const localClinics: IClinicList[] = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_CLINIC_LISTS + meData.me.id)!
    );
    if (localClinics) {
      updatedMyClinics = myClinics.map((clinic) => {
        const localClinic = localClinics.find(
          (localClinic) => localClinic.id === clinic.id
        );

        if (!localClinic) return clinic;

        return {
          ...localClinic,
          id: clinic.id,
          name: clinic.name,
          type: clinic.type,
          members: clinic.members.map((member) => {
            const sameMember = localClinic.members.find(
              (lgm) => lgm.id === member.id
            );
            return {
              ...member,
              ...(sameMember && { isActivate: sameMember.isActivate }),
            };
          }),
        };
      });
    }
    if (!localClinics) updatedMyClinics = myClinics;

    saveClinicLists(updatedMyClinics, meData.me.id);

    function makeSelectedClinic(clinic: IClinicList, userId: number) {
      return {
        id: clinic.id,
        name: clinic.name,
        type: clinic.type,
        isManager: !!clinic.members.find((member) => member.user.id === userId)
          ?.manager,
        isStayed: !!clinic.members.find((member) => member.user.id === userId)
          ?.staying,
        members: clinic.members,
      };
    }
    const localSelectClinic: ISelectedClinic = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_SELECTED_CLINIC + meData.me.id)!
    );
    const clinic = updatedMyClinics.find((clinic) =>
      localSelectClinic
        ? clinic.id === localSelectClinic.id
        : clinic.type === ClinicType.Personal
    );
    if (!clinic) return;
    const newSelectedClinic = makeSelectedClinic(clinic, meData.me.id);
    saveSelectedClinic(newSelectedClinic, meData.me.id);
  }, [findMyClinicsData]);

  return (
    <>
      {/* {data && !data?.me.verified && (
        <div className="bg-red-500 p-3 text-center">
          <span>Please verify your email.</span>
        </div>
      )} */}
      <header className="HEADER header" id="header">
        <div className="flex w-full items-center gap-10">
          <Link to="/">
            {/* <img src={muoolLogo} className="w-36" alt="Muool" /> */}
            <span className="header-title">Muool</span>
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
                <div className="DROPDOWN absolute top-6 right-0 z-50 hidden h-80 w-60 flex-col items-center overflow-y-scroll border bg-white py-2 px-4 shadow-cst group-hover:flex">
                  {!notices || notices.length === 0
                    ? "알림이 없습니다."
                    : notices.map((notice) => (
                        <span className="break-all">{notice.message}</span>
                      ))}
                </div>
              </div>
              <div className="group relative cursor-pointer">
                <FontAwesomeIcon fontSize={24} icon={faUser} />
                <div className="DROPDOWN absolute top-[1.4rem] right-0 z-50 hidden w-40 flex-col items-center border bg-white py-2 px-4 shadow-cst group-hover:flex">
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
