import { renameUseSplit } from '../../../../utils/utils';
import { Selectbox } from '../../../../components';
import { useReactiveVar } from '@apollo/client';
import { clinicListsVar } from '../../../../store';
import { useSelectedClinic } from '../../../timetable/hooks';
import { ClinicsOfClient } from '../../../../models';
import type { MeQuery } from '../../../../types/generated.types';

interface DashboardSideNavProps {
  meData: MeQuery;
  isAccepted: boolean | undefined;
}

export default function DashboardClinicSelector({
  meData,
  isAccepted,
}: DashboardSideNavProps) {
  const { selectClinic } = useSelectedClinic();
  const clinicLists = useReactiveVar(clinicListsVar);

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

  const changeSelectedClinic = (id: number) => {
    selectClinic(id);
  };

  const changeName = (name: string, isAccepted?: boolean) => {
    let prefix = '';
    if (!isAccepted) {
      prefix = '수락대기 : ';
    }

    return prefix + renameUseSplit(name);
  };

  return (
    <Selectbox
      selectedValue={changeName(
        ClinicsOfClient.selectedClinic!.name,
        isAccepted
      )}
    >
      <Selectbox.Options>
        {clinicListsSelectMeMember.map((clinic) => (
          <Selectbox.Option
            key={clinic.id}
            selected={clinic.id === ClinicsOfClient.selectedClinic?.id}
            onClick={() => changeSelectedClinic(clinic.id)}
          >
            {changeName(clinic.name, clinic.member.accepted)}
          </Selectbox.Option>
        ))}
      </Selectbox.Options>
    </Selectbox>
  );
}
