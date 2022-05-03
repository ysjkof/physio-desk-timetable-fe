import React, { useEffect } from "react";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "./apollo";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { CreatePatient } from "./pages/create-patient";
import { Test } from "./pages/test";
import { NotFound } from "./pages/404";
import { Account } from "./pages/account";
import { ConfirmEmail } from "./pages/confirm-email";
import { EditProfile } from "./pages/edit-profile";
import { TimeTable } from "./pages/time-table";
import { CreateAccount } from "./pages/create-account";
import { Login } from "./pages/login";
import { Search } from "./pages/search";
import { PateintDetail } from "./pages/patient-detail";
import { Dashboard } from "./pages/dash-board";
import { Group } from "./pages/group";
import { useMe } from "./hooks/useMe";
import {
  FindMyGroupsQuery,
  useFindMyGroupsQuery,
} from "./graphql/generated/graphql";
import { defaultViewOptions, groupListsVar, viewOptionsVar } from "./store";
import {
  LOCALSTORAGE_VIEW_OPTION,
  LOCALSTORAGE_VIEW_OPTION_GROUPS,
} from "./variables";
import { GroupWithOptions } from "./libs/timetable-utils";
import { ListPatient } from "./pages/list-patient";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const navigate = useNavigate();
  const { data: meData } = useMe();
  const { data: findMyGroupsData } = useFindMyGroupsQuery();

  function filterActivatedMemberInGroup(
    data: FindMyGroupsQuery | undefined | null
  ) {
    const result: GroupWithOptions[] = [];
    if (data && data.findMyGroups.groups) {
      data.findMyGroups.groups.forEach((group) => {
        const members = group.members
          .filter((member) => member.accepted && member.staying)
          .map((member) => ({
            ...member,
            activation: true,
            loginUser: member.user.id === meData?.me.id && true,
          }));
        result.push({ ...group, members, activation: true });
      });
    }
    return result;
  }

  const myGroups = filterActivatedMemberInGroup(findMyGroupsData);
  const localGroups: GroupWithOptions[] = JSON.parse(
    localStorage.getItem(LOCALSTORAGE_VIEW_OPTION_GROUPS + meData?.me.id)!
  );
  const localViewOptions = JSON.parse(
    localStorage.getItem(LOCALSTORAGE_VIEW_OPTION + meData?.me.id)!
  );

  useEffect(() => {
    if (meData) {
      if (localViewOptions === null) {
        localStorage.setItem(
          LOCALSTORAGE_VIEW_OPTION + meData.me.id,
          JSON.stringify(defaultViewOptions)
        );
      }
      viewOptionsVar(localViewOptions);
    }
  }, [meData]);

  useEffect(() => {
    let updatedMyGroups: GroupWithOptions[] = [];
    if (Array.isArray(localGroups) && localGroups.length >= 1) {
      updatedMyGroups = myGroups.map((myGroup) => {
        const index = localGroups.findIndex(
          (localGroup) => localGroup.id === myGroup.id
        );
        if (index === -1) {
          return myGroup;
        } else {
          const members = myGroup.members.map((myMember) => {
            const localMemberIndex = localGroups[index].members.findIndex(
              (localMember) => localMember.id === myMember.id
            );
            if (localMemberIndex === -1) {
              return myMember;
            } else {
              return localGroups[index].members[localMemberIndex];
            }
          });
          return {
            activation: localGroups[index].activation,
            id: localGroups[index].id,
            name: localGroups[index].name,
            members,
          };
        }
      });
    } else if (meData) {
      localStorage.setItem(
        LOCALSTORAGE_VIEW_OPTION_GROUPS + meData.me.id,
        JSON.stringify(myGroups)
      );
    }
    groupListsVar(updatedMyGroups);
  }, [myGroups]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {isLoggedIn ? (
          <>
            <Route path="confirm" element={<ConfirmEmail />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="tt" element={<TimeTable />} />
            <Route path="create-patient" element={<CreatePatient />} />
            <Route path="list-patient" element={<ListPatient />} />
            <Route path="search" element={<Search />} />
            <Route path="patient" element={<PateintDetail />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="group" element={<Group />} />

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
