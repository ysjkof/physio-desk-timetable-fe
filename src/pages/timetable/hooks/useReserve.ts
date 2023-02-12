import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { simpleCheckGQLError } from '../../../utils/apollo.utils';
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
import type { CloseAction } from '../../../types/props.types';

interface UseDayoffProps extends CloseAction {
  isCreate: boolean;
}

export const useReserve = ({ isCreate, closeAction }: UseDayoffProps) => {
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
  }, [createLoading, editLoading, isCreate]);

  return { createReservation, editReservation, loading };
};
