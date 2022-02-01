import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Reservation } from "../../components/Reservation";
import { ONE_DAY, ONE_WEEK } from "../../constants";
import { getHHMM, getWeeksDate, getYMD } from "../../hooks/handleTimeFormat";
import { makeLabels } from "../../hooks/makeLabels";
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

export interface ILabel {
  label: string;
  reservations?: listReservationsQuery_listReservations_results[];
}

export interface IDays {
  date: Date;
  reservations: listReservationsQuery_listReservations_results[];
  timezones: ILabel[];
}

export class Day {
  date: Date;
  reservations: listReservationsQuery_listReservations_results[];
  timezones: [];
  constructor(
    date: Date,
    reservations: listReservationsQuery_listReservations_results[] = [],
    timezones = []
  ) {
    this.date = date;
    this.reservations = reservations;
    this.timezones = [];
  }
}

export const TimeTable = () => {
  // 시간표에 출력할 시간 설정
  const [tableStartAndEndTime, setTableStartAndEndTime] = useState([
    "0900",
    "1900",
  ]);
  // 칸을 그리기 위한 배열. 10분 단위로 모든 칸을 그림
  const labels: ILabel[] = makeLabels(tableStartAndEndTime, "forLabel");
  // 예약을 담는 배열. 날짜별로 한 배열에 넣는다
  let days: IDays[] = [];

  const [schedules, setSchedules] = useState(days);
  // 쿼리할 때 사용할 날짜로 이 값을 기준으로 날짜를 쿼리 한다.
  const [queryDate, setQueryDate] = useState<Date>(
    new Date("2022-01-10T00:00:00.000Z")
  );

  // 1일 보기, 1주 보기, 2주 보기, 1달 보기
  // 예정: function initializeQueryDate( ){ localstorage에 뷰 옵션을 설정하고 불러와서 setViewOption 변경 }
  const [viewOption, setViewOption] = useState(ONE_WEEK);
  const onClickChangeViewOneDay = () => setViewOption(ONE_DAY);
  const onClickChangeViewOneWeek = () => setViewOption(ONE_WEEK);

  function makeTableViewDate(option: number) {
    if (option === ONE_WEEK) {
    }
    if (option === ONE_DAY) {
    }
  }
  makeTableViewDate(viewOption);

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
            viewOption: viewOption,
            groupId: null,
          },
        },
      }
    );

  useEffect(() => {
    queryListReservations();
    if (!loading && queryResult) {
      const reservations = queryResult?.listReservations.results;
      if (viewOption === ONE_DAY && reservations) {
        console.log("⚠️ :ONE_DAY TRUE");
        days.push(new Day(queryDate));
        days[ONE_DAY - 1].reservations = reservations;
      }
      if (viewOption === ONE_WEEK && reservations) {
        console.log("⚠️ :ONE_WEEK TRUE");
        days = getWeeksDate(queryDate);
        days.forEach((day) => {
          day.reservations = reservations.filter(
            (reservation) =>
              reservation.startDate.substring(0, 11) ===
              day.date.toISOString().substring(0, 11)
          );
        });
      }
      days.forEach((day) => {
        day.timezones = makeLabels(tableStartAndEndTime);
        day.reservations.forEach((reservation) => {
          const hhmm = getHHMM(reservation.startDate);
          const index = day.timezones.findIndex(
            (labels) => labels.label === hhmm
          );
          day.timezones[index].reservations?.push(reservation);
        });
      });
      setSchedules(days);
    }
  }, [queryDate, loading, queryResult]);

  console.log("⚠️ :", schedules);
  // console.log("⚠️ :", labels);
  return (
    <>
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <div className="container mx-auto  h-full">
        <div className="day-button-box flex items-center justify-around">
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
        <div className="header flex h-full justify-between px-4">
          <button onClick={onClickPrevDate}>&larr;</button>
          <button onClick={onClickToday}>
            {queryDate.getMonth() + 1}월 {queryDate.getDate()}일
          </button>
          <button onClick={onClickNextDate}>&rarr;</button>
        </div>
        <div
          className={`main h-full  divide-x ${
            viewOption === ONE_DAY
              ? "grid grid-cols-[4rem,1fr]"
              : viewOption === ONE_WEEK
              ? "grid grid-cols-[4rem,repeat(7,1fr)]"
              : ""
          }`}
          // style={{ gridTemplateRows: `repeat(${schedules.length}, 20px)` }}
        >
          {labels.map((label, index) => (
            <div
              key={index}
              className={`${label.label} col-start-1 min-h-[1rem] border-t text-center text-xs`}
              style={{ gridRowStart: `${index + 1}` }}
            >
              {label.label?.substring(2) === "00" ||
              label.label?.substring(2) === "30"
                ? label.label
                : ""}
            </div>
          ))}
          {schedules.map((day, dayIndex) => {
            return day.timezones.map((timezone, labelIndex) => (
              <div
                key={labelIndex}
                className={`${day.date.getDay()}-${
                  timezone.label
                }-${labelIndex} c-col-start-${
                  dayIndex + 2
                } min-h-[1rem] border-t`}
                style={{
                  gridRowStart: `${labelIndex}`,
                }}
              />
            ));
          })}
          {/* 쿼리 데이터 출력 */}
          {schedules.map((day, dayIndex) => {
            return day.timezones.map((timezone, tIndex) => {
              const timezoneLength = timezone.reservations?.length;
              return timezone.reservations?.map((reservation, rIndex) => {
                return (
                  <Reservation
                    key={rIndex}
                    date={day.date}
                    startDate={reservation.startDate}
                    endDate={reservation.endDate}
                    rIndex={rIndex}
                    gridColStart={dayIndex + 2}
                    gridRowStart={tIndex + 1}
                    timezoneLength={timezoneLength ? timezoneLength : 0}
                    lastModifier={reservation.lastModifier.email}
                    memo={reservation.memo}
                    state={reservation.state}
                    patientName={reservation.patient.name}
                    patientGender={reservation.patient.gender}
                    patientBirthday={reservation.patient.birthday}
                    patientRegistrationNumber={
                      reservation.patient.registrationNumber
                    }
                  />
                );
              });
            });
          })}
        </div>
      </div>
    </>
  );
};
