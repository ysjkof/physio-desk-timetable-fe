import { useReactiveVar } from '@apollo/client';
import { memo } from 'react';
import { UTC_OPTION } from '../../../constants/constants';
import { useCreateReservationMutation } from '../../../graphql/generated/graphql';
import {
  compareDateMatch,
  getFrom4DigitTime,
  newDateSetHourAndMinute,
} from '../../../services/dateServices';
import { checkMatchMinute } from '../services/timetableServices';
import { selectedInfoVar } from '../../../store';
import { IListReservation } from '../../../types/type';
import ReserveButton from './ReserveButton';

interface ReservationButtonsProps {
  userIndex: number;
  date: Date;
  userId: number;
  labels: string[];
  labelMaxLength: number;
}
function ReservationButtons({
  userIndex,
  date,
  userId,
  labels,
  labelMaxLength,
}: ReservationButtonsProps) {
  const selectedInfo = useReactiveVar(selectedInfoVar);

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
  const [createReservationMutation, { loading }] =
    useCreateReservationMutation();

  const clearSelectedReservation = () => {
    selectedInfoVar({ ...selectedInfo, reservation: null });
  };

  const invokeQuickCreateReservation = (label: string) => {
    if (loading) return;
    if (!selectedInfo.reservation)
      throw new Error('복사할 예약이 선택되지 않았습니다');

    const { prescriptionIds, requiredTime } = getPrescriptionInfo(
      selectedInfo.reservation
    );

    const startDate = newDateSetHourAndMinute({
      hour: +getFrom4DigitTime(label, 'hour') + UTC_OPTION.kor.hour,
      minute: +getFrom4DigitTime(label, 'minute') + UTC_OPTION.kor.minute,
      fromDate: date,
    });
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + requiredTime);

    createReservationMutation({
      variables: {
        input: {
          clinicId: selectedInfo.reservation.clinic.id,
          patientId: selectedInfo.reservation.patient!.id,
          memo: selectedInfo.reservation.memo,
          userId,
          startDate,
          endDate,
          prescriptionIds,
        },
      },
    });
    // 할일: 연속예약을 하기 위해서 키보드 조작으로 아래 동작 안하기
    clearSelectedReservation();
  };
  const dayIndex = date.getDay();

  return (
    <>
      {labels.map((label, idx) =>
        idx === labelMaxLength - 1 ? null : (
          <ReserveButton
            key={label}
            label={label}
            dayIndex={dayIndex}
            userId={userId}
            isActiveBorderTop={checkMatchMinute(label, [0, 30])}
            userIndex={userIndex}
            selectedReservation={selectedInfo.reservation}
            quickCreateReservation={() => invokeQuickCreateReservation(label)}
          />
        )
      )}
    </>
  );
}

export default memo(ReservationButtons, (prevProps, nextProps) => {
  const isSameLabels = () =>
    prevProps.labels[0] === nextProps.labels[0] &&
    prevProps.labels[1] === nextProps.labels[1] &&
    prevProps.labels[prevProps.labels.length - 1] ===
      nextProps.labels[nextProps.labels.length - 1];
  return (
    isSameLabels() &&
    prevProps.userIndex === nextProps.userIndex &&
    prevProps.userId === nextProps.userId &&
    prevProps.labelMaxLength === nextProps.labelMaxLength &&
    compareDateMatch(prevProps.date, nextProps.date, 'ymd')
  );
});
