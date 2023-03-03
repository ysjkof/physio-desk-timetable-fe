import { useEffect, useState } from 'react';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_STATISTICS_DOCUMENT } from '../../../graphql';
import { useStore } from '../../../store';
import { useGetClinic } from '../../../hooks';
import { getReportsByUser } from '../../../utils/chartUtils';
import type {
  GetStatisticsQuery,
  GetStatisticsQueryVariables,
} from '../../../types/generatedTypes';
import type { CountListOfEachUser } from '../../../types/commonTypes';

export const useStatistics = () => {
  const clinicId = useStore((state) => state.pickedClinicId);
  const [clinic] = useGetClinic();
  const [disabledUserIds, setDisabledUserIds] = useState<Set<number>>(
    new Set()
  );

  const toggleUserId = (id: number) => {
    const result = new Set(disabledUserIds);
    if (result.has(id)) result.delete(id);
    else result.add(id);
    setDisabledUserIds(result);
  };

  const [countList, setCountList] = useState<CountListOfEachUser>();

  const toggleAllUser = () => {
    const arrayedCountList = Object.keys(countList || {});
    if (disabledUserIds.size === 0) {
      setDisabledUserIds(new Set(arrayedCountList.map(Number)));
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
  };
};
