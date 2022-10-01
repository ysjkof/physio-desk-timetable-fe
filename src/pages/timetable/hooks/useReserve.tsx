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

export default function useReserve({ isCreate, closeAction }: UseDayoffProps) {
  const [loading, setLoading] = useState(false);

  const [createReservationMutation, { loading: createLoading }] =
    useCreateReservationMutation();

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
        toastOrNavigation(ok, error, closeAction);
      },
    });
  };

  const [editReservationMutation, { loading: editLoading }] =
    useEditReservationMutation();

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
        toastOrNavigation(ok, error, closeAction);
      },
    });
  };

  useEffect(() => {
    setLoading(isCreate ? createLoading : editLoading);
  }, [createLoading, editLoading]);

  return { createReservation, editReservation, loading };
}
