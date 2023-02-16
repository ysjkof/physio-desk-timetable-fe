import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { setAlert } from '../../../store';
import {
  CREATE_RESERVATION_DOCUMENT,
  EDIT_RESERVATION_DOCUMENT,
} from '../../../graphql';
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
        const { error } = data.createReservation;
        if (error) {
          return setAlert({ messages: [`오류: ${error}`] });
        }

        closeAction();
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
  }, [createLoading, editLoading, isCreate]);

  return { createReservation, editReservation, loading };
};
