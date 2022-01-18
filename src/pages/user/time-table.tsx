import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ReservationBlock } from "../../components/reservation-block";
import { ONE_DAY, ONE_WEEK } from "../../constants";
import { getHHMM, getWeeksDate, getYYMMDD } from "../../hooks/handleTimeFormat";
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

interface IReservationsContainer {
  timezone: string;
  date: string;
  reservationsCount: number;
  reservations: listReservationsQuery_listReservations_results[];
}

export interface ITableViewDate {
  day: number;
  date: number;
  month: number;
  year: number;
  isToday: boolean;
  fulldate: Date;
}

export const TimeTable = () => {
  // 시간표에 출력할 시간 설정
  const [timeoption, setTiemoption] = useState(["0900", "1900"]);
  const reservationsContainer: IReservationsContainer[] = [];
  let tableViewDate: ITableViewDate[] = [];
  const [schedulesContainer, setSchedulesContainer] = useState(
    reservationsContainer
  );
  // 쿼리할 때 사용할 날짜로 이 값을 기준으로 날짜를 쿼리 한다.
  const [queryDate, setQueryDate] = useState(new Date("2022-01-09"));
  // 1일 보기, 1주 보기, 2주 보기, 1달 보기
  const [tableView, setTableView] = useState(ONE_WEEK);

  function makeTableViewDate(option: number) {
    if (option === ONE_WEEK) {
      tableViewDate = getWeeksDate(queryDate);
    }
    if (option === ONE_DAY) {
      tableViewDate.push({
        day: queryDate.getDay(),
        date: queryDate.getDate(),
        month: queryDate.getMonth() + 1,
        year: queryDate.getFullYear(),
        isToday: false,
        fulldate: queryDate,
      });
    }
    console.log("⚠️ :", tableViewDate);
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
            viewOption: null,
            groupId: null,
          },
        },
      }
    );

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
      reservationsContainer.push({
        timezone: hhmm,
        date: getYYMMDD(queryDate),
        reservationsCount: 0,
        reservations: [],
      });

    if (reservationsContainer.length > 200) {
      break;
    }
  }

  useEffect(() => {
    queryListReservations();
    if (!loading && queryResult) {
      const reservations = queryResult?.listReservations.results;
      if (reservations) {
        for (const reservation of reservations) {
          const hhmm = getHHMM(reservation.startDate);
          const scheduleIndex = reservationsContainer.findIndex(
            (schedule) => schedule.timezone === hhmm
          );
          reservationsContainer[scheduleIndex].timezone = hhmm;
          reservationsContainer[scheduleIndex].reservations.push({
            ...reservation,
          });
          reservationsContainer[scheduleIndex].reservationsCount =
            reservationsContainer[scheduleIndex].reservationsCount + 1;
        }
        setSchedulesContainer(reservationsContainer);
      }
    }
  }, [queryDate, loading, queryResult]);

  return (
    <>
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <div className="container mx-auto  h-full">
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
          {schedulesContainer.map((schedule, index) => (
            <>
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
              {tableViewDate.map((day) => (
                <div
                  className={`${schedule.timezone} col-start-${
                    day.day + 2
                  } text-center text-xs h-6 border-t border-gray-200`}
                  style={{ gridRowStart: `${index + 1}` }}
                />
              ))}
            </>
          ))}
          {schedulesContainer.map((schedule, row) =>
            schedule.reservationsCount === 1 ? (
              <ReservationBlock
                key={schedule.reservations[0].id}
                timezone={schedule.timezone}
                row={row}
                startDate={schedule.reservations[0].startDate}
                endDate={schedule.reservations[0].endDate}
                registrationNumber={
                  schedule.reservations[0].patient.registrationNumber
                }
                birthday={schedule.reservations[0].patient.birthday}
                gender={schedule.reservations[0].patient.gender}
                name={schedule.reservations[0].patient.name}
                memo={schedule.reservations[0].memo}
                reservationsCount={schedule.reservationsCount}
                reservationIndex={0}
              />
            ) : (
              schedule.reservations.map((reservation) => (
                <ReservationBlock
                  key={reservation.id}
                  timezone={schedule.timezone}
                  row={row}
                  startDate={reservation.startDate}
                  endDate={reservation.endDate}
                  registrationNumber={reservation.patient.registrationNumber}
                  birthday={reservation.patient.birthday}
                  gender={reservation.patient.gender}
                  name={reservation.patient.name}
                  memo={reservation.memo}
                  reservationsCount={schedule.reservationsCount}
                  reservationIndex={
                    schedule.reservations.indexOf(reservation) + 1
                  }
                />
              ))
            )
          )}
        </div>
      </div>
    </>
  );
};
