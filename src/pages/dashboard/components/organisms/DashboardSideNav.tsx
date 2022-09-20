import { checkStay } from '../../Dashboard';
import { ClinicType, MeQuery } from '../../../../graphql/generated/graphql';
import { renameUseSplit } from '../../../../utils/utils';
import useStore from '../../../../hooks/useStore';
import {
  clinicMenu,
  DashboardEndpoint,
  personalMenu,
} from '../../../../router/routes';
import localStorageUtils from '../../../../utils/localStorageUtils';
import Sidebar from '../../../../components/molecules/Sidebar';
import Selectbox from '../../../../components/molecules/Selectbox';

interface DashboardSideNavProps {
  meData: MeQuery;
  endpoint: DashboardEndpoint;
  isAccepted: boolean | undefined;
}

export default function DashboardSideNav({
  meData,
  endpoint,
  isAccepted,
}: DashboardSideNavProps) {
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
      isManager: Boolean(
        meData.me.members?.find(
          (member) => member.clinic.id === id && member.manager
        )
      ),
      isStayed: checkStay(id, meData),
    };
    setSelectedInfo('clinic', newSelectedClinic, () =>
      localStorageUtils.set({
        key: 'selectedClinic',
        userId: meData.me.id,
        userName: meData.me.name,
        value: newSelectedClinic,
      })
    );
  };

  const changeName = (name: string, isAccepted?: boolean) => {
    let prefix = '';
    if (!isAccepted) {
      prefix = '수락대기 : ';
    }

    return prefix + renameUseSplit(name);
  };

  return (
    <nav className="dashboard-side-nav h-full">
      <Selectbox
        selectedValue={changeName(selectedInfo.clinic!.name, isAccepted)}
      >
        <Selectbox.Options>
          {clinicListsSelectMeMember.map((clinic) => (
            <Selectbox.Option
              key={clinic.id}
              selected={clinic.id === selectedInfo.clinic?.id}
              onClick={() =>
                changeSelectedClinic(clinic.id, clinic.name, clinic.type)
              }
            >
              {changeName(clinic.name, clinic.member.accepted)}
            </Selectbox.Option>
          ))}
        </Selectbox.Options>
      </Selectbox>

      <Sidebar disable={!isAccepted}>
        <Sidebar.Ul title="병원">
          {clinicMenu.map((menu, idx) => (
            <Sidebar.Li
              key={idx}
              to={menu.route}
              selected={endpoint === menu.route}
            >
              {menu.name}
            </Sidebar.Li>
          ))}
        </Sidebar.Ul>

        <Sidebar.Ul title="개인">
          {personalMenu.map((menu, idx) => (
            <Sidebar.Li
              key={idx}
              to={menu.route}
              selected={endpoint === menu.route}
            >
              {menu.name}
            </Sidebar.Li>
          ))}
        </Sidebar.Ul>
      </Sidebar>
    </nav>
  );
}
