import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet, useLocation } from "react-router-dom";
import { NameTag } from "../components/name-tag";
import { ScheduleBox } from "../components/schedule-box";
import TableRow from "../components/table-row";
import { cls, getHHMM, getTimeLength } from "../libs/utils";
import {
  listReservationsQuery,
  listReservationsQueryVariables,
} from "../__generated__/listReservationsQuery";
import { selectedPatientVar } from "./reserve";

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

interface ITableLength {
  start: { hours: number; minutes: number };
  end: { hours: number; minutes: number };
}

const ONE_DAY = 1;
const ONE_WEEK = 7;
const TWO_WEEKS = 14;
const THREE_WEEKS = 21;

interface IDay {
  title: string;
  date: Date;
}

export const TimeTable = () => {
  const [tableLength, setTableLength] = useState<ITableLength>({
    start: { hours: 9, minutes: 0 },
    end: { hours: 19, minutes: 0 },
  });
  const [viewOption, setViewOption] = useState<number>(ONE_DAY);
  const [queryDate, setQueryDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState();
  const [oneWeek, setOneWeek] = useState();
  const [weeks, setWeeks] = useState<Date[] | null>(getWeeks(new Date()));
  const [dateOfMonth, setDateOfMonth] = useState<Date[]>(
    getDateOfMonth(new Date())
  );

  const onClickPrevWeek = () => {
    const date = new Date(queryDate);
    date.setDate(date.getDate() - 7);
    setQueryDate(date);
  };
  const onClickNextWeek = () => {
    const date = new Date(queryDate);
    date.setDate(date.getDate() + 7);
    setQueryDate(date);
  };

  function getLabels() {
    const labels: { date: Date; hhmm: string }[] = [];
    const start = new Date();
    const end = new Date(start);
    start.setHours(tableLength.start.hours);
    start.setMinutes(tableLength.start.minutes);
    end.setHours(tableLength.end.hours);
    end.setMinutes(tableLength.end.minutes);
    let i = 0;
    while (i !== 150) {
      const date = new Date(start);
      labels.push({ date, hhmm: getHHMM(date) });
      const getHours = start.getHours();
      const getMinutes = start.getMinutes();
      start.setMinutes(getMinutes + 10);
      i++;
      if (start.valueOf() > end.valueOf()) i = 150;
    }
    return labels;
  }
  const labels = getLabels();

  function getWeeks(value: Date) {
    let result = [];
    const date = new Date(value);
    const day = date.getDay();
    const sunday = new Date(date.setDate(date.getDate() - day));
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(sunday);
      weekDate.setDate(sunday.getDate() + i);
      result.push(new Date(weekDate));
    }
    return result;
  }
  function getDateOfMonth(value: Date) {
    let result = [];
    const firstDate = new Date(value);
    const lastDate = new Date(firstDate);
    firstDate.setDate(1);
    lastDate.setMonth(lastDate.getMonth() + 1);
    lastDate.setDate(0);
    for (let i = 1; i <= lastDate.getDate(); i++) {
      const date = new Date(firstDate);
      date.setDate(+i);
      result.push(date);
    }
    return result;
  }

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
    setWeeks(getWeeks(new Date(queryDate)));
    queryListReservations();
  }, [queryDate]);

  console.log("⚠️ :", queryResult);

  return (
    <>
      <Outlet />
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <div className="h-full space-y-2">
        <div className="mx-8 flex items-center justify-between">
          <div className="flex w-full">
            <span>{queryDate.getMonth() + 1}월</span>
          </div>
          <div className="flex w-full justify-end space-x-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="cursor-pointer" onClick={onClickPrevWeek}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          {weeks?.map((week, i) => (
            <div
              onClick={() => setQueryDate(week)}
              key={i}
              className={cls(
                "flex w-full cursor-pointer flex-col text-center hover:border-b-gray-500 hover:font-extrabold",
                queryDate.getDate() === week.getDate()
                  ? "border-b-2 border-sky-400 font-bold"
                  : "border-b-2 border-transparent"
              )}
            >
              <span
                className={cls(
                  "rounded-full",
                  week.getDay() === 0
                    ? "text-red-500"
                    : week.getDay() === 6
                    ? "text-blue-500"
                    : "text-gray-500",
                  queryDate.getDate() === week.getDate()
                    ? "opacity-100"
                    : "opacity-80"
                )}
              >
                {week.getDate()}
              </span>
            </div>
          ))}
          <div className="cursor-pointer" onClick={onClickNextWeek}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
        <div className="flex justify-center border-b pb-2">
          <span className="text-sm text-gray-500">
            {queryDate.toLocaleString("ko-KR", {
              year: "2-digit",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </span>
        </div>
        <div className="bg-zinc-10 h-full overflow-y-scroll pb-28">
          <div className="main grid grid-cols-[4rem,1fr]  pt-2">
            {labels.map((label, i) => (
              <TableRow
                key={label.hhmm}
                label
                date={label.date}
                hhmm={label.hhmm}
              />
            ))}
            {labels.map((label, i) => (
              <TableRow
                key={label.hhmm}
                date={label.date}
                hhmm={label.hhmm}
                gridRowStart={i + 1 + ""}
              />
            ))}
            {queryResult?.listReservations.results?.map((reservation) => {
              const hhmm = getHHMM(reservation.startDate);
              const index = labels.findIndex((label) => label.hhmm === hhmm);
              const time =
                getTimeLength(reservation.startDate, reservation.endDate) / 10;
              return (
                <ScheduleBox
                  key={reservation.id}
                  gridRowStart={index + 1}
                  gridRowEnd={index + 1 + time}
                  hhmm={getHHMM(reservation.startDate)}
                >
                  <NameTag
                    id={reservation.id}
                    gender={reservation.patient.gender}
                    name={reservation.patient.name}
                    registrationNumber={reservation.patient.registrationNumber}
                    birthday={reservation.patient.birthday}
                  />
                  <span>{reservation.memo}</span>
                </ScheduleBox>
              );
            })}
          </div>
        </div>
        <div className="text-medium fixed inset-x-0 bottom-0 z-50 flex h-10 items-center justify-between border-t bg-white px-2">
          <div>오늘</div>
          <div>캘린더</div>
          <div>초대</div>
        </div>
      </div>
    </>
  );
};
