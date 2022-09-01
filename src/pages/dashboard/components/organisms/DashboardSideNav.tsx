import { useState } from 'react';
import { checkManager, checkStay } from '../..';
import { ClinicType, MeQuery } from '../../../../graphql/generated/graphql';
import {
  checkMember,
  renameUseSplit,
  setLocalStorage,
} from '../../../../utils/utils';
import useStore from '../../../../hooks/useStore';
import Sidebar from '../../../../components/organisms/Sidebar';
import Selectbox from '../../../../components/organisms/Selectbox';
import {
  clinicMenu,
  DashboardEndpoint,
  ENDPOINT,
  personalMenu,
} from '../../../../router/routes';

interface SelectedOption {
  id: number;
  value: string;
  type: ClinicType;
}
interface DashboardSideNavProps {
  meData: MeQuery;
  endpoint: DashboardEndpoint;
}

export const DashboardSideNav = ({
  meData,
  endpoint,
}: DashboardSideNavProps) => {
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
        key: 'selectedClinic',
        userId: meData.me.id,
        userName: meData.me.name,
        value: newSelectedClinic,
      })
    );
  };

  return (
    <nav className="dashboard-side-nav h-full">
      <Selectbox selectedValue={renameUseSplit(selectedOption.value)}>
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
              {renameUseSplit(clinic.name)}
            </Selectbox.Option>
          ))}
        </Selectbox.Options>
      </Selectbox>

      <Sidebar>
        <Sidebar.Ul>
          {clinicMenu.map((menu, idx) => (
            <Sidebar.Li
              key={idx}
              to={menu.route}
              selectedLi={endpoint === menu.route}
            >
              {menu.name}
            </Sidebar.Li>
          ))}
        </Sidebar.Ul>

        <Sidebar.Ul>
          {personalMenu.map((menu, idx) => (
            <Sidebar.Li
              key={idx}
              to={menu.route}
              selectedLi={endpoint === menu.route}
            >
              {menu.name}
            </Sidebar.Li>
          ))}
        </Sidebar.Ul>
      </Sidebar>
    </nav>
  );
};