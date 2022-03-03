import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import { MoveXBtn } from "../components/move-x-btn";
import { NameTag } from "../components/name-tag";
import { ScheduleBox } from "../components/schedule-box";
import { ScheduleListBox } from "../components/schedule-list-box";
import { TableRow } from "../components/table-row";
import { cls, compareDateMatch, getHHMM, getTimeLength } from "../libs/utils";
import {
  listReservationsQuery,
  listReservationsQueryVariables,
  listReservationsQuery_listReservations_results,
} from "../__generated__/listReservationsQuery";

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

interface ILabelRow {
  labelDate: Date;
  reservations: listReservationsQuery_listReservations_results[];
}
interface IUser {
  name: string;
  labels: ILabelRow[];
}
interface IDay {
  date: Date;
  users: IUser[];
}
class LabelRow {
  labelDate;
  reservations;
  constructor({ labelDate, reservations }: ILabelRow) {
    this.labelDate = labelDate;
    this.reservations = reservations;
  }
}

class User {
  name;
  labels;
  constructor({ name, labels }: IUser) {
    this.name = name;
    this.labels = labels;
  }
}
class Day {
  date;
  users;
  constructor({ date, users }: IDay) {
    this.date = date;
    this.users = users;
  }
}
export interface ViewOption {
  dayLength: number;
  seeCancel: boolean;
  seeNoshow: boolean;
}

