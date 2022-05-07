import { useEffect } from "react";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "./apollo";
import { Route, Routes } from "react-router-dom";
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
import { Dashboard } from "./pages/dashboard";
import { useMe } from "./hooks/useMe";
import {
  FindMyGroupsQuery,
  useFindMyGroupsQuery,
} from "./graphql/generated/graphql";
import {
  FocusGroup,
  focusGroupVar,
  groupListsVar,
  viewOptionsVar,
} from "./store";
import {
  LOCALSTORAGE_FOCUS_GROUP,
  LOCALSTORAGE_VIEW_OPTION,
  LOCALSTORAGE_VIEW_OPTION_GROUPS,
  ONE_WEEK,
} from "./variables";
import { GroupWithOptions, IViewOption } from "./libs/timetable-utils";
import { ListPatient } from "./pages/list-patient";

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
  const { data: findMyGroupsData } = useFindMyGroupsQuery({
    variables: { input: { includeField: "all" } },
  });

  function filterActivatedMemberInGroup(
    data: FindMyGroupsQuery | undefined | null,
    loggedInUserId: number
  ) {
    const result: GroupWithOptions[] = [];
    if (data && data.findMyGroups.groups) {
      data.findMyGroups.groups.forEach((group) => {
        const isAccepted = group.members.find(
          (member) => member.user.id === loggedInUserId && member.accepted
        );
        if (isAccepted) {
          const members = group.members
            .filter(
              (member) =>
                // member.user.id === loggedInUserId &&
                member.accepted && member.staying
            )
            .map((member) => ({
              ...member,
              activation: true,
              loginUser: member.user.id === loggedInUserId && true,
            }));
          if (Array.isArray(members) && members[0]) {
            result.push({ ...group, members, activation: true });
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
    let updatedMyGroups: GroupWithOptions[] = [];
    const myGroups = filterActivatedMemberInGroup(
      findMyGroupsData,
      meData.me.id
    );

    const localGroups: GroupWithOptions[] = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_VIEW_OPTION_GROUPS + meData.me.id)!
    );

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
              return {
                ...myMember,
                activation:
                  localGroups[index].members[localMemberIndex].activation,
              };
            }
          });
          return {
            activation: localGroups[index].activation,
            id: myGroup.id,
            name: myGroup.name,
            members,
          };
        }
      });
    } else {
      updatedMyGroups = myGroups;
    }
    localStorage.setItem(
      LOCALSTORAGE_VIEW_OPTION_GROUPS + meData.me.id,
      JSON.stringify(updatedMyGroups)
    );
    groupListsVar(updatedMyGroups);

    const localFocusGroup: FocusGroup = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_FOCUS_GROUP + meData.me.id)!
    );

    let newFocusGroup: FocusGroup | null = null;
    if (localFocusGroup && updatedMyGroups.length >= 1) {
      if (localFocusGroup.id === null) return;
      const index = updatedMyGroups.findIndex(
        (group) =>
          group.id === localFocusGroup.id && group.name === localFocusGroup.name
      );
      index !== -1
        ? (newFocusGroup = {
            id: updatedMyGroups[index].id,
            name: updatedMyGroups[index].name,
          })
        : (newFocusGroup = {
            id: updatedMyGroups[updatedMyGroups.length - 1].id,
            name: updatedMyGroups[updatedMyGroups.length - 1].name,
          });
    } else if (!localFocusGroup && updatedMyGroups.length >= 1) {
      newFocusGroup = {
        id: updatedMyGroups[updatedMyGroups.length - 1].id,
        name: updatedMyGroups[updatedMyGroups.length - 1].name,
      };
    }
    if (newFocusGroup) {
      localStorage.setItem(
        LOCALSTORAGE_FOCUS_GROUP + meData.me.id,
        JSON.stringify(newFocusGroup)
      );
      focusGroupVar(newFocusGroup);
    } else {
      localStorage.removeItem(LOCALSTORAGE_FOCUS_GROUP + meData.me.id);
      focusGroupVar(null);
    }
  }, [findMyGroupsData]);

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
