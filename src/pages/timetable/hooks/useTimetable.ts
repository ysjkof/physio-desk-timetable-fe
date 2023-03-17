import { useEffect, useState } from 'react';
import { Schedules } from '../../../models';
import { useGetReservationsByInterval } from './useGetReservationsByInterval';
import { useStore } from '../../../store';
import type { ISchedules, MemberWithEvent } from '../../../types/commonTypes';

export const useTimetable = () => {
  const pickedDate = useStore((state) => state.pickedDate);

  const [schedules, setSchedules] = useState<ISchedules[]>();
  const [members, setMembers] = useState<MemberWithEvent[]>([]);

  const [reservations, { variables, loading }] = useGetReservationsByInterval();

  useEffect(() => {
    if (!reservations?.results) return;

    const schedulesClass = new Schedules({
      data: reservations.results,
      date: pickedDate,
      members: reservations.members || [],
    });

    setSchedules(schedulesClass.get());
    setMembers(schedulesClass.getMembers());
  }, [reservations?.results]);

  return { schedules, members, variables, loading };
};
