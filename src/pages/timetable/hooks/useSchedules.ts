import { useEffect, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Schedules } from '../../../models';
import { useListReservations } from './useListReservations';
import { clinicListsVar, selectedDateVar } from '../../../store';
import type { ISchedules } from '../../../types/common.types';

export const useSchedules = () => {
  const clinicList = useReactiveVar(clinicListsVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const [schedules, setSchedules] = useState<ISchedules[] | null>(null);

  const listReservations = useListReservations();

  useEffect(() => {
    if (!listReservations.data?.listReservations.results) return;

    setSchedules(
      new Schedules(
        listReservations.data.listReservations.results,
        selectedDate
      ).get()
    );
  }, [listReservations.data, clinicList]);

  return { schedules, variables: listReservations.variables };
};
