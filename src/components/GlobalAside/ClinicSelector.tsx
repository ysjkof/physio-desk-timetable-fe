import { useNavigate } from 'react-router-dom';
import { addStatusToUserName, getMemberState } from '../../utils/commonUtils';
import { useFindMyMembers } from '../../hooks';
import { pickClinicId, setConfirm, useStore } from '../../store';
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
          const clinicName = addStatusToUserName(member.clinic.name, state);

          const onClick =
            state === '수락대기'
              ? () =>
                  setConfirm({
                    buttonText: '이동하기',
                    messages: [
                      '병원에 초대 받았습니다.',
                      '이동하기를 눌러서 확인하세요.',
                    ],
                    targetName: clinicName,
                    confirmAction: () => navigate('/setting/my-clinics'),
                  })
              : () => selectClinic(member.clinic.id);

          return (
            <Selectbox.Option
              key={member.id}
              selected={member.id === pickedClinicId}
              onClick={onClick}
            >
              {clinicName}
            </Selectbox.Option>
          );
        })}
      </Selectbox.Options>
    </Selectbox>
  );
};

export default ClinicSelector;
