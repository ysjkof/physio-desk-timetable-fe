import { useState } from 'react';
import { checkManager, checkStay, SelectedMenuType } from '..';
import { ClinicType, MeQuery } from '../../../graphql/generated/graphql';
import {
  checkMember,
  removeItemInArrayByIndex,
  setLocalStorage,
} from '../../../utils/utils';
import useStore from '../../../hooks/useStore';
import Sidebar from '../../../components/organisms/Sidebar';
import Selectbox from '../../../components/organisms/Selectbox';
import { useLocation } from 'react-router-dom';

interface SelectedOption {
  id: number;
  value: string;
  type: ClinicType;
}
interface DashboardSideNavProps {
  selectedMenu: SelectedMenuType;
  meData: MeQuery;
}

export const DashboardSideNav = ({ meData }: DashboardSideNavProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const isMatch = (endpoint: string) => pathname.includes(endpoint);

  const { clinicLists, setSelectedInfo } = useStore();
  const clinicListsSelectMeMember = clinicLists.map((clinic) => {
    const idx = clinic.members.findIndex(
      (member) => member.user.id === meData.me.id
    );
    return {
      id: clinic.id,
      name: clinic.name,
      type: clinic.type,
      member: clinic.members[idx],
    };
  });

  const [selectedOption, setSelectedOption] = useState<SelectedOption>({
    id: clinicListsSelectMeMember[0].id,
    value: clinicListsSelectMeMember[0].name,
    type: clinicListsSelectMeMember[0].type,
  });
  const selectOption = (selectedOption: SelectedOption) => {
    setSelectedOption(selectedOption);
  };
  const handleClickOption = (id: number, name: string, type: ClinicType) => {
    selectOption({ id, value: name, type });
    const newSelectedClinic = {
      id,
      name,
      type,
      members:
        clinicLists.find((clinicInFind) => clinicInFind.id === id)?.members ??
        [],
      isManager: checkManager(id, meData),
      isStayed: checkStay(id, meData),
    };
    setSelectedInfo('clinic', newSelectedClinic, () =>
      setLocalStorage({
        key: 'SELECTED_CLINIC',
        userId: meData.me.id,
        userName: meData.me.name,
        value: newSelectedClinic,
      })
    );
  };

  const removePersonalClinicNumber = (name: string) => {
    const splitted = name.split(':');
    return removeItemInArrayByIndex(splitted.length - 1, splitted);
  };
  const renameBaseOnType = (name: string, type: ClinicType) => {
    return type === ClinicType.Personal
      ? removePersonalClinicNumber(name) + ' : 기본'
      : name;
  };
  return (
    <nav className="dashboard-side-nav h-full">
      <Selectbox
        selectedValue={renameBaseOnType(
          selectedOption.value,
          selectedOption.type
        )}
      >
        <Selectbox.Options>
          {clinicListsSelectMeMember.map((clinic) => (
            <Selectbox.Option
              key={clinic.id}
              selected={clinic.id === selectedOption.id}
              onClick={() =>
                handleClickOption(clinic.id, clinic.name, clinic.type)
              }
              suffix={
                checkMember(clinic.member.staying, clinic.member.accepted) ===
                '수락대기'
                  ? '수락대기'
                  : ''
              }
            >
              {renameBaseOnType(clinic.name, clinic.type)}
            </Selectbox.Option>
          ))}
        </Selectbox.Options>
      </Selectbox>

      <Sidebar>
        <Sidebar.Ul>
          {[
            { route: 'member', name: '구성원' },
            { route: 'invite', name: '초대' },
          ].map((menu, idx) => (
            <Sidebar.Li
              key={idx}
              to={menu.route}
              selectedLi={isMatch(menu.route)}
            >
              {menu.name}
            </Sidebar.Li>
          ))}
        </Sidebar.Ul>
        <Sidebar.Ul>
          {[
            { route: 'prescription', name: '처방관리' },
            { route: 'statistics', name: '통계' },
          ].map((menu, idx) => (
            <Sidebar.Li
              key={idx}
              to={menu.route}
              selectedLi={isMatch(menu.route)}
            >
              {menu.name}
            </Sidebar.Li>
          ))}
        </Sidebar.Ul>
        <Sidebar.Ul>
          {[
            { route: 'create', name: '병원 만들기' },
            { route: 'clinics', name: '나의 병원' },
          ].map((menu, idx) => (
            <Sidebar.Li
              key={idx}
              to={menu.route}
              selectedLi={isMatch(menu.route)}
            >
              {menu.name}
            </Sidebar.Li>
          ))}
        </Sidebar.Ul>
      </Sidebar>
    </nav>
  );
};
