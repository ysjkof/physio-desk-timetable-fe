import { useNavigate } from 'react-router-dom';
import { addStatusToUserName, getMemberState } from '../../utils/common.utils';
import { useFindMyMembers } from '../../hooks';
import { pickClinicId, useStore } from '../../store';
import Selectbox from '../Selectbox';

const ClinicSelector = () => {
  const [myMembers] = useFindMyMembers();

  const pickedClinicId = useStore((state) => state.pickedClinicId);

  const member = myMembers?.find(
    (member) => member.clinic.id === pickedClinicId
  );
  const name = member?.clinic?.name || '';
  const state =
    member &&
    getMemberState({
      accepted: member.accepted,
      manager: member.manager,
      staying: member.staying,
    });

  const clinicName = addStatusToUserName(name, state);

  const navigate = useNavigate();

  const selectClinic = (clinicId: number) => {
    pickClinicId(clinicId);
  };

  return (
    <Selectbox selectedValue={clinicName} hasBorder backgroundColor="#262850">
      <Selectbox.Options>
        {myMembers?.map((member) => {
          const { accepted, manager, staying } = member;
          const state = getMemberState({ accepted, manager, staying });

          const onClick =
            state === '수락대기'
              ? () => navigate('/setting/my-clinics')
              : () => selectClinic(member.clinic.id);

          return (
            <Selectbox.Option
              key={member.id}
              selected={member.id === pickedClinicId}
              onClick={onClick}
            >
              {addStatusToUserName(member.clinic.name, state)}
            </Selectbox.Option>
          );
        })}
      </Selectbox.Options>
    </Selectbox>
  );
};

export default ClinicSelector;
