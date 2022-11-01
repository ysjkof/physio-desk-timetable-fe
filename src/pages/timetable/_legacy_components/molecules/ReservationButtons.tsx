import { memo } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import {
  compareDateMatch,
  createDate,
  getFrom4DigitTime,
} from '../../../../services/dateServices';
import { checkMatchMinute } from '../../../timetableServices';
import { selectedInfoVar, toastVar } from '../../../../store';
import ReserveButton from './ReserveButton';
import { CREATE_RESERVATION_DOCUMENT } from '../../../../graphql';
import type { CreateReservationMutation } from '../../../../types/generated.types';
import type { IListReservation } from '../../../../types/common.types';

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
    useMutation<CreateReservationMutation>(CREATE_RESERVATION_DOCUMENT);

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

    const startDate = createDate(date, {
      hour: +getFrom4DigitTime(label, 'hour'),
      minute: +getFrom4DigitTime(label, 'minute'),
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
      onCompleted(data) {
        const { error } = data.createReservation;
        if (error) toastVar({ messages: [error], fade: true });
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
