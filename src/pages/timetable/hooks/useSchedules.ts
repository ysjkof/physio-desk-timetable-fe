import { useEffect, useState } from 'react';
import { Schedules } from '../../../models';
import { useGetReservationsByInterval } from './useGetReservationsByInterval';
import { useStore } from '../../../store';
import { useGetClinic } from '../../../hooks';
import type { ISchedules, MemberWithEvent } from '../../../types/commonTypes';

export const useSchedules = () => {
  const pickedDate = useStore((state) => state.pickedDate);
  const [schedules, setSchedules] = useState<ISchedules[] | null>(null);
  const [members, setMembers] = useState<MemberWithEvent[]>([]);

  const [clinic] = useGetClinic();

  const [reservations, { variables }] = useGetReservationsByInterval();

  useEffect(() => {
    if (!reservations?.results || !clinic) return;

    const schedulesClass = new Schedules({
      data: reservations.results,
      date: pickedDate,
      clinic,
    });

    setSchedules(schedulesClass.get());
    console.log(
      'schedulesClass.getMembers() >>>',
      schedulesClass.getMembers().flatMap((a) => a.user.name)
    );

    setMembers(schedulesClass.getMembers());
  }, [reservations, clinic]);

  return { schedules, members, variables };
};
