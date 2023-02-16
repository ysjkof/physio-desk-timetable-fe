import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import {
  CREATE_RESERVATION_DOCUMENT,
  EDIT_RESERVATION_DOCUMENT,
} from '../../../graphql';
import { setAlert } from '../../../store';
import type {
  CreateReservationInput,
  CreateReservationMutation,
  EditReservationInput,
  EditReservationMutation,
} from '../../../types/generatedTypes';
import type { CloseAction } from '../../../types/propsTypes';

interface UseDayoffProps extends CloseAction {
  isCreate: boolean;
}
type DayoffInput = Pick<
  CreateReservationInput,
  'startDate' | 'endDate' | 'memo' | 'userId'
>;
interface CreateDayoffInput
  extends DayoffInput,
    Pick<CreateReservationInput, 'clinicId'> {}
interface EditDayoffInput
  extends DayoffInput,
    Pick<EditReservationInput, 'reservationId'> {}

export const useDayoff = ({ isCreate, closeAction }: UseDayoffProps) => {
  const [loading, setLoading] = useState(false);

  const [createDayoffMutation, { loading: createLoading }] =
    useMutation<CreateReservationMutation>(CREATE_RESERVATION_DOCUMENT);

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
        const { error } = data.createReservation;
        if (error) {
          return setAlert({ messages: [`오류: ${error}`] });
        }

        closeAction();
      },
    });
  };

  const [editDayoffMutation, { loading: editLoading }] =
    useMutation<EditReservationMutation>(EDIT_RESERVATION_DOCUMENT);

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
        const { error } = data.editReservation;
        if (error) {
          return setAlert({ messages: [`오류: ${error}`] });
        }

        closeAction();
      },
    });
  };

  useEffect(() => {
    setLoading(isCreate ? createLoading : editLoading);
  }, [createLoading, editLoading]);

  return { editDayoff, createDayoff, loading };
};
