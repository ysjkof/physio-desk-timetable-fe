import { memo } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import {
  compareDateMatch,
  createDate,
  getFrom4DigitTime,
} from '../../../../utils/date.utils';
import { selectedReservationVar, setToast } from '../../../../store';
import ReserveButton from './ReserveButton';
import { CREATE_RESERVATION_DOCUMENT } from '../../../../graphql';
import type { CreateReservationMutation } from '../../../../types/generated.types';
import type { PrescriptionsInReservation } from '../../../../types/common.types';
import { LABEL_VISIBLE_MINUTES } from '../../../../constants/constants';

interface ReservationButtonsProps {
  userIndex: number;
  date: Date;
  userId: number;
  labels: string[];
  labelMaxLength: number;
}
const ReservationButtons = ({
  userIndex,
  date,
  userId,
  labels,
  labelMaxLength,
}: ReservationButtonsProps) => {
  const selectedReservation = useReactiveVar(selectedReservationVar);

  const getPrescriptionInfo = (prescriptions: PrescriptionsInReservation) => {
    type ReturnType = {
      prescriptionIds: number[];
      requiredTime: number;
    };
    const reduceReturnType: ReturnType = {
      prescriptionIds: [],
      requiredTime: 0,
    };

    const { prescriptionIds, requiredTime } = prescriptions.reduce(
      (acc, prescription) => {
        return {
          prescriptionIds: [...acc.prescriptionIds, prescription.id],
          requiredTime: acc.requiredTime + prescription.requiredTime,
        };
      },
      reduceReturnType
    );
    return { prescriptionIds, requiredTime };
  };

  const [createReservationMutation, { loading }] =
    useMutation<CreateReservationMutation>(CREATE_RESERVATION_DOCUMENT);

  const invokeQuickCreateReservation = (label: string) => {
    if (loading) return;
    if (!selectedReservation?.prescriptions)
      throw new Error('복사할 예약이 선택되지 않았습니다');

    const { prescriptionIds, requiredTime } = getPrescriptionInfo(
      selectedReservation.prescriptions
    );

    const startDate = createDate(date, {
      hour: +getFrom4DigitTime(label, 'hour'),
      minute: +getFrom4DigitTime(label, 'minute'),
    });
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + requiredTime);
    console.log('selectedReservation >>>', selectedReservation);

    createReservationMutation({
      variables: {
        input: {
          clinicId: selectedReservation.clinic.id,
          patientId: selectedReservation.patient?.id,
          memo: selectedReservation.memo,
          userId,
          startDate,
          endDate,
          prescriptionIds,
        },
      },
      onCompleted(data) {
        const { error } = data.createReservation;
        if (error) setToast({ messages: [error], fade: true });
      },
    });
    // 할일: 연속예약을 하기 위해서 키보드 조작으로 아래 동작 안하기
    clearSelectedReservation();
  };

  const clearSelectedReservation = () => {
    selectedReservationVar(undefined);
  };

  const dayIndex = date.getDay();

  const hasBorder = (label: string) =>
    !!LABEL_VISIBLE_MINUTES.find((match) => label.endsWith(match));

  return (
    <>
      {labels.map((label, idx) =>
        idx === labelMaxLength - 1 ? null : (
          <ReserveButton
            key={label}
            label={label}
            dayIndex={dayIndex}
            userId={userId}
            isActiveBorderTop={hasBorder(label)}
            userIndex={userIndex}
            selectedReservation={selectedReservation}
            quickCreateReservation={() => invokeQuickCreateReservation(label)}
          />
        )
      )}
    </>
  );
};

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
