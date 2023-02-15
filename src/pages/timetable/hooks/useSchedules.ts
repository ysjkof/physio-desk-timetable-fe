import { useEffect, useState } from 'react';
import { Schedules } from '../../../models';
import { useListReservations } from './useListReservations';
import { useStore } from '../../../store';
import { useGetClinic } from '../../../hooks';
import type { ISchedules } from '../../../types/commonTypes';

export const useSchedules = () => {
  const pickedDate = useStore((state) => state.pickedDate);
  const [schedules, setSchedules] = useState<ISchedules[] | null>(null);

  const [clinic] = useGetClinic();

  const [reservations, { variables }] = useListReservations();

  useEffect(() => {
    if (!reservations?.results || !clinic) return;

    setSchedules(
      new Schedules({
        data: reservations.results,
        date: pickedDate,
        clinic,
      }).get()
    );
  }, [reservations, clinic]);

  return { schedules, variables };
};
