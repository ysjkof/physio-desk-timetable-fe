import { useEffect, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Schedules } from '../../../models';
import { useListReservations } from './useListReservations';
import { selectedDateVar } from '../../../store';
import type { ISchedules } from '../../../types/common.types';

export const useSchedules = () => {
  const selectedDate = useReactiveVar(selectedDateVar);
  const [schedules, setSchedules] = useState<ISchedules[] | null>(null);

  const [reservations, { variables }] = useListReservations();

  useEffect(() => {
    if (!reservations?.results) return;

    setSchedules(new Schedules(reservations.results, selectedDate).get());
  }, [reservations]);

  return { schedules, variables };
};
