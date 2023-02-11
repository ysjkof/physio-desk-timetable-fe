import { useEffect, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Schedules } from '../../../models';
import { useListReservations } from './useListReservations';
import { selectedDateVar } from '../../../store';
import { useGetClinic } from '../../../hooks';
import type { ISchedules } from '../../../types/common.types';

export const useSchedules = () => {
  const selectedDate = useReactiveVar(selectedDateVar);
  const [schedules, setSchedules] = useState<ISchedules[] | null>(null);

  const [clinic] = useGetClinic();

  const [reservations, { variables }] = useListReservations();

  useEffect(() => {
    if (!reservations?.results || !clinic) return;

    setSchedules(
      new Schedules({
        data: reservations.results,
        date: selectedDate,
        clinic,
      }).get()
    );
  }, [reservations, clinic]);

  return { schedules, variables };
};
