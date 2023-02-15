import {
  IDailyPrescription,
  IDailyReport,
  IUserStatistics,
} from '../../../../types/commonTypes';
import { makeArrFromLength } from '../../../../utils/commonUtils';
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
  showPrice = false,
}: TableChartColLayoutProps) {
  const userCounts = dailyReports?.reduce(
    (acc, cur) => [
      acc[0] + cur.reservationCount,
      acc[1] + cur.newPatient,
      acc[2] + cur.noshow,
      acc[3] + cur.cancel,
      acc[4] +
        cur.users.reduce((_acc, _cur) => _acc + _cur.visitMoreThanThirty, 0),
    ],
    makeArrFromLength(5)
  );

  function getCount(hasPrice: boolean) {
    const countLength = makeArrFromLength(prescriptionInfo.length);

    return hasPrice
      ? userStatistics.reduce(
          (acc, user) =>
            acc.map((price, idx) => price + user.prescriptions[idx].price),
          countLength
        )
      : userStatistics.reduce(
          (acc, user) =>
            acc.map((count, idx) => count + user.prescriptions[idx].count),
          countLength
        );
  }

  const prescriptionsValue = userCounts ? null : getCount(showPrice);
  const counts = userCounts || prescriptionsValue;
  const labels =
    labelNames || prescriptionInfo.map((prescription) => prescription.name);

  return (
    <div className="TABLE_CHART_COL_LAYOUT flex px-4">
      <TableChartCol title="이름">
        <>
          {labels.map((name, idx) => (
            <DashboardLi key={idx} textCenter borderRight textContents={name} />
          ))}
          {hasTotalInColumn ? (
            <DashboardLi borderTop textCenter textContents="합계" />
          ) : (
            ''
          )}
        </>
      </TableChartCol>

      {userStatistics.map((user, idx) => {
        switch (renderIt) {
          case 'counts':
            return (
              <TableChartCol key={idx} title={user.name}>
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
              </TableChartCol>
            );
          case 'prescriptions':
            return (
              <TableChartCol key={idx} title={user.name}>
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
              </TableChartCol>
            );
          default:
            return false;
        }
      })}

      {hasTotalInRow && counts && userStatistics.length > 1 && (
        <TableChartCol title="합계">
          <>
            {counts.map((totalCount, i) => (
              <DashboardLi key={i} textContents={totalCount.toLocaleString()} />
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
        </TableChartCol>
      )}
    </div>
  );
}
