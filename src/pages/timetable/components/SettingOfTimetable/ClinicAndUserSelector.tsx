import StateBadge from '../../../../_legacy_components/atoms/StateBadge';
import Sidebar from '../../../../_legacy_components/molecules/Sidebar';
import { useFindMyClinics } from '../../../../hooks';
import { pickClinicId, useStore } from '../../../../store';
import { Check } from '../../../../svgs';
import {
  cls,
  getMemberState,
  isStayMember,
  renameUseSplit,
} from '../../../../utils/common.utils';
import type { MemberOfClient } from '../../../../types/common.types';

export const ClinicAndUserSelector = () => {
  const user = useStore((state) => state.user);
  const clinicId = useStore((state) => state.pickedClinicId);

  const [myClinics] = useFindMyClinics({});

  const onClickToggleUser = (memberId: number) => {
    // TODO:
    // toggleUser(memberId);
  };

  const onClickChangeSelectClinic = (clinicId: number) => {
    pickClinicId(clinicId);
  };

  return (
    <Sidebar noGap className="divide-y">
      {myClinics?.map((clinic) => {
        const meMember = clinic.members.find(
          (member) => member.user.id === user.id
        );
        if (!meMember) return null;

        const isSelectedClinic = clinic.id === clinicId;

        const { staying, accepted, manager } = meMember;
        const memberState = getMemberState({ staying, accepted, manager });
        const isStay = isStayMember(memberState);

        const sortMember = (members: MemberOfClient[]) => {
          const updated = [...members];
          return updated.sort((a, b) => {
            if (a.user.name > b.user.name) return 1;
            if (a.user.name < b.user.name) return -1;
            return 0;
          });
        };

        return (
          <Sidebar.Ul
            key={clinic.id}
            removePadding
            opacity={!isSelectedClinic}
            title={
              <Sidebar.Button
                className={cls(
                  'text-left',
                  isSelectedClinic ? '' : 'font-normal'
                )}
                onClick={() => onClickChangeSelectClinic(clinic.id)}
              >
                <Check className="mr-2" />
                {renameUseSplit(clinic.name)}
              </Sidebar.Button>
            }
          >
            {isStay ? (
              sortMember(clinic.members).map((member) => {
                if (!member.staying) return null;
                return (
                  <Sidebar.Li
                    key={member.id}
                    onClick={() => onClickToggleUser(member.id)}
                    selected={isSelectedClinic && member.canSee}
                  >
                    {member.user.name}
                  </Sidebar.Li>
                );
              })
            ) : (
              <StateBadge state={memberState} />
            )}
          </Sidebar.Ul>
        );
      })}
    </Sidebar>
  );
};
