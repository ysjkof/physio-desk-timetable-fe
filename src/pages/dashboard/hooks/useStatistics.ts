import { useEffect, useState } from 'react';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useQuery } from '@apollo/client';
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

  const [countList, setCountList] = useState<CountListOfEachUser>();

  const date = new Date('2023-03-01');
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);

  const { data } = useQuery<GetStatisticsQuery, GetStatisticsQueryVariables>(
    GET_STATISTICS_DOCUMENT,
    {
      variables: {
        input: {
          startDate,
          endDate,
          clinicId,
          userIds: clinic?.members
            .filter((member) => member.accepted)
            .map((member) => member.user.id),
        },
      },
    }
  );

  useEffect(() => {
    if (!data) return;
    const { dailyReports, prescriptions, visitRates } = data.getStatistics;

    setCountList(getReportsByUser(dailyReports));
  }, [data]);

  return { countList, data };
};
