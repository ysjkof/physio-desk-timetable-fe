import { DashboardSectionLayout } from '../components/DashboardSectionLayout';
import { useGetStatisticsQuery } from '../../../graphql/generated/graphql';
import { useEffect, useState } from 'react';
import { MenuButton } from '../../../components/molecules/MenuButton';
import { Worning } from '../../../components/atoms/Warning';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { getMonthStartEnd } from '../../../services/dateServices';
import { Loading } from '../../../components/atoms/Loading';
import { Button } from '../../../components/molecules/Button';
import combineUserStatistics from '../services/statisticsServices';
import { IUserStatistics, MemberState } from '../../../types/type';
import useStore from '../../../hooks/useStore';
import { selectedDateVar } from '../../../store';
import Charts from '../molecules/Charts';

const [initialStartDate, initailEndDate] = getMonthStartEnd(new Date());

export const Statistics = () => {
  const { selectedInfo, selectedDate } = useStore();

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initailEndDate);
  const [memberState, setMemberState] = useState<MemberState[]>();
  const [userIds, setUserIds] = useState<number[]>([]);
  const [userStatistics, setUserStatistics] = useState<
    IUserStatistics[] | null
  >(null);

  const {
    data,
    loading: loadingStatisticsData,
    refetch,
  } = useGetStatisticsQuery({
    variables: {
      input: {
        startDate,
        endDate,
        clinicId: selectedInfo.clinic?.id ?? 0,
        userIds,
      },
    },
  });

  function onClickSetDate(
    date: Date,
    month: number,
    changeYear?: 'prev' | 'next'
  ) {
    const start = new Date(date);
    start.setMonth(month);

    switch (changeYear) {
      case 'prev':
        start.setFullYear(start.getFullYear() - 1);
        break;
      case 'next':
        start.setFullYear(start.getFullYear() + 1);
        break;
    }

    const [startDate, endDate] = getMonthStartEnd(start);
    setStartDate(startDate);
    setEndDate(endDate);

    refetch({
      input: {
        startDate,
        endDate,
        clinicId: selectedInfo.clinic?.id ?? 0,
        userIds,
      },
    });
    return startDate;
  }

  function onSubmit() {
    if (memberState) {
      setUserIds(
        memberState
          .filter((member) => member.isSelected)
          .map((member) => member.userId)
      );
    }
  }

  useEffect(() => {
    setMemberState(
      selectedInfo.clinic?.members
        ?.filter((member) => member.accepted)
        ?.map((member) => ({
          userId: member.user.id,
          name: member.user.name,
          isSelected: true,
        }))
        .sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        })
    );
  }, [selectedInfo.clinic]);

  useEffect(() => {
    if (loadingStatisticsData) return;
    if (data?.getStatistics.dailyReports && data?.getStatistics.prescriptions) {
      const { dailyReports, prescriptions, visitRates } = data.getStatistics;

      console.log('dailyReports', dailyReports);
      console.log('prescriptions', prescriptions);
      console.log('visitRates', visitRates);
      console.log('memberState', memberState);

      const newUserStatistics = combineUserStatistics({
        dailyReports,
        memberState,
        prescriptions,
      });

      setUserStatistics(newUserStatistics);
    }
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
                  onClick={() => {
                    const newStartDate = onClickSetDate(
                      startDate,
                      selectedDate.getMonth(),
                      'prev'
                    );
                    selectedDateVar(new Date(newStartDate));
                  }}
                  icon={<FontAwesomeIcon icon={faChevronLeft} fontSize={14} />}
                  enabled
                  hasBorder
                />
                <MenuButton
                  label={selectedDate.getFullYear() + '년 '}
                  enabled
                />
                <MenuButton
                  onClick={() => {
                    const newStartDate = onClickSetDate(
                      startDate,
                      selectedDate.getMonth(),
                      'next'
                    );
                    selectedDateVar(new Date(newStartDate));
                  }}
                  enabled
                  icon={<FontAwesomeIcon icon={faChevronRight} fontSize={14} />}
                  hasBorder
                />
              </div>
              <div className="flex items-center gap-x-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month, idx) => (
                  <MenuButton
                    key={month}
                    hasBorder
                    onClick={() => onClickSetDate(startDate, idx)}
                    label={month + '월'}
                    enabled={startDate.getMonth() === idx}
                    hasActiveRing
                    thinFont
                    hasFocus
                  />
                ))}
              </div>
            </div>
            {memberState && (
              <div className="flex w-full justify-end gap-x-4 py-1.5">
                {memberState.map((member, idx) => (
                  <MenuButton
                    key={idx}
                    label={member.name}
                    hasBorder
                    hasActiveRing
                    thinFont
                    enabled={member.isSelected}
                    onClick={() => {
                      if (loadingStatisticsData) return;
                      memberState[idx].isSelected =
                        !memberState[idx].isSelected;
                      setMemberState([...memberState]);
                    }}
                  />
                ))}
                <Button
                  canClick={!loadingStatisticsData}
                  loading={loadingStatisticsData}
                  textContents="조회하기"
                  type="button"
                  isSmall
                  onClick={onSubmit}
                ></Button>
              </div>
            )}
          </div>
        }
      />
      {loadingStatisticsData && <Loading />}
      {!loadingStatisticsData &&
      userStatistics &&
      data &&
      data.getStatistics.prescriptions &&
      data.getStatistics.dailyReports ? (
        <>
          {data.getStatistics.prescriptions.length < 1 ? (
            <Worning type="hasNotPrescription" />
          ) : data.getStatistics.dailyReports.length < 1 ? (
            <Worning type="hasNotStatistics" />
          ) : (
            userStatistics.length > 0 && (
              <Charts
                userStatistics={userStatistics}
                prescriptions={data.getStatistics.prescriptions}
                dailyReports={data.getStatistics.dailyReports}
                startDate={startDate}
                endDate={endDate}
              />
            )
          )}
        </>
      ) : userIds.length === 0 ? (
        <Worning type="emptyUserIds" />
      ) : null}
    </>
  );
};
