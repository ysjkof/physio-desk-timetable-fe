import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import {
  CreateReservation,
  EditReservation,
} from '../../../graphql/documentNode';
import { simpleCheckGQLError } from '../../../utils/utils';
import { TimetableModalProps } from '../Timetable';
import type {
  CreateReservationInput,
  CreateReservationMutation,
  EditReservationInput,
  EditReservationMutation,
} from '../../../models/generated.models';

interface UseDayoffProps extends TimetableModalProps {
  isCreate: boolean;
}

export default function useReserve({ isCreate, closeAction }: UseDayoffProps) {
  const [loading, setLoading] = useState(false);

  const [createReservationMutation, { loading: createLoading }] =
    useMutation<CreateReservationMutation>(CreateReservation);

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
    useMutation<EditReservationMutation>(EditReservation);

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
