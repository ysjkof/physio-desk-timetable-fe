import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { checkManager, checkStay, SelectedMenuType } from '..';
import { ModalTemplate } from '../../../components/molecules/ModalTemplate';
import { MeQuery } from '../../../graphql/generated/graphql';
import {
  checkMember,
  getPositionRef,
  setLocalStorage,
} from '../../../utils/utils';
import { DashboardNavList } from '../components/DashboardNavList';
import useStore from '../../../hooks/useStore';
import { ClinicName } from '../molecules/clinicName';

interface DashboardSideNavProps {
  selectedMenu: SelectedMenuType;
  setSelectedMenu: React.Dispatch<React.SetStateAction<SelectedMenuType>>;
  meData: MeQuery;
}

export const DashboardSideNav = ({
  selectedMenu,
  setSelectedMenu,
  meData,
}: DashboardSideNavProps) => {
  const { selectedInfo, clinicLists, setSelectedInfo } = useStore();

  const [openClinicSelect, setOpenClinicSelect] = useState(false);
  const onlyMeMemberClinicLists = clinicLists.map((clinic) => {
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

  const ref = useRef<HTMLDivElement>(null);
  const [top, left] = getPositionRef(ref, 0);

  return selectedInfo.clinic ? (
    <nav className="dashboard-side-nav h-full space-y-2">
      <div
        className="btn-menu flex h-8 cursor-pointer items-center justify-between gap-2 rounded-none border-b px-2 py-2 text-sm font-semibold"
        onClick={() => setOpenClinicSelect((prev) => !prev)}
        ref={ref}
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {selectedInfo.clinic.name}
        </span>
        <FontAwesomeIcon icon={faChevronDown} fontSize={14} />
        {openClinicSelect && (
          <ModalTemplate
            top={top}
            left={left}
            closeAction={() => setOpenClinicSelect}
            children={
              <ul className="w-[250px] divide-y overflow-hidden rounded-md bg-white text-xs font-normal shadow-cst">
                {onlyMeMemberClinicLists.map((clinic) => (
                  <ClinicName
                    key={clinic.id}
                    clinicName={clinic.name}
                    isSelected={selectedInfo.clinic?.id === clinic.id}
                    memberState={checkMember(
                      clinic.member.staying,
                      clinic.member.accepted
                    )}
                    onClick={() => {
                      const newSelectedClinic = {
                        id: clinic.id,
                        name: clinic.name,
                        type: clinic.type,
                        members:
                          clinicLists.find(
                            (clinicInFind) => clinicInFind.id === clinic.id
                          )?.members ?? [],
                        isManager: checkManager(clinic.id, meData),
                        isStayed: checkStay(clinic.id, meData),
                      };
                      setSelectedInfo('clinic', newSelectedClinic, () =>
                        setLocalStorage({
                          key: 'SELECTED_CLINIC',
                          userId: meData.me.id,
                          value: newSelectedClinic,
                        })
                      );
                    }}
                  />
                ))}
              </ul>
            }
          />
        )}
      </div>
      <ul>
        <DashboardNavList
          type={'member'}
          selectedClinic={selectedInfo.clinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu('member')}
        />
        <DashboardNavList
          type={'invite'}
          selectedClinic={selectedInfo.clinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu('invite')}
        />
        <div className="seperate-bar mb-2 pt-2" />
        <DashboardNavList
          type={'prescription'}
          selectedClinic={selectedInfo.clinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu('prescription')}
        />
        <DashboardNavList
          type={'statistics'}
          selectedClinic={selectedInfo.clinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu('statistics')}
        />
        <div className="seperate-bar mb-2 pt-2" />
        <DashboardNavList
          type={'create'}
          selectedClinic={selectedInfo.clinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu('create')}
        />
        <DashboardNavList
          type={'clinics'}
          selectedClinic={selectedInfo.clinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu('clinics')}
        />
      </ul>
    </nav>
  ) : (
    <></>
  );
};
