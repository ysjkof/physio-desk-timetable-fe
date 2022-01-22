import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ReservationBlock } from "../../components/reservation-block";
import { ONE_DAY, ONE_WEEK } from "../../constants";
import { getHHMM, getWeeksDate, getYMD } from "../../hooks/handleTimeFormat";
import {
  listReservationsQuery,
  listReservationsQueryVariables,
  listReservationsQuery_listReservations_results,
} from "../../__generated__/listReservationsQuery";

const LIST_RESERVATIONS_QUERY = gql`
  query listReservationsQuery($input: ListReservationsInput!) {
    listReservations(input: $input) {
      ok
      totalCount
      results {
        id
        startDate
        endDate
        state
        memo
        patient {
          name
          gender
          registrationNumber
          birthday
        }
        lastModifier {
          email
        }
      }
    }
  }
`;

interface ILabelContainer {
  timezone: string;
  reservationsCount: number;
  reservations: listReservationsQuery_listReservations_results[];
}

export interface ITableViewDate {
  day: number;
  date: number;
  month: number;
  year: number;
  isToday: boolean;
  fulldate: string;
  event: ILabelContainer[];
}

export const TimeTable = () => {
  // 시간표에 출력할 시간 설정
  const [timeoption, setTiemoption] = useState(["0900", "1900"]);
  const LabelContainer: ILabelContainer[] = [];
  let tableViewDate: ITableViewDate[] = [];
  const [schedulesContainer, setSchedulesContainer] = useState(tableViewDate);
  // 쿼리할 때 사용할 날짜로 이 값을 기준으로 날짜를 쿼리 한다.
  const [queryDate, setQueryDate] = useState<Date>(new Date("2022-01-11"));
  // 1일 보기, 1주 보기, 2주 보기, 1달 보기
  // 예정: function initializeQueryDate( ){ localstorage에 뷰 옵션을 설정하고 불러와서 setTableView 변경 }
  const [tableView, setTableView] = useState(ONE_WEEK);
  const onClickChangeViewOneDay = () => setTableView(ONE_DAY);
  const onClickChangeViewOneWeek = () => setTableView(ONE_WEEK);

  // 아래 for는 timeoption에 따른 ReservationsContainer를 만든다.
  // 수의 증가를 위해 timeoption을 숫자로 바꿈
  for (
    let i = parseInt(timeoption[0]);
    i <= parseInt(timeoption[1]);
    i = i + 10
  ) {
    let hhmm: string = "";
    // i의 자릿수를 맞추기 위해서 확인하고 string으로 바꿔서 hhmm에 할당
    if (String(i).length === 4) {
      hhmm = String(i);
    } else if (String(i).length === 3) {
      hhmm = String(i).padStart(4, "0");
    }
    // 60분이 되면 시간이 1오르고 0분이 되야 하는데 숫자는 10진법이고, 문자열이라서 10분 단위 위치인 3번째 자리를 읽어서 확인, hhmm을 빈 문자열로 만들고 i값을 더함
    const handleOverMinute = (number: number) => {
      hhmm = "";
      i = i + number;
    };
    if (hhmm[2] === "6") handleOverMinute(30);
    if (hhmm[2] === "7") handleOverMinute(20);
    if (hhmm[2] === "8") handleOverMinute(10);
    if (hhmm[2] === "9") handleOverMinute(0);
    // 10분 단위가 6~9인 경우 hhmm의 길이가 0이고 이때 push하지 않는다.
    if (hhmm.length !== 0)
      LabelContainer.push({
        timezone: hhmm,
        reservationsCount: 0,
        reservations: [],
      });

    if (LabelContainer.length > 200) {
      break;
    }
  }

  function makeTableViewDate(option: number) {
    const label = LabelContainer;
    if (option === ONE_WEEK) {
      tableViewDate = getWeeksDate(queryDate);
      tableViewDate.map((day) => {
        day.event = label;
      });
    }
    if (option === ONE_DAY) {
      tableViewDate.push({
        day: queryDate.getDay(),
        date: queryDate.getDate(),
        month: queryDate.getMonth() + 1,
        year: queryDate.getFullYear(),
        isToday: false,
        fulldate: queryDate.toISOString(),
        event: label,
      });
    }
  }
  makeTableViewDate(tableView);

  const onClickPrevDate = () => {
    const prevDate = new Date(queryDate.setDate(queryDate.getDate() - 1));
    setQueryDate(prevDate);
  };
  const onClickNextDate = () => {
    const nextDate = queryDate.setDate(queryDate.getDate() + 1);
    setQueryDate(new Date(nextDate));
  };
  const onClickToday = () => setQueryDate(new Date());

  const [queryListReservations, { loading, error, data: queryResult }] =
    useLazyQuery<listReservationsQuery, listReservationsQueryVariables>(
      LIST_RESERVATIONS_QUERY,
      {
        variables: {
          input: {
            date: queryDate,
            viewOption: tableView,
            groupId: null,
          },
        },
      }
    );

  useEffect(() => {
    queryListReservations();
    if (!loading && queryResult) {
      const reservations = queryResult?.listReservations.results;
      if (tableView === ONE_DAY && reservations) {
        for (const reservation of reservations) {
          const hhmm = getHHMM(reservation.startDate);
          const date = getYMD(reservation.startDate, "yymmdd");
          const eventIndex = tableViewDate[ONE_DAY - 1].event.findIndex(
            (schedule) => schedule.timezone === hhmm
          );
          tableViewDate[ONE_DAY - 1].event[eventIndex].timezone = hhmm;
          tableViewDate[ONE_DAY - 1].event[eventIndex].reservations.push({
            ...reservation,
          });
          tableViewDate[ONE_DAY - 1].event[eventIndex].reservationsCount =
            tableViewDate[ONE_DAY - 1].event[eventIndex].reservationsCount + 1;
        }
        setSchedulesContainer(tableViewDate);
      }
      if (tableView === ONE_WEEK && reservations) {
      }
    }
  }, [queryDate, loading, queryResult]);

  console.log("⚠️ : 예약 컨테이너", schedulesContainer);
  // console.log("⚠️ : 테이블 뷰 날짜", tableViewDate);
  // console.log("⚠️ : 쿼리 데이터", queryResult);
  return (
    <>
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <div className="container mx-auto  h-full">
        <div className="day-button-box flex justify-around items-center">
          <button
            className=" shadow-cst rounded-md"
            onClick={onClickChangeViewOneDay}
          >
            ONE DAY
          </button>
          <button
            className=" shadow-cst rounded-md"
            onClick={onClickChangeViewOneWeek}
          >
            ONE WEEK
          </button>
        </div>
        <div className="header h-full flex justify-between px-4">
          <button onClick={onClickPrevDate}>&larr;</button>
          <button onClick={onClickToday}>
            {queryDate.getMonth() + 1}월 {queryDate.getDate()}일
          </button>
          <button onClick={onClickNextDate}>&rarr;</button>
        </div>
        <div
          className={`h-full main ${
            tableView === ONE_DAY
              ? "grid grid-cols-[4rem,1fr]"
              : tableView === ONE_WEEK
              ? "grid grid-cols-[4rem,repeat(7,1fr)]"
              : ""
          }  grid-rows-[repeat(${schedulesContainer.length}, 20px)] `}
        >
          {LabelContainer.map((schedule, index) => (
            <>
              {/* 시간을 나타내는 레이블 */}
              <div
                key={index}
                className={`${schedule.timezone} col-start-1  text-center text-xs h-6 border-t border-gray-200`}
                style={{ gridRowStart: `${index + 1}` }}
              >
                {schedule.timezone?.substring(2) === "00" ||
                schedule.timezone?.substring(2) === "30"
                  ? schedule.timezone
                  : ""}
              </div>
            </>
          ))}
          {schedulesContainer.map((schedule, columnNumber) =>
            schedule.event.map((event, row) => {
              return (
                <>
                  <div
                    className={`${event.timezone} col-start-${
                      columnNumber + 2
                    } text-center text-xs h-6 border-t border-gray-200`}
                    style={{ gridRowStart: `${row + 1}` }}
                  />
                  {event.reservations.map((reservation, index) => (
                    <ReservationBlock
                      key={reservation.id}
                      timezone={event.timezone}
                      row={row}
                      columnNumber={columnNumber + 2}
                      startDate={reservation.startDate}
                      endDate={reservation.endDate}
                      registrationNumber={
                        reservation.patient.registrationNumber
                      }
                      birthday={reservation.patient.birthday}
                      gender={reservation.patient.gender}
                      name={reservation.patient.name}
                      memo={reservation.memo}
                      reservationsCount={event.reservationsCount}
                      reservationIndex={index}
                    />
                  ))}
                </>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
