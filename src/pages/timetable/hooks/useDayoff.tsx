import { useEffect, useState } from 'react';
import {
  CreateReservationInput,
  EditReservationInput,
  useCreateReservationMutation,
  useEditReservationMutation,
} from '../../../graphql/generated/graphql';
import { toastOrNavigation } from '../../../utils/utils';
import { TimetableModalProps } from '../Timetable';

interface UseDayoffProps extends TimetableModalProps {
  isCreate: boolean;
}
interface DayoffInput
  extends Pick<
    CreateReservationInput,
    'startDate' | 'endDate' | 'memo' | 'userId'
  > {}
interface CreateDayoffInput
  extends DayoffInput,
    Pick<CreateReservationInput, 'clinicId'> {}
interface EditDayoffInput
  extends DayoffInput,
    Pick<EditReservationInput, 'reservationId'> {}

export default function useDayoff({ isCreate, closeAction }: UseDayoffProps) {
  const [loading, setLoading] = useState(false);

  const [createDayoffMutation, { loading: createLoading }] =
    useCreateReservationMutation();

  const createDayoff = ({
    startDate,
    endDate,
    memo,
    userId,
    clinicId,
  }: CreateDayoffInput) => {
    createDayoffMutation({
      variables: {
        input: {
          startDate,
          endDate,
          memo,
          isDayoff: true,
          userId,
          clinicId,
        },
      },
      onCompleted(data) {
        const { ok, error } = data.createReservation;
        toastOrNavigation(ok, error, closeAction);
      },
    });
  };

  const [editDayoffMutation, { loading: editLoading }] =
    useEditReservationMutation();

  const editDayoff = ({
    startDate,
    endDate,
    memo,
    userId,
    reservationId,
  }: EditDayoffInput) => {
    editDayoffMutation({
      variables: {
        input: {
          startDate,
          endDate,
          memo,
          userId,
          reservationId,
        },
      },
      onCompleted(data) {
        const { ok, error } = data.editReservation;
        toastOrNavigation(ok, error, closeAction);
      },
    });
  };

  useEffect(() => {
    setLoading(isCreate ? createLoading : editLoading);
  }, [createLoading, editLoading]);

  return { editDayoff, createDayoff, loading };
}
