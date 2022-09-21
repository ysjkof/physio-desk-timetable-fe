import { lazy, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardSectionLayout from '../template/DashboardSectionLayout';
import { useGetStatisticsLazyQuery } from '../../../../graphql/generated/graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { getMonthStartEnd } from '../../../../services/dateServices';
import combineUserStatistics from '../../statisticsServices';
import { IUserStatistics, MemberState } from '../../../../types/type';
import useStore from '../../../../hooks/useStore';
import Charts from '../molecules/Charts';
import Worning from '../../../../components/atoms/Warning';
import Button from '../../../../components/molecules/Button';
import Checkbox from '../../../../components/molecules/Checkbox';
import MenuButton from '../../../../components/molecules/MenuButton';
const Loading = lazy(() => import('../../../../components/atoms/Loading'));

export default function Statistics() {
  const { selectedInfo, selectedDate } = useStore();
  const [userStatistics, setUserStatistics] = useState<
    IUserStatistics[] | null
  >(null);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid },
  } = useForm<{
    userIds: number[];
    year: number;
    month: string;
  }>({
    mode: 'onChange',
    defaultValues: {
      year: selectedDate.getFullYear(),
      month: selectedDate.getMonth() + 1 + '',
    },
  });

  const acceptedMember: MemberState[] | undefined = selectedInfo.clinic?.members
    .filter((member) => member.accepted)
    .map((member) => ({
      userId: member.user.id,
      name: member.user.name,
      isSelected: true,
    }))
    .sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

  const [getStatisticsLazyQuery, { data, loading: loadingStatisticsData }] =
    useGetStatisticsLazyQuery();

  const onSubmit = () => {
    const { userIds, year, month } = getValues();
    const [startDate, endDate] = getMonthStartEnd(
      new Date(`${year}-${month}-1`)
    );

    getStatisticsLazyQuery({
      variables: {
        input: {
          startDate,
          endDate,
          clinicId: selectedInfo.clinic!.id,
          userIds: Array.isArray(userIds)
            ? userIds.map((id) => +id)
            : [+userIds],
        },
      },
    });
  };

  const getMonthStartDate = () => {
    const { year, month } = getValues();
    return new Date(`${year}-${month}-1`);
  };
  const getMonthEndDate = () => {
    const { year, month } = getValues();
    return getMonthStartEnd(new Date(`${year}-${month}-1`))[1];
  };

  const changeYear = (action: 'plus' | 'minus') => {
    const { year } = getValues();
    if (action === 'plus') {
      return setValue('year', +year + 1);
    }
    return setValue('year', +year - 1);
  };

  const resetYear = () => {
    setValue('year', selectedDate.getFullYear());
    setValue('month', selectedDate.getMonth() + 1 + '');
  };

  useEffect(() => {
    if (
      loadingStatisticsData ||
      !data?.getStatistics.dailyReports ||
      !data?.getStatistics.prescriptions
    )
      return;

    const { dailyReports, prescriptions, visitRates } = data.getStatistics;

    const newUserStatistics = combineUserStatistics({
      dailyReports,
      memberState: acceptedMember,
      prescriptions,
    });
    setUserStatistics(newUserStatistics);
  }, [data]);

  return (
    <>
      <DashboardSectionLayout
        elementName="date-picker"
        hasShadow
        children={
          <div className="flex flex-col items-center justify-center gap-x-4 gap-y-1">
            <div className="flex w-full justify-between gap-4">
              <div className="flex items-center">
                <MenuButton
                  onClick={() => changeYear('minus')}
                  icon={<FontAwesomeIcon icon={faChevronLeft} fontSize={14} />}
                  enabled
                  hasBorder
                />
                <input
                  type="number"
                  {...register('year', { required: true })}
                  className="pointer-events-none w-10 appearance-none text-center"
                  onClick={resetYear}
                />
                <MenuButton
                  onClick={() => changeYear('plus')}
                  enabled
                  icon={<FontAwesomeIcon icon={faChevronRight} fontSize={14} />}
                  hasBorder
                />
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month, idx) => (
                  <Checkbox
                    key={month}
                    id={month + ''}
                    label={month + '월'}
                    type="radio"
                    value={month}
                    register={register('month', {
                      required: true,
                    })}
                  />
                ))}
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex w-full flex-wrap gap-4 px-2 py-1.5">
                {acceptedMember?.map((member) => (
                  <Checkbox
                    key={member.userId}
                    id={member.name}
                    label={member.name}
                    type="checkbox"
                    value={member.userId}
                    register={register('userIds', {
                      required: true,
                    })}
                  />
                ))}
                <Button
                  type="submit"
                  canClick={isValid}
                  loading={loadingStatisticsData}
                  isSmall
                >
                  조회하기
                </Button>
              </div>
            </form>
          </div>
        }
      />
      {loadingStatisticsData && <Loading />}
      {!loadingStatisticsData &&
      userStatistics &&
      data &&
      data.getStatistics.dailyReports ? (
        <>
          {data.getStatistics.dailyReports.length < 1 ? (
            <Worning type="hasNotStatistics" />
          ) : (
            userStatistics.length > 0 && (
              <Charts
                userStatistics={userStatistics}
                prescriptions={data.getStatistics.prescriptions!}
                dailyReports={data.getStatistics.dailyReports}
                startDate={getMonthStartDate()}
                endDate={getMonthEndDate()}
              />
            )
          )}
        </>
      ) : (
        <Worning>사용자를 선택하고 조회하기를 눌러주세요</Worning>
      )}
    </>
  );
}
