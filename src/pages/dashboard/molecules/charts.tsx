import React from 'react';
import { DashboardSectionLayout } from '../components/section-layout';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryPie,
  VictoryTheme,
  VictoryTooltip,
} from 'victory';
import {
  compareDateMatch,
  getHowManyDayFromMillisec,
  getYMD,
} from '../../../services/dateServices';
import { TableChartColLayout } from './table-chart-col-layout';
import {
  IDailyPrescription,
  IDailyReport,
  IUserStatistics,
} from '../organisms/statistics';
import {
  STATISTICS_LABEL,
  STATISTICS_LABEL_COLORS,
} from '../../../constants/constants';
import { useEffect, useState } from 'react';
import { Loading } from '../../../components/atoms/loading';

interface IChartsProps {
  userStatistics: IUserStatistics[];
  prescriptions: IDailyPrescription[];
  dailyReports: IDailyReport[];
  startDate: Date;
  endDate: Date;
}

function injectEveryDayToDailyRreports(
  dailyReports: IDailyReport[],
  startD: Date,
  endD: Date
) {
  function getEveryDay(std: Date, edd: Date) {
    let arr: number[] = [];
    const start = std.getTime();
    const end = edd.getTime();
    const duration = end - start;
    const days = Math.ceil(getHowManyDayFromMillisec(duration));
    arr.length = days;
    arr.fill(0);
    return arr.map((v, idx) => {
      const newDate = new Date(std);
      newDate.setDate(newDate.getDate() + idx);
      return newDate;
    });
  }

  type TypeGraphData = typeof dailyReports[0];
  const everyDay = getEveryDay(startD, endD);
  const frame: TypeGraphData[] = everyDay.map((day) => ({
    date: day,
    reservationCount: 0,
    noshow: 0,
    cancel: 0,
    newPatient: 0,
    users: [],
  }));

  dailyReports.forEach((day, i) => {
    const dateObj = new Date(day.date);
    const idx = everyDay.findIndex((everyDate) =>
      compareDateMatch(dateObj, everyDate, 'ymd')
    );
    if (idx !== -1) frame[idx] = { ...day, date: dateObj };
    // 날짜를 전부 주입했기 때문에 idx가 -1인 경우는 없다
  });
  return frame;
}

function getUserReports(
  userStatistics: IUserStatistics[]
): { x: string; y: number }[][] {
  return userStatistics.map((user) =>
    Object.entries(user.counts).map(([key, count]) => ({ x: key, y: count }))
  );
}

