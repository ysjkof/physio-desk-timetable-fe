import { renameUseSplit } from '../../../../utils/utils';
import useStore from '../../../../hooks/useStore';
import localStorageUtils from '../../../../utils/localStorageUtils';
import Selectbox from '../../../../components/Selectbox';
import { checkStay } from '../../../dashboard/Dashboard';
import { useMe } from '../../../../hooks/useMe';
import { ClinicType } from '../../../../types/generated.types';

export default function TableClinicSelector() {
  const { data: meData } = useMe();
  if (!meData) return <></>;

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

  const isAccepted = meData?.me.members?.find(
    (member) => member.clinic.id === selectedInfo.clinic?.id
  )?.accepted;

  return (
    <Selectbox
      selectedValue={changeName(selectedInfo.clinic!.name, isAccepted)}
      hasBorder
      backgroundColor="#262850"
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
  );
}
