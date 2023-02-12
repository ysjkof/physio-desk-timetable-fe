import { useNavigate } from 'react-router-dom';
import {
  addPrefixToNameWhenWaiting,
  getMemberState,
} from '../../utils/common.utils';
import { useFindMyMembers, useMe } from '../../hooks';
import { selectClinicId, useStore } from '../../store';
import Selectbox from '../Selectbox';

const ClinicSelector = () => {
  const [, { getIdName }] = useMe();

  const [myMembers] = useFindMyMembers();

  const selectedClinicId = useStore((state) => state.selectedClinicId);

  const member = myMembers?.find(
    (member) => member.clinic.id === selectedClinicId
  );

  const clinicName = addPrefixToNameWhenWaiting(
    member?.clinic?.name || '',
    member?.accepted
  );

  const navigate = useNavigate();

  const selectClinic = (clinicId: number) => {
    selectClinicId({
      ...getIdName(),
      clinicId,
    });
  };

  return (
    <Selectbox selectedValue={clinicName} hasBorder backgroundColor="#262850">
      <Selectbox.Options>
        {myMembers?.map((member) => {
          const { accepted, manager, staying } = member;
          const state = getMemberState({ accepted, manager, staying });
          if (state === '탈퇴') return null;

          const onClick =
            state === '수락대기'
              ? () => navigate('/setting/my-clinics')
              : () => selectClinic(member.clinic.id);

          return (
            <Selectbox.Option
              key={member.id}
              selected={member.id === selectedClinicId}
              onClick={onClick}
            >
              {addPrefixToNameWhenWaiting(member.clinic.name, member.accepted)}
            </Selectbox.Option>
          );
        })}
      </Selectbox.Options>
    </Selectbox>
  );
};

export default ClinicSelector;
