import { useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateReservationMutation } from '../../../graphql/generated/graphql';
import { getHHMM, getTimeLength } from '../../../services/dateServices';
import { selectedInfoVar } from '../../../store';
import { TABLE_CELL_HEIGHT, USER_COLORS } from '../../../constants/constants';
import { ROUTER } from '../../../router/routerConstants';
import { IListReservation } from '../../../types/type';

interface ReserveBtnProps {
  label: string;
  userId: number;
  userIndex: number;
  isActiveBorderTop?: boolean;
}

function getPrescriptionInfo(reservation: IListReservation) {
  type ReturnType = {
    prescriptionIds: number[];
    requiredTime: number;
  };
  const reduceReturnType: ReturnType = {
    prescriptionIds: [],
    requiredTime: 0,
  };
  const { prescriptionIds, requiredTime } = reservation.prescriptions!.reduce(
    (acc, prescription) => {
      return {
        prescriptionIds: [...acc.prescriptionIds, prescription.id],
        requiredTime: acc.requiredTime + prescription.requiredTime,
      };
    },
    reduceReturnType
  );
  return { prescriptionIds, requiredTime };
}

function ReserveButton({
  label,
  userId,
  userIndex,
  isActiveBorderTop = false,
}: ReserveBtnProps) {
  const selectedInfo = useReactiveVar(selectedInfoVar);
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);

  const [createReservationMutation, { loading }] =
    useCreateReservationMutation();

  const clearSelectedReservation = () => {
    selectedInfoVar({ ...selectedInfo, reservation: null });
  };

  const invokeQuickCreateReservation = () => {
    if (loading) return;
    if (!selectedInfo.reservation)
      throw new Error('복사할 예약이 선택되지 않았습니다');

    const { prescriptionIds, requiredTime } = getPrescriptionInfo(
      selectedInfo.reservation
    );

    const endDate = new Date(label);
    endDate.setMinutes(endDate.getMinutes() + requiredTime);

    createReservationMutation({
      variables: {
        input: {
          clinicId: selectedInfo.reservation.clinic!.id,
          patientId: selectedInfo.reservation.patient!.id,
          memo: selectedInfo.reservation.memo,
          userId,
          startDate: label,
          endDate,
          prescriptionIds,
        },
      },
    });
    // 할일: 연속예약을 하기 위해서 키보드 조작으로 아래 동작 안하기
    clearSelectedReservation();
  };

  const openReserveModal = () => {
    navigate(ROUTER.RESERVE, {
      state: { startDate: label, userId },
    });
  };

  const handleClickButton = () => {
    if (selectedInfo.reservation) {
      invokeQuickCreateReservation();
    } else {
      openReserveModal();
    }
  };

  return (
    <div
      className={`reserve-btn-box group ${
        isActiveBorderTop ? ' border-t border-gray-200 first:border-t-0' : ''
      }`}
      onMouseOver={(e) => {
        if (selectedInfo.reservation) setIsHover(true);
      }}
      onMouseLeave={(e) => {
        if (selectedInfo.reservation) setIsHover(false);
      }}
      onClick={handleClickButton}
    >
      <span className="reserve-btn">+ {getHHMM(label, ':')}</span>
      {selectedInfo.reservation && isHover && (
        <div
          className="absolute top-0 w-full border-2"
          style={{
            borderColor: USER_COLORS[userIndex]?.deep ?? 'black',
            height:
              getTimeLength(
                selectedInfo.reservation.startDate,
                selectedInfo.reservation.endDate,
                '20minute'
              ) *
                TABLE_CELL_HEIGHT +
              'px',
          }}
        />
      )}
    </div>
  );
}

export default ReserveButton;
