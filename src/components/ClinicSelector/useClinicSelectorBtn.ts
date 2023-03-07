import { useNavigate } from 'react-router-dom';
import { pickClinicId, setConfirm, useStore } from '../../store';
import { addStatusToUserName, getMemberState } from '../../utils/commonUtils';
import type { MyMembersType } from '../../types/processedGeneratedTypes';

export const useClinicSelectorBtn = (member: FlatArray<MyMembersType, 1>) => {
  const {
    accepted,
    manager,
    staying,
    clinic: { isActive },
  } = member;

  const clinicStatus = isActive ? '' : '폐쇄';
  const state = getMemberState({ accepted, manager, staying });
  const clinicName = addStatusToUserName(member.clinic.name);

  const handleClick =
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

  const navigate = useNavigate();

  const selectClinic = (clinicId: number) => {
    pickClinicId(clinicId);
  };

  const pickedClinicId = useStore((state) => state.pickedClinicId);
  const isEnable = member.id === pickedClinicId;

  return {
    handleClick,
    isEnable,
    state,
    clinicStatus,
    clinicName,
    isActive,
  };
};
