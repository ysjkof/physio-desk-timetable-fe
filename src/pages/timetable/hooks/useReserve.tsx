import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { simpleCheckGQLError } from '../../../utils/utils';
import { TimetableModalProps } from '../Timetable';
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

export default function useReserve({ isCreate, closeAction }: UseDayoffProps) {
  const [loading, setLoading] = useState(false);

  const [createReservationMutation, { loading: createLoading }] =
    useMutation<CreateReservationMutation>(CREATE_RESERVATION_DOCUMENT);

  const createReservation = ({
    startDate,
    endDate,
    memo,
    userId,
    clinicId,
    patientId,
    prescriptionIds,
  }: CreateReservationInput) => {
    createReservationMutation({
      variables: {
        input: {
          startDate,
          endDate,
          memo,
          userId,
          clinicId,
          patientId,
          prescriptionIds,
        },
      },
      onCompleted(data) {
        const { ok, error } = data.createReservation;
        simpleCheckGQLError(ok, error, closeAction);
      },
    });
  };

  const [editReservationMutation, { loading: editLoading }] =
    useMutation<EditReservationMutation>(EDIT_RESERVATION_DOCUMENT);

  const editReservation = ({
    startDate,
    endDate,
    memo,
    userId,
    reservationId,
    prescriptionIds,
  }: EditReservationInput) => {
    editReservationMutation({
      variables: {
        input: {
          startDate,
          endDate,
          memo,
          userId,
          reservationId,
          prescriptionIds,
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

  return { createReservation, editReservation, loading };
}
