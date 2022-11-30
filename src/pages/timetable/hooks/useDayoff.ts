import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { TimetableModalProps } from '../Timetable';
import { simpleCheckGQLError } from '../../../utils/common.utils';
import {
  CREATE_RESERVATION_DOCUMENT,
  EDIT_RESERVATION_DOCUMENT,
} from '../../../graphql';
import type {
  CreateReservationInput,
  CreateReservationMutation,
  EditReservationInput,
  EditReservationMutation,
} from '../../../types/generated.types';

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

export function useDayoff({ isCreate, closeAction }: UseDayoffProps) {
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
        const { ok, error } = data.createReservation;
        simpleCheckGQLError(ok, error, closeAction);
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
        const { ok, error } = data.editReservation;
        simpleCheckGQLError(ok, error, closeAction);
      },
    });
  };

  useEffect(() => {
    setLoading(isCreate ? createLoading : editLoading);
  }, [createLoading, editLoading]);

  return { editDayoff, createDayoff, loading };
}