const Charts = ({
  userStatistics,
  prescriptions,
  dailyReports,
  startDate,
  endDate,
}: IChartsProps) => {
  const [finalDailyReports, setFinalDailyReports] = useState<ReturnType<
    typeof injectEveryDayToDailyRreports
  > | null>(null);
  const [userReports, setUserReports] = useState<ReturnType<
    typeof getUserReports
  > | null>(null);

  const userLength = userStatistics.length;
  const userLengthArr: any[] = [];
  userLengthArr.length = userLength;
  userLengthArr.fill(0);

  useEffect(() => {
    const finalDailyReportsValue = injectEveryDayToDailyRreports(
      dailyReports,
      startDate,
      endDate
    );
    const userReportsValue = getUserReports(userStatistics);
    setFinalDailyReports(finalDailyReportsValue);
    setUserReports(userReportsValue);
  }, [dailyReports, userStatistics]);

  const a = finalDailyReports?.map((a) =>
    a.users.map((b) => [a.date.getDate() + '일', b.reservationCount])
  );

  // if (a) {
  //   console.log(a[0].flat(1));
  //   console.log(a[1].flat(1));
  //   console.log(a[2].flat(1));
  //   console.log(a[a.length - 3].flat(1));
  //   console.log(a[a.length - 2].flat(1));
  //   console.log(a[a.length - 1].flat(1));
  // }
  console.log('userLength', userLength);

  return finalDailyReports && userReports ? (
    <>
      <div className="PRESCRIPTION_COUNTS flex flex-col">
        <DashboardSectionLayout
          elementName="TABLE_PRESCRIPTION_COUNTS"
          padding
          children={
            <>
              <TableChartColLayout
                userStatistics={userStatistics}
                prescriptionInfo={prescriptions}
                renderIt={'prescriptions'}
                hasTotalInRow
                hasTotalInColumn
              />
            </>
          }
        />
        <DashboardSectionLayout
          elementName="TABLE_PRESCRIPTION_PRICE"
          padding
          children={
            <>
              <TableChartColLayout
                userStatistics={userStatistics}
                prescriptionInfo={prescriptions}
                renderIt={'prescriptions'}
                hasTotalInRow
                hasTotalInColumn
                showPrice
              />
            </>
          }
        />
      </div>
      <div className="EVERYDAY_COUNTS">
        {Object.values(STATISTICS_LABEL).map(({ eng, kor }, i) => (
          <DashboardSectionLayout
            key={i}
            padding
            elementName="GRAPH_EVERYDAY_RESERVATION"
            children={
              <div className="position-center-x relative">
                <VictoryChart
                  height={200}
                  width={1000}
                  minDomain={{ y: 0 }}
                  domainPadding={{ x: 20 }}
                  theme={VictoryTheme.material}
                  // containerComponent={<VictoryContainer responsive={false} />}
                >
                  <VictoryLegend
                    x={80}
                    title={`일별 ${kor}`}
                    centerTitle
                    style={{ title: { fontSize: 14 } }}
                    data={[]}
                  />
                  <VictoryBar
                    // alignment="start"
                    // barRatio={1}
                    data={finalDailyReports.map((day) => ({
                      x: day.date,
                      y: day.users.reduce((acc, cur) => {
                        return acc + cur[eng];
                      }, 0),
                    }))}
                    labels={({ datum }) => datum.y}
                    labelComponent={<VictoryTooltip />}
                  />

                  <VictoryAxis
                    dependentAxis
                    style={{
                      tickLabels: {
                        fontSize: 12,
                      },
                    }}
                    tickFormat={(tick) => (tick % 1 === 0 ? `${tick}명` : '')}
                  />
                  <VictoryAxis
                    style={{
                      tickLabels: {
                        fontSize: 12,
                        angle: 90,
                        padding: 18,
                      },
                      axisLabel: { padding: 39 },
                    }}
                    tickValues={finalDailyReports.map((day) => day.date)}
                    tickFormat={(tick) => {
                      return getYMD(tick, 'mmdd', '-');
                    }}
                    tickLabelComponent={<VictoryLabel dy={-5.5} />}
                    label="(월/일)"
                  />
                </VictoryChart>
              </div>
            }
          />
        ))}
      </div>

      {/* graphEachUserTotalCounts */}
      <div className="EACH_USER_TOTAL_COUNTS">
        <DashboardSectionLayout
          elementName="TABLE_EACH_USER_TOTAL_COUNTS"
          padding
          children={
            <>
              <TableChartColLayout
                userStatistics={userStatistics}
                prescriptionInfo={prescriptions}
                dailyReports={dailyReports}
                renderIt={'counts'}
                labelNames={Object.values(STATISTICS_LABEL).map(
                  ({ kor }) => kor
                )}
                hasTotalInRow
              />
            </>
          }
        />

        <DashboardSectionLayout
          elementName="GRAPH_EACH_USER_TOTAL_COUNTS_CIRCLES"
          padding
          children={
            <div className="position-center-x relative max-w-4xl ">
              <VictoryLegend
                height={24}
                orientation="horizontal"
                gutter={30}
                data={Object.values(STATISTICS_LABEL).map(({ kor }) => ({
                  name: kor,
                }))}
                labelComponent={<VictoryLabel style={{ fontSize: 10 }} />}
                colorScale={STATISTICS_LABEL_COLORS[0]}
              />
              <div className="grid grid-cols-2">
                {userReports.map((user, i) => (
                  <VictoryPie
                    key={i}
                    data={user}
                    padding={70}
                    style={{ labels: { fontSize: 16 } }}
                    labels={({ datum }) => (datum.y === 0 ? '' : datum.y)}
                    colorScale={STATISTICS_LABEL_COLORS[0]}
                  />
                ))}
              </div>
            </div>
          }
        />
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default React.memo(Charts);
