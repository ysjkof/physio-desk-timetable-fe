import { useReactiveVar } from '@apollo/client';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { checkManager, checkStay, SelectedMenuType } from '..';
import { ModalTemplate } from '../../../components/molecules/modal-template';
import { MeQuery } from '../../../graphql/generated/graphql';
import {
  checkMember,
  getPositionRef,
  saveSelectedClinic,
} from '../../../utils/utils';
import { clinicListsVar, selectedClinicVar } from '../../../store';
import { DashboardNavList } from '../components/dashboadr-nav-list';
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
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const clinicLists = useReactiveVar(clinicListsVar);
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

  return selectedClinic ? (
    <nav className="dashboard-side-nav h-full space-y-2">
      <div
        className="btn-menu flex h-8 cursor-pointer items-center justify-between gap-2 rounded-none border-b px-2 py-2 text-sm font-semibold"
        onClick={() => setOpenClinicSelect((prev) => !prev)}
        ref={ref}
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {selectedClinic.name}
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
                    isSelected={selectedClinic.id === clinic.id}
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
                      saveSelectedClinic(newSelectedClinic, meData.me.id);
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
          selectedClinic={selectedClinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu('member')}
        />
        <DashboardNavList
          type={'invite'}
          selectedClinic={selectedClinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu('invite')}
        />
        <div className="seperate-bar mb-2 pt-2" />
        <DashboardNavList
          type={'prescription'}
          selectedClinic={selectedClinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu('prescription')}
        />
        <DashboardNavList
          type={'statistics'}
          selectedClinic={selectedClinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu('statistics')}
        />
        <div className="seperate-bar mb-2 pt-2" />
        <DashboardNavList
          type={'create'}
          selectedClinic={selectedClinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu('create')}
        />
        <DashboardNavList
          type={'clinics'}
          selectedClinic={selectedClinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu('clinics')}
        />
      </ul>
    </nav>
  ) : (
    <></>
  );
};
