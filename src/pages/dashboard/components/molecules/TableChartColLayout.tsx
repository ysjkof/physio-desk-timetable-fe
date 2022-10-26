import {
  IDailyPrescription,
  IDailyReport,
  IUserStatistics,
} from '../../../../types/common.types';
import { makeArrFromLength } from '../../../../utils/utils';
import DashboardLi from './DashboardLi';
import TableChartCol from './TableChartCol';

interface TableChartColLayoutProps {
  userStatistics: IUserStatistics[];
  dailyReports?: IDailyReport[];
  prescriptionInfo: IDailyPrescription[];
  labelNames?: string[];
  renderIt: 'counts' | 'prescriptions';
  hasTotalInRow?: boolean;
  hasTotalInColumn?: boolean;
  showPrice?: boolean;
}
export default function TableChartColLayout({
  dailyReports,
  userStatistics,
  prescriptionInfo,
  labelNames,
  renderIt,
  hasTotalInRow,
  hasTotalInColumn,
  showPrice,
}: TableChartColLayoutProps) {
  const userCounts = dailyReports?.reduce(
    (acc, cur) => [
      acc[0] + cur.reservationCount,
      acc[1] + cur.newPatient,
      acc[2] + cur.noshow,
      acc[3] + cur.cancel,
      acc[4] + cur.users.reduce((acc, cur) => acc + cur.visitMoreThanThirty, 0),
    ],
    makeArrFromLength(5)
  );

  function getCount() {
    const countLength = makeArrFromLength(prescriptionInfo.length);
    switch (showPrice) {
      case true:
        return userStatistics.reduce(
          (acc, user) =>
            acc.map((price, idx) => price + user.prescriptions[idx].price),
          countLength
        );
      case false:
        return userStatistics.reduce(
          (acc, user) =>
            acc.map((count, idx) => count + user.prescriptions[idx].count),
          countLength
        );
    }
  }

  const prescriptionsValue = userCounts ? null : getCount();
  const counts = userCounts ? userCounts : prescriptionsValue;
  const lables = labelNames
    ? labelNames
    : prescriptionInfo.map((prescription) => prescription.name);

  return (
    <div className="TABLE_CHART_COL_LAYOUT flex px-4">
      <TableChartCol
        title="이름"
        children={
          <>
            {lables.map((name, idx) => (
              <DashboardLi
                key={idx}
                textCenter
                borderRight
                textContents={name}
              />
            ))}
            {hasTotalInColumn ? (
              <DashboardLi borderTop textCenter textContents={'합계'} />
            ) : (
              ''
            )}
          </>
        }
      />

      {userStatistics.map((user, idx) => {
        switch (renderIt) {
          case 'counts':
            return (
              <TableChartCol
                key={idx}
                title={user.name}
                children={
                  <>
                    {Object.values(user.counts).map((count, i) => (
                      <DashboardLi
                        key={i}
                        textContents={count.toLocaleString()}
                      />
                    ))}
                    {hasTotalInColumn ? (
                      <DashboardLi
                        borderTop
                        textContents={Object.values(user.counts)
                          .reduce((acc, count) => acc + count, 0)
                          .toLocaleString()}
                      />
                    ) : (
                      ''
                    )}
                  </>
                }
              />
            );
          case 'prescriptions':
            return (
              <TableChartCol
                key={idx}
                title={user.name}
                children={
                  <>
                    {user.prescriptions.map((prescription, i) => (
                      <DashboardLi
                        key={i}
                        textContents={
                          showPrice
                            ? prescription.price.toLocaleString()
                            : prescription.count.toLocaleString()
                        }
                      />
                    ))}
                    {hasTotalInColumn ? (
                      <DashboardLi
                        borderTop
                        textContents={
                          showPrice
                            ? user.prescriptions
                                .reduce((acc, cur) => acc + cur.price, 0)
                                .toLocaleString()
                            : user.prescriptions
                                .reduce((acc, cur) => acc + cur.count, 0)
                                .toLocaleString()
                        }
                      />
                    ) : (
                      ''
                    )}
                  </>
                }
              />
            );
        }
      })}

      {hasTotalInRow && counts && userStatistics.length > 1 && (
        <TableChartCol
          title="합계"
          children={
            <>
              {counts.map((totalCount, i) => (
                <DashboardLi
                  key={i}
                  textContents={totalCount.toLocaleString()}
                />
              ))}
              {hasTotalInColumn ? (
                <DashboardLi
                  borderTop
                  textContents={counts
                    .reduce((acc, cur) => acc + cur, 0)
                    .toLocaleString()}
                />
              ) : (
                ''
              )}
            </>
          }
        />
      )}
    </div>
  );
}
