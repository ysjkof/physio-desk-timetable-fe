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
  personalMenu,
} from '../../../../router/routes';

interface DashboardSideNavProps {
  meData: MeQuery;
  endpoint: DashboardEndpoint;
}

export const DashboardSideNav = ({
  meData,
  endpoint,
}: DashboardSideNavProps) => {
  const { clinicLists, setSelectedInfo, selectedInfo } = useStore();
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

  const changeSelectedClinic = (id: number, name: string, type: ClinicType) => {
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
      <Selectbox selectedValue={renameUseSplit(selectedInfo.clinic!.name)}>
        <Selectbox.Options>
          {clinicListsSelectMeMember.map((clinic) => (
            <Selectbox.Option
              key={clinic.id}
              selected={clinic.id === selectedInfo.clinic?.id}
              onClick={() =>
                changeSelectedClinic(clinic.id, clinic.name, clinic.type)
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
