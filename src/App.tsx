import { useEffect } from "react";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "./apollo";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { Test } from "./pages/test";
import { NotFound } from "./pages/404";
import { Account } from "./pages/account";
import { ConfirmEmail } from "./pages/confirm-email";
import { EditProfile } from "./pages/edit-profile";
import { TimeTable } from "./pages/timetable";
import { CreateAccount } from "./pages/create-account";
import { Login } from "./pages/login";
import { Search } from "./pages/search";
import { PateintDetail } from "./pages/patient-detail";
import { Dashboard } from "./pages/dashboard";
import { useMe } from "./hooks/useMe";
import {
  selectedClinic,
  selectedClinicVar,
  clinicListsVar,
  viewOptionsVar,
} from "./store";
import {
  LOCALSTORAGE_SELECTED_CLINIC,
  LOCALSTORAGE_VIEW_OPTION,
  LOCALSTORAGE_VIEW_OPTION_CLINICS,
  ONE_WEEK,
} from "./variables";
import { ClinicWithOptions, IViewOption } from "./libs/timetable-utils";
import { ListPatient } from "./pages/list-patient";
import {
  FindMyClinicsQuery,
  useFindMyClinicsQuery,
} from "./graphql/generated/graphql";

const defaultViewOptions: IViewOption = {
  periodToView: ONE_WEEK,
  seeCancel: true,
  seeNoshow: true,
  seeList: false,
  seeActiveOption: false,
  navigationExpand: false,
};

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data: meData } = useMe();
  const { data: findMyClinicsData } = useFindMyClinicsQuery({
    variables: { input: { includeInactivate: true } },
  });

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

  useEffect(() => {
    if (!meData) return;
    const localViewOptions = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_VIEW_OPTION + meData.me.id)!
    );

    if (localViewOptions === null) {
      localStorage.setItem(
        LOCALSTORAGE_VIEW_OPTION + meData.me.id,
        JSON.stringify(defaultViewOptions)
      );
    }
    viewOptionsVar(localViewOptions);
  }, [meData]);

  useEffect(() => {
    if (!meData) return;
    let updatedMyClinics: ClinicWithOptions[] = [];
    const myClinics = filterActivatedMemberInClinic(
      findMyClinicsData,
      meData.me.id
    );

    const localClinics: ClinicWithOptions[] = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_VIEW_OPTION_CLINICS + meData.me.id)!
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
              if (sameMember) {
                return sameMember;
              } else {
                return gm;
              }
            }),
          };
        } else {
          return g;
        }
      });
    } else {
      updatedMyClinics = myClinics;
    }
    localStorage.setItem(
      LOCALSTORAGE_VIEW_OPTION_CLINICS + meData.me.id,
      JSON.stringify(updatedMyClinics)
    );
    clinicListsVar(updatedMyClinics);

    const localSelectClinic: typeof selectedClinic = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_SELECTED_CLINIC + meData.me.id)!
    );
    if (
      localSelectClinic &&
      myClinics.find((g) => g.id === localSelectClinic.id)
    ) {
      selectedClinicVar(localSelectClinic);
    } else {
      localStorage.setItem(
        LOCALSTORAGE_SELECTED_CLINIC + meData.me.id,
        JSON.stringify(selectedClinic)
      );
      selectedClinicVar(selectedClinic);
    }
  }, [findMyClinicsData]);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {isLoggedIn ? (
          <>
            <Route path="confirm" element={<ConfirmEmail />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="tt" element={<TimeTable />} />
            <Route path="list-patient" element={<ListPatient />} />
            <Route path="search" element={<Search />} />
            <Route path="patient" element={<PateintDetail />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="test" element={<Test />} />
          </>
        ) : (
          <>
            <Route path="/account" element={<Account />}>
              <Route path="login" element={<Login />} />
              <Route path="create" element={<CreateAccount />} />
            </Route>
          </>
        )}
        <Route path="/about" element={<h1>hghh</h1>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
