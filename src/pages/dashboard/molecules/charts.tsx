import { DashboardSectionLayout } from "../components/section-layout";
import { getHowManyDayFromMillisec } from "../../../libs/utils";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryLegend,
  VictoryPie,
} from "victory";
import { compareDateMatch, getYMD } from "../../../libs/timetable-utils";
import { TableChartColLayout } from "./table-chart-col-layout";
import {
  IDailyPrescription,
  IDailyReport,
  IUserStatistics,
} from "../organisms/statistics";
import {
  STATISTICS_LABEL,
  STATISTICS_LABEL_COLORS,
  STATISTICS_LABEL_ENG,
  STATISTICS_LABEL_KOR,
  USER_COLORS,
} from "../../../variables";
import { useEffect, useState } from "react";

interface IChartsProps {
  userStatistics: IUserStatistics[];
  prescriptions: IDailyPrescription[];
  dailyReports: IDailyReport[];
  startDate: Date;
  endDate: Date;
}

function getCountsLabelsToKor(prescriptionName: STATISTICS_LABEL) {
  switch (prescriptionName) {
    case "reservationCount":
      return "예약";
    case "newPatient":
      return "신규";
    case "noshow":
      return "부도";
    case "cancel":
      return "취소";
    case "visitMoreThanThirty":
      return "방문한지 30일 경과";
  }
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
      compareDateMatch(dateObj, everyDate, "ymd")
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

export const Charts = ({
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

  const userLengthArr: any[] = [];
  userLengthArr.length = userStatistics.length;
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
  return (
    finalDailyReports &&
    userReports && (
      <>
        <div className="PRESCRIPTION_COUNTS flex">
          <DashboardSectionLayout
            elementName="TABLE_PRESCRIPTION_COUNTS"
            padding
            children={
              <>
                <TableChartColLayout
                  userStatistics={userStatistics}
                  prescriptionInfo={prescriptions}
                  renderIt={"prescriptions"}
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
                  renderIt={"prescriptions"}
                  hasTotalInRow
                  hasTotalInColumn
                  showPrice
                />
              </>
            }
          />
        </div>
        <div className="EVERYDAY_COUNTS">
          {STATISTICS_LABEL_ENG.map((label, i) => (
            <DashboardSectionLayout
              key={i}
              padding
              elementName="GRAPH_EVERYDAY_RESERVATION"
              children={
                <div className="position-center-x relative max-w-4xl">
                  <VictoryChart
                    height={200}
                    width={1000}
                    minDomain={{ y: 0 }}
                    domainPadding={{ x: 5 }}
                  >
                    <VictoryLegend
                      x={80}
                      title={`일별 ${getCountsLabelsToKor(label)}`}
                      centerTitle
                      style={{ title: { fontSize: 14 } }}
                      data={[]}
                    />
                    <VictoryGroup offset={10} colorScale={USER_COLORS[0]}>
                      {userLengthArr.map((aa, idx) => (
                        <VictoryBar
                          key={idx}
                          alignment="start"
                          data={finalDailyReports.map((day) => ({
                            x: day.date,
                            y: day.users[idx] ? day.users[idx][label] : 0,
                          }))}
                          style={{
                            data: {
                              width: 10,
                            },
                          }}
                          labelComponent={<VictoryLabel dx={5} />}
                          labels={({ datum }) => (datum.y === 0 ? "" : datum.y)}
                        />
                      ))}
                    </VictoryGroup>
                    <VictoryAxis
                      dependentAxis
                      style={{
                        tickLabels: {
                          fontSize: 12,
                        },
                      }}
                      tickFormat={(tick) => (tick % 1 === 0 ? `${tick}명` : "")}
                    />
                    <VictoryAxis
                      style={{
                        tickLabels: {
                          fontSize: 12,
                          angle: -35,
                        },
                        axisLabel: { padding: 35 },
                      }}
                      tickValues={finalDailyReports.map((day) => day.date)}
                      tickFormat={(tick) => {
                        return getYMD(tick, "mmdd", "-");
                      }}
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
                  renderIt={"counts"}
                  labelNames={STATISTICS_LABEL_KOR}
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
                  data={STATISTICS_LABEL_KOR.map((label) => ({
                    name: label,
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
                      labels={({ datum }) => (datum.y === 0 ? "" : datum.y)}
                      colorScale={STATISTICS_LABEL_COLORS[0]}
                    />
                  ))}
                </div>
              </div>
            }
          />
        </div>
      </>
    )
  );
};