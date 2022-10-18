import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { TimetableModalProps } from '../Timetable';
import { simpleCheckGQLError } from '../../../utils/utils';
import {
  CreateReservation,
  EditReservation,
} from '../../../graphql/documentNode';
import type {
  CreateReservationInput,
  CreateReservationMutation,
  EditReservationInput,
  EditReservationMutation,
} from '../../../models/generated.models';

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
    useMutation<CreateReservationMutation>(CreateReservation);

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
    useMutation<EditReservationMutation>(EditReservation);

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