export const TimeTable = () => {
  console.time("TimeTable 시작");
  const [tableLength, setTableLength] = useState<ITableLength>({
    start: { hours: 9, minutes: 0 },
    end: { hours: 19, minutes: 0 },
  });
  const [viewOption, setViewOption] = useState<ViewOption>({
    dayLength: ONE_DAY,
    seeCancel: true,
    seeNoshow: true,
  });
  // const [viewOption, setViewOption] = useState<number>(ONE_DAY);
  const [prevSelectedDate, setPrevSelectedDate] = useState<Date>(
    new Date("1500-01-01")
  );
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date("2022-01-09")
  );
  const [dateNavWeek, setDateNavWeek] = useState<Date[][] | null>();
  const [dateNavMonth, setDateNavMonth] = useState<Date[][] | null>();
  const [dateNavExpand, setDateNavExpand] = useState<boolean>(false);
  const [listView, setListView] = useState<boolean>(false);
  const [oneDayData, setOneDayData] = useState<IDay[]>();
  const [oneWeekData, setOneWeekData] = useState<IDay[]>();

  const handleShrink = () => {
    if (viewOption.dayLength === ONE_WEEK) {
      return true;
    } else if (viewOption.dayLength === ONE_DAY) {
      return false;
    }
  };
  const handleListView = () => {
    setListView((current) => !current);
  };
  const handleExpandDateNav = () => {
    setDateNavExpand((current) => !current);
  };
  const handleViewOption = () => {
    if (viewOption.dayLength === ONE_DAY) {
      setViewOption((state) => ({ ...state, dayLength: ONE_WEEK }));
    }
    if (viewOption.dayLength === ONE_WEEK) {
      setViewOption((state) => ({ ...state, dayLength: ONE_DAY }));
    }
  };

  function getLabels(value: Date) {
    const user = new User({ name: "default", labels: [] });
    const start = new Date(value);
    const end = new Date(start);
    start.setHours(tableLength.start.hours);
    start.setMinutes(tableLength.start.minutes);
    start.setSeconds(0);
    end.setHours(tableLength.end.hours);
    end.setMinutes(tableLength.end.minutes);
    let i = 0;
    while (i !== 150) {
      const date = new Date(start);
      const labelRow = new LabelRow({ labelDate: date, reservations: [] });
      user.labels.push(labelRow);
      const getMinutes = start.getMinutes();
      start.setMinutes(getMinutes + 10);
      i++;
      if (start.valueOf() > end.valueOf()) i = 150;
    }
    return user;
  }

  function getWeeks(value: Date, option?: "sunday") {
    let result: Date[] = [];
    const date = new Date(value);
    const day = date.getDay();
    const sunday = new Date(date.setDate(date.getDate() - day));
    if (option === "sunday") {
      return result.concat(sunday);
    }
    for (let i = 0; i < 7; i++) {
      const aDay = new Date(sunday);
      aDay.setDate(sunday.getDate() + i);
      result.push(aDay);
    }
    return result;
  }
  function getWeeksOfMonth(value: Date) {
    let result = [];
    const firstDate = new Date(value);
    const lastDate = new Date(firstDate);
    firstDate.setDate(1);
    lastDate.setMonth(lastDate.getMonth() + 1);
    lastDate.setDate(0);
    for (let i = 0; i < 5; i++) {
      const date = new Date(firstDate);
      date.setDate(i * 7 + 1);
      const week = getWeeks(date);
      result.push(week);
    }
    return result;
  }

  const makeOneDayFrame = (inputDate: Date): IDay[] => {
    const result: any[] = [];
    const newDay = new Day({
      date: inputDate,
      users: [getLabels(inputDate)],
    });
    result.push(newDay);
    return result;
  };
  const makeOneWeekFrame = (inputDate: Date): IDay[] => {
    const result: any[] = [];
    const weeks = getWeeks(inputDate);
    weeks.forEach((day) => {
      const newDay = new Day({
        date: day,
        users: [getLabels(day)],
      });
      result.push(newDay);
    });
    return result;
  };

  const [queryListReservations, { loading, error, data: queryResult }] =
    useLazyQuery<listReservationsQuery, listReservationsQueryVariables>(
      LIST_RESERVATIONS_QUERY,
      {
        variables: {
          input: {
            date: selectedDate,
            viewOption: viewOption.dayLength,
            groupId: null,
          },
        },
      }
    );

  useEffect(() => {
    setDateNavWeek([getWeeks(selectedDate)]);
    setDateNavMonth(getWeeksOfMonth(selectedDate));
    setOneDayData(makeOneDayFrame(selectedDate));
    setOneWeekData(makeOneWeekFrame(selectedDate));
  }, []);

  useEffect(() => {
    if (compareDateMatch(selectedDate, prevSelectedDate, "ymd") === false) {
      if (viewOption.dayLength === ONE_DAY) {
        setOneDayData(makeOneDayFrame(selectedDate));
      }
      if (viewOption.dayLength === ONE_WEEK) {
        const sameSunday = compareDateMatch(
          getWeeks(selectedDate, "sunday")[0],
          getWeeks(prevSelectedDate, "sunday")[0],
          "ymd"
        );
        if (sameSunday === false) {
          setOneWeekData(makeOneWeekFrame(selectedDate));
        }
      }
      if (selectedDate.getMonth() !== prevSelectedDate.getMonth()) {
        setDateNavMonth(getWeeksOfMonth(selectedDate));
      }
      if (dateNavWeek) {
        // queryDate가 변경됐는데 주가 바뀐다면 isThere가 -1을 반환하고 dateNavWeek를 새로 그린다.
        const index = dateNavWeek[0].findIndex((date) =>
          compareDateMatch(date, selectedDate, "ymd")
        );
        if (index === -1) {
          setDateNavWeek([getWeeks(selectedDate)]);
        }
      }
      queryListReservations();
      setPrevSelectedDate(selectedDate);
    } else {
      if (viewOption.dayLength === ONE_DAY) {
        setOneDayData(makeOneDayFrame(selectedDate));
      }
      if (viewOption.dayLength === ONE_WEEK && oneWeekData) {
        const sameSunday =
          getWeeks(selectedDate, "sunday") ===
          getWeeks(oneWeekData[0].date, "sunday");
        if (!sameSunday) {
          setOneWeekData(makeOneWeekFrame(selectedDate));
          queryListReservations();
        }
      }
    }
  }, [selectedDate, viewOption.dayLength]);

  useEffect(() => {
    if (!loading && queryResult) {
      const { listReservations } = queryResult;
      if (listReservations && listReservations.results) {
        const results = listReservations.results;
        let newData: IDay[];
        if (viewOption.dayLength === ONE_DAY) {
          newData = makeOneDayFrame(selectedDate);
          results.forEach((result) => {
            const startDate = new Date(result.startDate);
            const index = newData.findIndex((data) => {
              return compareDateMatch(data.date, startDate, "ymd");
            });
            if (index >= 0) {
              const labelIdx = newData[index].users[0].labels.findIndex(
                (label) => compareDateMatch(label.labelDate, startDate, "hm")
              );
              newData[index].users[0].labels[labelIdx].reservations.push(
                result
              );
            }
          });
          setOneDayData(newData);
        } else if (viewOption.dayLength === ONE_WEEK) {
          newData = makeOneWeekFrame(selectedDate);
          results.forEach((result) => {
            const startDate = new Date(result.startDate);
            const index = newData.findIndex((data) => {
              return compareDateMatch(data.date, startDate, "ymd");
            });
            if (index >= 0) {
              const labelIdx = newData[index].users[0].labels.findIndex(
                (label) => compareDateMatch(label.labelDate, startDate, "hm")
              );
              newData[index].users[0].labels[labelIdx].reservations.push(
                result
              );
            }
          });
          setOneWeekData(newData);
          //
        }
      }
    }
    // console.timeEnd("이펙트3");
  }, [queryResult]);

  console.timeEnd("TimeTable 시작");
  return (
    <>
      {console.time("렌더시작")}
      <Outlet />
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <div className="container mx-auto h-full">
        <div className="h-full">
          <div className="table-header space-y-2 border-b-2 shadow-sm">
            <div className="mx-2 grid grid-cols-2 items-center justify-between pt-1 lg:grid-cols-6">
              <div className="flex items-center space-x-4">
                <span className="min-w-[120px] text-sm font-medium text-gray-900">
                  {selectedDate.toLocaleString("ko-KR", {
                    year: "2-digit",
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                  })}
                </span>
                <button
                  className="text-sm text-gray-500"
                  onClick={() => setSelectedDate(new Date())}
                >
                  오늘날짜
                </button>
              </div>
              <div className="mx-4 flex items-center lg:col-span-3">
                <MoveXBtn
                  direction={"prev"}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  dateNavExpand={dateNavExpand}
                />
                <div className="w-full">
                  {dateNavWeek?.map((weeks, i) => (
                    <div key={i} className="flex">
                      {weeks.map((week, ii) => (
                        <div
                          key={ii}
                          className={cls(
                            "group flex w-full cursor-pointer bg-white  text-center",
                            selectedDate.getDate() === week.getDate()
                              ? "font-extrabold opacity-100"
                              : "opacity-80"
                          )}
                          onClick={() => setSelectedDate(week)}
                        >
                          <h2
                            className={cls(
                              "shadow-cst mx-1 w-full rounded-md",
                              selectedDate.getDate() === week.getDate()
                                ? "ring-2 ring-violet-400"
                                : "",
                              week.getDay() === 0
                                ? "text-red-600 group-hover:text-red-400"
                                : week.getDay() === 6
                                ? "text-blue-600 group-hover:text-blue-400"
                                : "text-gray-600 group-hover:text-gray-400",
                              selectedDate.getMonth() !== week.getMonth()
                                ? "opacity-40"
                                : ""
                            )}
                          >
                            {week.getDate()}
                          </h2>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <MoveXBtn
                  direction={"after"}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  dateNavExpand={dateNavExpand}
                />
              </div>
              <div className="col-span-2 flex w-full items-center justify-end space-x-5 sm:space-x-8 ">
                <button
                  onClick={handleViewOption}
                  className="flex space-x-1 text-sm hover:text-gray-500"
                >
                  <span>
                    {viewOption.dayLength === ONE_DAY
                      ? "하루 보기"
                      : "1주 보기"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <svg
                  onClick={handleExpandDateNav}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 cursor-pointer hover:text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                </svg>
                <svg
                  onClick={handleListView}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 cursor-pointer hover:text-gray-500"
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
                  className="h-5 w-5 cursor-pointer hover:text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                {/* 이 버튼을 누르면 그룹원들 예약 동시출력 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 cursor-pointer hover:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex space-x-3 text-sm">
              <h3 className="">보기 설정</h3>
              <label>
                취소 보기
                <input
                  type="checkbox"
                  checked={viewOption.seeCancel}
                  onClick={() =>
                    setViewOption((state) => ({
                      ...state,
                      seeCancel: !state.seeCancel,
                    }))
                  }
                />
              </label>
              <label>
                부도 보기
                <input
                  type="checkbox"
                  checked={viewOption.seeNoshow}
                  onClick={() =>
                    setViewOption((state) => ({
                      ...state,
                      seeNoshow: !state.seeNoshow,
                    }))
                  }
                />
              </label>
            </div>
            {dateNavExpand &&
              dateNavMonth && {
                ...(
                  <div className="mx-4 flex items-center justify-between">
                    <MoveXBtn
                      direction={"prev"}
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                      dateNavExpand={dateNavExpand}
                    />
                    <div className="flex w-full flex-col">
                      {dateNavMonth.map((weeks, i) => (
                        <div key={i} className="flex">
                          {weeks.map((week, ii) => (
                            <div
                              onClick={() => setSelectedDate(week)}
                              key={ii}
                              className={cls(
                                "flex w-full cursor-pointer flex-col text-center hover:border-b-gray-500 hover:font-extrabold",
                                compareDateMatch(week, selectedDate, "ymd")
                                  ? "border-b-2 border-sky-400 font-bold"
                                  : "border-b-2 border-transparent"
                              )}
                            >
                              <span
                                className={cls(
                                  "rounded-full",
                                  week.getDay() === 0
                                    ? "text-red-600"
                                    : week.getDay() === 6
                                    ? "text-blue-600"
                                    : "text-gray-600",
                                  selectedDate.getDate() === week.getDate()
                                    ? "opacity-100"
                                    : "opacity-80",
                                  selectedDate.getMonth() !== week.getMonth()
                                    ? "opacity-40"
                                    : ""
                                )}
                              >
                                {week.getDate()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <MoveXBtn
                      direction={"after"}
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                      dateNavExpand={dateNavExpand}
                    />
                  </div>
                ),
              }}
          </div>
          {loading ? (
            <h2 className="table-body flex h-full items-center justify-center">
              Loading...
            </h2>
          ) : (
            <div
              className={cls(
                "table-body  h-full w-full overflow-y-scroll",
                dateNavExpand ? "pb-[19rem]" : "pb-48"
              )}
            >
              {!listView && (
                <>
                  <div
                    className={cls(
                      "in-table-body grid divide-x",
                      viewOption.dayLength === ONE_DAY
                        ? "grid-cols-1"
                        : "grid-cols-[repeat(7,1fr)]"
                    )}
                  >
                    {viewOption.dayLength === ONE_DAY
                      ? oneDayData?.map((day) => {
                          return day.users.map((user) => {
                            return (
                              <div key={user.name}>
                                <div className="">
                                  <div
                                    className={cls(
                                      "group mb-3.5 flex w-full cursor-pointer justify-center bg-white pt-1.5 text-center",
                                      selectedDate.getDate() ===
                                        day.date.getDate()
                                        ? "font-extrabold opacity-100"
                                        : "opacity-80"
                                    )}
                                    onClick={() => setSelectedDate(day.date)}
                                  >
                                    <h2
                                      className={cls(
                                        "mx-1 w-full",
                                        day.date.getDay() === 0
                                          ? "text-red-600 group-hover:text-red-400"
                                          : day.date.getDay() === 6
                                          ? "text-blue-600 group-hover:text-blue-400"
                                          : "text-gray-600 group-hover:text-gray-400",
                                        selectedDate.getMonth() !==
                                          day.date.getMonth()
                                          ? "opacity-40"
                                          : ""
                                      )}
                                    >
                                      {day.date.toLocaleDateString("ko-KR", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </h2>
                                  </div>
                                  {user.labels.map((label, i) => {
                                    return (
                                      <TableRow
                                        key={i}
                                        selected={true}
                                        date={label.labelDate}
                                        labelDate={label.labelDate}
                                        gridRowStart={i + 1}
                                      >
                                        {label.reservations.map(
                                          (reservation, rIdx) => {
                                            return (
                                              <ScheduleBox
                                                id={reservation.id}
                                                key={reservation.id}
                                                hhmm={getHHMM(
                                                  reservation.startDate
                                                )}
                                                memo={reservation.memo}
                                                startDate={
                                                  reservation.startDate
                                                }
                                                endDate={reservation.endDate}
                                                state={reservation.state}
                                                gender={
                                                  reservation.patient.gender
                                                }
                                                patientName={
                                                  reservation.patient.name
                                                }
                                                registrationNumber={
                                                  reservation.patient
                                                    .registrationNumber
                                                }
                                                birthday={
                                                  reservation.patient.birthday
                                                }
                                                viewOption={viewOption}
                                                shrink={handleShrink()}
                                              />
                                            );
                                          }
                                        )}
                                      </TableRow>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          });
                        })
                      : ""}
                    {viewOption.dayLength === ONE_WEEK
                      ? oneWeekData?.map((day, idx) => {
                          return day.users.map((user) => {
                            return (
                              <div key={user.name} className="">
                                <div
                                  className={cls(
                                    "group mb-3.5 flex w-full cursor-pointer justify-center bg-white pt-1.5 text-center",
                                    selectedDate.getDate() ===
                                      day.date.getDate()
                                      ? "font-extrabold opacity-100"
                                      : "opacity-80"
                                  )}
                                  onClick={() => setSelectedDate(day.date)}
                                >
                                  <h2
                                    className={cls(
                                      "mx-1 w-full",
                                      day.date.getDay() === 0
                                        ? "text-red-600 group-hover:text-red-400"
                                        : day.date.getDay() === 6
                                        ? "text-blue-600 group-hover:text-blue-400"
                                        : "text-gray-600 group-hover:text-gray-400",
                                      selectedDate.getMonth() !==
                                        day.date.getMonth()
                                        ? "opacity-40"
                                        : ""
                                    )}
                                  >
                                    {day.date.toLocaleDateString("ko-KR", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </h2>
                                </div>
                                {
                                  <div
                                    className={cls(
                                      "min-w-fit py-1",
                                      selectedDate.getDate() ===
                                        day.date.getDate()
                                        ? "ring-4 ring-inset ring-violet-400"
                                        : ""
                                    )}
                                  >
                                    {user.labels.map((label, i) => (
                                      <TableRow
                                        key={i}
                                        selected={compareDateMatch(
                                          label.labelDate,
                                          selectedDate,
                                          "ymd"
                                        )}
                                        date={day.date}
                                        labelDate={label.labelDate}
                                        gridRowStart={i + 1}
                                        gridColumnStart={idx + 2}
                                        shrink
                                      >
                                        {label.reservations.map(
                                          (reservation, rIdx) => {
                                            return (
                                              <ScheduleBox
                                                key={reservation.id}
                                                id={reservation.id}
                                                hhmm={getHHMM(
                                                  reservation.startDate
                                                )}
                                                memo={reservation.memo}
                                                startDate={
                                                  reservation.startDate
                                                }
                                                endDate={reservation.endDate}
                                                state={reservation.state}
                                                gender={
                                                  reservation.patient.gender
                                                }
                                                patientName={
                                                  reservation.patient.name
                                                }
                                                registrationNumber={
                                                  reservation.patient
                                                    .registrationNumber
                                                }
                                                birthday={
                                                  reservation.patient.birthday
                                                }
                                                viewOption={viewOption}
                                                shrink={handleShrink()}
                                              />
                                            );
                                          }
                                        )}
                                      </TableRow>
                                    ))}
                                  </div>
                                }
                              </div>
                            );
                          });
                        })
                      : ""}
                  </div>
                </>
              )}
              {listView && (
                <div className="pt-1">
                  <div className="mx-auto mt-3 mb-4 w-fit cursor-pointer rounded-full border border-dashed border-gray-500 p-1 shadow hover:bg-zinc-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {queryResult?.listReservations.results?.map((reservation) => {
                    const time =
                      getTimeLength(
                        reservation.startDate,
                        reservation.endDate
                      ) / 10;
                    return (
                      <ScheduleListBox
                        key={reservation.id}
                        memo={reservation.memo}
                        startDate={getHHMM(reservation.startDate, ":")}
                        endDate={getHHMM(reservation.endDate, ":")}
                      >
                        <NameTag
                          id={reservation.id}
                          gender={reservation.patient.gender}
                          name={reservation.patient.name}
                          registrationNumber={
                            reservation.patient.registrationNumber
                          }
                          birthday={reservation.patient.birthday}
                        />
                      </ScheduleListBox>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        {/* <div>중간화면</div> */}
      </div>
      {/* <div className="text-medium fixed inset-x-0 bottom-0 z-50 flex h-10 items-center justify-between border-t bg-white px-2">
        <div>오늘</div>
        <div>캘린더</div>
        <div>초대</div>
      </div> */}
      {console.timeEnd("렌더시작")}
    </>
  );
};
