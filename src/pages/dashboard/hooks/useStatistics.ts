import { useEffect, useState } from 'react';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useLazyQuery } from '@apollo/client';
import { GET_STATISTICS_DOCUMENT } from '../../../graphql';
import { useStore } from '../../../store';
import { useGetClinic } from '../../../hooks';
import { getReportsByUser } from '../../../utils/chartUtils';
import type {
  GetStatisticsQuery,
  GetStatisticsQueryVariables,
} from '../../../types/generatedTypes';
import type { CountListOfEachUser } from '../../../types/commonTypes';
import { getMemberState } from '../../../utils/commonUtils';

export const useStatistics = () => {
  const clinicId = useStore((state) => state.pickedClinicId);
  const [clinic] = useGetClinic();
  const [disabledUserIds, setDisabledUserIds] = useState<Set<number>>(
    new Set()
  );

  const membersWithoutWaiting =
    clinic?.members.filter(({ staying, accepted, manager }) =>
      getMemberState({ staying, accepted, manager }) === '수락대기'
        ? false
        : true
    ) || [];

  const toggleUserId = (id: number) => {
    const disabledIds = new Set(disabledUserIds);

    if (!disabledIds.has(id)) disabledIds.add(id);
    else disabledIds.delete(id);
    setDisabledUserIds(disabledIds);
  };

  const [countList, setCountList] = useState<CountListOfEachUser>();

  const toggleAllUser = () => {
    if (disabledUserIds.size === 0) {
      setDisabledUserIds(
        new Set(membersWithoutWaiting.map((member) => member.user.id))
      );
      return;
    }
    setDisabledUserIds(new Set());
  };

  const [date, setDate] = useState(new Date());
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);

  const [callQuery, { data }] = useLazyQuery<
    GetStatisticsQuery,
    GetStatisticsQueryVariables
  >(GET_STATISTICS_DOCUMENT);

  useEffect(() => {
    if (clinic?.members) {
      const userIds = clinic.members
        .filter((member) => member.accepted)
        .map((member) => member.user.id);

      callQuery({
        variables: {
          input: {
            startDate,
            endDate,
            clinicId,
            userIds,
          },
        },
      });
    }
  }, [clinic?.members, date]);

  useEffect(() => {
    if (!data) return;
    if (!clinic?.members) throw '병원의 정보가 없습니다';
    const { dailyReports, prescriptions, visitRates } = data.getStatistics;

    setCountList(getReportsByUser(dailyReports));
  }, [data]);

  return {
    countList,
    data,
    disabledUserIds,
    toggleUserId,
    toggleAllUser,
    date,
    setDate,
    members: membersWithoutWaiting,
  };
};
