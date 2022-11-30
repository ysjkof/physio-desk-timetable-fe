import { useReactiveVar } from '@apollo/client';
import { renameUseSplit } from '../../../../utils/common.utils';
import { Selectbox } from '../../../../components';
import { useMe } from '../../../../hooks';
import { clinicListsVar } from '../../../../store';
import { ClinicsOfClient } from '../../../../models';
import { useSelectedClinic } from '../../hooks';
import { ClinicType } from '../../../../types/generated.types';

export default function TableClinicSelector() {
  const { selectClinic } = useSelectedClinic();
  const { data: meData } = useMe();
  if (!meData) return <></>;

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

  const changeSelectedClinic = (id: number, name: string, type: ClinicType) => {
    selectClinic(id);
  };

  const changeName = (name: string, isAccepted?: boolean) => {
    let prefix = '';
    if (!isAccepted) {
      prefix = '수락대기 : ';
    }

    return prefix + renameUseSplit(name);
  };

  const isAccepted = meData?.me.members?.find(
    (member) => member.clinic.id === ClinicsOfClient.selectedClinic?.id
  )?.accepted;

  return (
    <Selectbox
      selectedValue={changeName(
        ClinicsOfClient.selectedClinic!.name,
        isAccepted
      )}
      hasBorder
      backgroundColor="#262850"
    >
      <Selectbox.Options>
        {clinicListsSelectMeMember.map((clinic) => (
          <Selectbox.Option
            key={clinic.id}
            selected={clinic.id === ClinicsOfClient.selectedClinic?.id}
            onClick={() =>
              changeSelectedClinic(clinic.id, clinic.name, clinic.type)
            }
          >
            {changeName(clinic.name, clinic.member.accepted)}
          </Selectbox.Option>
        ))}
      </Selectbox.Options>
    </Selectbox>
  );
}
