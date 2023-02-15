import { memo } from 'react';
import { useMutation } from '@apollo/client';
import {
  compareDateMatch,
  createDate,
  getFrom4DigitTime,
} from '../../../../utils/dateUtils';
import { setPickedReservation, setToast, useStore } from '../../../../store';
import ReserveButton from './ReserveButton';
import { CREATE_RESERVATION_DOCUMENT } from '../../../../graphql';
import { LABEL_VISIBLE_MINUTES } from '../../../../constants/constants';
import type { CreateReservationMutation } from '../../../../types/generatedTypes';
import type { PrescriptionsInReservation } from '../../../../types/processedGeneratedTypes';

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
  const pickedReservation = useStore((state) => state.pickedReservation);

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
    if (!pickedReservation?.prescriptions)
      throw new Error('복사할 예약이 선택되지 않았습니다');

    const { prescriptionIds, requiredTime } = getPrescriptionInfo(
      pickedReservation.prescriptions
    );

    const startDate = createDate(date, {
      hour: +getFrom4DigitTime(label, 'hour'),
      minute: +getFrom4DigitTime(label, 'minute'),
    });
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + requiredTime);
    console.log('pickedReservation >>>', pickedReservation);

    createReservationMutation({
      variables: {
        input: {
          clinicId: pickedReservation.clinic.id,
          patientId: pickedReservation.patient?.id,
          memo: pickedReservation.memo,
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
    setPickedReservation(undefined);
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
            pickedReservation={pickedReservation}
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
