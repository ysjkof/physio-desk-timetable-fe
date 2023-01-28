import { useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import { ClinicsOfClient } from '../../models';
import { clinicListsVar } from '../../store';
import {
  cls,
  getMemberState,
  sortByBoolean,
  sortByString,
} from '../../utils/common.utils';
import {
  ColumnContainer,
  MenuContainer,
  Profile,
  SearchAndInviteUser,
} from './components';
import { USER_COLORS } from '../../constants/constants';
import { VerticalCrossArrow } from '../../svgs';

const Dashboard = () => {
  useReactiveVar(clinicListsVar); // 리렌더 위한 선언
  const [members, setMembers] = useState(
    ClinicsOfClient.getSelectedClinic().members
  );
  const [sortingCriteria, setSortingCriteria] = useState({
    letter: false,
    waitingForApproval: false,
  });

  const sortByLetter = () => {
    if (!sortingCriteria.letter) sortAscByLetter();
    else sortDescByLetter();
    setSortingCriteria((prev) => ({ ...prev, letter: !prev.letter }));
  };

  const sortAscByLetter = () => {
    setMembers((prev) => [
      ...prev.sort((a, b) => sortByString(a.user.name, b.user.name, 'ASC')),
    ]);
  };

  const sortDescByLetter = () => {
    setMembers((prev) => [
      ...prev.sort((a, b) => sortByString(a.user.name, b.user.name, 'DESC')),
    ]);
  };

  const sortByWaitingForApproval = () => {
    if (!sortingCriteria.waitingForApproval) sortAscByWaitingForApproval();
    else sortDescByWaitingForApproval();
    setSortingCriteria((prev) => ({
      ...prev,
      waitingForApproval: !prev.waitingForApproval,
    }));
  };

  const sortAscByWaitingForApproval = () => {
    setMembers((prev) => [
      ...prev.sort((a, b) => sortByBoolean(a.accepted, b.accepted, 'ASC')),
    ]);
  };

  const sortDescByWaitingForApproval = () => {
    setMembers((prev) => [
      ...prev.sort((a, b) => sortByBoolean(a.accepted, b.accepted, 'DESC')),
    ]);
  };

  return (
    <div className="flex">
      <ColumnContainer>
        <Profile />
        <MenuContainer />
      </ColumnContainer>
      <div className="flex h-full w-[360px] flex-col overflow-y-scroll border-r border-r-table-line pt-16">
        <h1 className="mb-8 pl-4 text-3xl font-medium">직원열람 및 관리</h1>
        <SearchAndInviteUser />
        <div className="mb-8 border-y">
          <div className="flex gap-8 border-b py-2 px-4 text-xs">
            <button
              type="button"
              className="flex gap-1"
              onClick={sortByWaitingForApproval}
            >
              <VerticalCrossArrow /> 승인대기
            </button>
            <button type="button" className="flex gap-1" onClick={sortByLetter}>
              <VerticalCrossArrow /> 가나다
            </button>
          </div>
          <ul className="h-auto divide-y">
            {members.map((member, idx) => {
              const memberState = getMemberState({
                staying: member.staying,
                accepted: member.accepted,
                manager: member.manager,
              });
              return (
                <li
                  key={member.id}
                  className="flex items-center justify-between gap-4 py-4 px-4 text-base"
                >
                  <span
                    className="aspect-square w-9 rounded-md bg-red-200 text-center text-white"
                    style={{ backgroundColor: USER_COLORS[idx].deep }}
                  >
                    {member.user.name.substring(0, 1)}
                  </span>
                  <span className="basis-full text-table-aside-bg">
                    {member.user.name}
                  </span>
                  <span
                    className={cls(
                      'w-24',
                      memberState === '승인대기'
                        ? 'text-caution'
                        : 'text-table-day-strong'
                    )}
                  >
                    {memberState}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
