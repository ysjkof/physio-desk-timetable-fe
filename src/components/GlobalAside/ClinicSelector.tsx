import { useNavigate } from 'react-router-dom';
import {
  addStatusToUserName,
  cls,
  getMemberState,
} from '../../utils/commonUtils';
import { useFindMyMembers } from '../../hooks';
import { pickClinicId, setConfirm, useStore } from '../../store';

const ClinicSelector = () => {
  const [myMembers] = useFindMyMembers();

  const pickedClinicId = useStore((state) => state.pickedClinicId);

  const navigate = useNavigate();

  const selectClinic = (clinicId: number) => {
    pickClinicId(clinicId);
  };

  return (
    <div className="flex flex-col">
      {myMembers?.map((member) => {
        const {
          accepted,
          manager,
          staying,
          clinic: { isActivated },
        } = member;
        const clinicStatus = isActivated ? '' : '폐쇄: ';
        const state = getMemberState({ accepted, manager, staying });
        const clinicName = `${clinicStatus}${addStatusToUserName(
          member.clinic.name,
          state
        )}`;

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

        const isEnable = member.id === pickedClinicId;

        return (
          <button
            key={member.id}
            onClick={onClick}
            type="button"
            className={cls(
              'flex w-full items-center justify-between overflow-hidden text-ellipsis whitespace-nowrap bg-inherit px-2 py-1 hover:bg-blue-200',
              isEnable ? 'font-semibold text-white' : '',
              state === '수락대기' ? 'order-1' : '',
              clinicName.startsWith('전용: ') ? 'order-4' : '',
              isActivated ? 'order-3' : 'order-6',
              state === '탈퇴' ? 'order-5' : ''
            )}
          >
            <span>{clinicName}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ClinicSelector;
