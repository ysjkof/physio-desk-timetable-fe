import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import { NameTag } from "../components/name-tag";
import { ScheduleBox } from "../components/schedule-box";
import { ScheduleListBox } from "../components/schedule-list-box";
import { TableRow } from "../components/table-row";
import { cls, getHHMM, getTimeLength } from "../libs/utils";
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

export const TimeTable = () => {
  const [tableLength, setTableLength] = useState<ITableLength>({
    start: { hours: 9, minutes: 0 },
    end: { hours: 19, minutes: 0 },
  });
  const [viewOption, setViewOption] = useState<number>(ONE_DAY);
  const [queryDate, setQueryDate] = useState<Date>(new Date("2022-01-09"));
  const [dateNav, setDateNav] = useState<Date[][] | null>();
  const [dateNavExpand, setDateNavExpand] = useState<boolean>(false);
  const [listView, setListView] = useState<boolean>(false);
  const [week, setWeek] = useState(getWeeks(queryDate));
  const [organizedData, setOrganizedData] = useState<IDay[]>();

  const handleShrink = () => {
    if (viewOption === ONE_WEEK) {
      return true;
    } else if (viewOption === ONE_DAY) {
      return false;
    }
  };
  const handleListView = () => {
    setListView((current) => !current);
  };
  const handleExpandDateNav = () => {
    setDateNavExpand((current) => !current);
  };
  const handleDateNavMove = (direction: "prev" | "after") => {
    const date = new Date(queryDate);
    if (dateNavExpand === false) {
      if (direction === "prev") date.setDate(date.getDate() - 7);
      if (direction === "after") date.setDate(date.getDate() + 7);
    } else if (dateNavExpand === true) {
      if (direction === "prev") date.setMonth(date.getMonth() - 1);
      if (direction === "after") date.setMonth(date.getMonth() + 1);
    }
    setQueryDate(date);
  };
  const handleViewOption = () => {
    if (viewOption === ONE_DAY) {
      setViewOption(ONE_WEEK);
      console.log("Change View Option: to 7");
    }
    if (viewOption === ONE_WEEK) {
      setViewOption(ONE_DAY);
      console.log("Change View Option: to 1");
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
      // labels.labels.push({ labelDate:date,reservations:[] });
      const labelRow = new LabelRow({ labelDate: date, reservations: [] });
      user.labels.push(labelRow);
      const getMinutes = start.getMinutes();
      start.setMinutes(getMinutes + 10);
      i++;
      if (start.valueOf() > end.valueOf()) i = 150;
    }
    return user;
  }

  function getWeeks(value: Date) {
    let result: Date[] = [];
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

  // 데이터 받아서 organizedDate에 넣는 거 구현해야됨.
  useEffect(() => {
    queryListReservations();
    if (dateNavExpand) {
      setDateNav(getWeeksOfMonth(queryDate));
    } else if (!dateNavExpand) {
      setDateNav([getWeeks(queryDate)]);
    }
    console.log("쿼리날짜, 날짜안내기 갱신");
    setWeek(getWeeks(queryDate));
  }, [queryDate, dateNavExpand]);

  useEffect(() => {
    const newResults = [];
    if (viewOption === ONE_WEEK) {
      const weeks = getWeeks(queryDate);
      weeks.forEach((day) => {
        const newDay = new Day({
          date: day,
          users: [getLabels(day)],
        });
        newResults.push(newDay);
      });
    } else if (viewOption === ONE_DAY) {
      const newDay = new Day({
        date: queryDate,
        users: [getLabels(queryDate)],
      });
      newResults.push(newDay);
    }
    setOrganizedData(newResults);
    console.log("뷰옵선 갱신");
  }, [viewOption, queryDate]);

  useEffect(() => {
    if (queryResult) {
      const {
        listReservations: { results },
      } = queryResult;
      console.log("쿼리리설트 갱신", results);

      const newOrganizedData = organizedData?.map((day): IDay => {
        return {
          date: day.date,
          users: [
            ...day.users.map((user): IUser => {
              return {
                name: user.name,
                labels: [
                  ...user.labels.map((label): ILabelRow => {
                    const matchResult = results?.filter(
                      (result) =>
                        new Date(result.startDate).getTime() ===
                        label.labelDate.getTime()
                    );
                    if (matchResult) {
                      return {
                        labelDate: new Date(label.labelDate),
                        reservations: matchResult,
                      };
                    } else {
                      return {
                        labelDate: new Date(label.labelDate),
                        reservations: [],
                      };
                    }
                  }),
                ],
              };
            }),
          ],
        };
      });
      setOrganizedData(newOrganizedData);
    }
  }, [queryResult]);

  // console.log("⚠️ : 정리된 자료", organizedData);

  return (
    <>
      <Outlet />
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <div className="h-full container mx-auto">
        <div className="h-full">
          <div className="table-header space-y-2 border-b">
            <div className="mx-6 flex items-center justify-between">
              <div className="flex w-full items-center">
                <span className="text-sm text-gray-900 font-medium">
                  {/* <span className="text-sm text-gray-500"> */}
                  {queryDate.toLocaleString("ko-KR", {
                    year: "2-digit",
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                  })}
                </span>
              </div>
              <div className="flex w-full justify-end space-x-8 items-center pt-1">
                <button
                  onClick={handleViewOption}
                  className="hover:text-gray-500 text-sm w-20 space-x-1 flex"
                >
                  <span>
                    {viewOption === ONE_DAY ? "1주 보기" : "하루 보기"}
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
            <div className="flex items-center justify-between mx-4">
              <div
                className="cursor-pointer hover:text-gray-500"
                onClick={() => handleDateNavMove("prev")}
              >
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
              <div className="flex flex-col w-full">
                {!dateNavExpand && dateNav && (
                  <div className="flex">
                    {dateNav[0].map((week, i) => (
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
                              ? "text-red-600"
                              : week.getDay() === 6
                              ? "text-blue-600"
                              : "text-gray-600",
                            queryDate.getDate() === week.getDate()
                              ? "opacity-100"
                              : "opacity-80",
                            queryDate.getMonth() !== week.getMonth()
                              ? "opacity-40"
                              : ""
                          )}
                        >
                          {week.getDate()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {dateNavExpand &&
                  dateNav &&
                  dateNav.map((weeks, i) => (
                    <div key={i} className="flex">
                      {weeks.map((week, ii) => (
                        <div
                          onClick={() => setQueryDate(week)}
                          key={ii}
                          className={cls(
                            "flex w-full cursor-pointer flex-col text-center hover:border-b-gray-500 hover:font-extrabold",
                            queryDate.getDate() === week.getDate() &&
                              queryDate.getMonth() === week.getMonth()
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
                              queryDate.getDate() === week.getDate()
                                ? "opacity-100"
                                : "opacity-80",
                              queryDate.getMonth() !== week.getMonth()
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
              <div
                className="cursor-pointer hover:text-gray-500"
                onClick={() => handleDateNavMove("after")}
              >
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
          </div>
          <div
            className={cls(
              "table-body relative overflow-y-scroll bg-zinc-50 h-full",
              dateNavExpand ? "pb-[19rem]" : "pb-48"
            )}
          >
            {!listView && (
              <div
                className={cls(
                  "main grid pt-2",
                  viewOption === ONE_DAY
                    ? "grid-cols-[3rem,1fr]"
                    : "grid-cols-[3rem,repeat(7,1fr)]"
                )}
              >
                {organizedData &&
                  organizedData.map((day) => {
                    return day.users.map((user) => {
                      return user.labels.map((label, i) => (
                        <TableRow
                          key={i}
                          label={true}
                          date={label.labelDate}
                          labelDate={label.labelDate}
                          gridRowStart={i + 1}
                        />
                      ));
                    });
                  })}
                {viewOption === ONE_DAY &&
                  organizedData &&
                  organizedData.map((day) => {
                    return day.users.map((user) => {
                      return user.labels.map((label, i) => {
                        return (
                          <TableRow
                            key={i}
                            label={false}
                            date={label.labelDate}
                            labelDate={label.labelDate}
                            gridRowStart={i + 1}
                          >
                            {label.reservations.map((reservation, rIdx) => {
                              return (
                                <ScheduleBox
                                  key={reservation.id}
                                  hhmm={getHHMM(reservation.startDate)}
                                  memo={reservation.memo}
                                  startDate={getHHMM(
                                    reservation.startDate,
                                    ":"
                                  )}
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
                                    shrink={handleShrink()}
                                  />
                                </ScheduleBox>
                              );
                            })}
                          </TableRow>
                        );
                      });
                    });
                  })}
                {viewOption === ONE_WEEK &&
                  organizedData &&
                  organizedData.map((day, idx) => {
                    return day.users.map((user) => {
                      return user.labels.map((label, i) => (
                        <TableRow
                          key={i}
                          label={false}
                          date={day.date}
                          labelDate={label.labelDate}
                          gridRowStart={i + 1}
                          gridColumnStart={idx + 2}
                        >
                          {label.reservations.map((reservation, rIdx) => {
                            return (
                              <ScheduleBox
                                key={reservation.id}
                                hhmm={getHHMM(reservation.startDate)}
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
                                  shrink={handleShrink()}
                                />
                              </ScheduleBox>
                            );
                          })}
                        </TableRow>
                      ));
                    });
                  })}
                {/* {organizedData &&
                  queryResult?.listReservations.results?.map((reservation) => {
                    const hhmm = getHHMM(reservation.startDate);
                    const index = organizedData.findIndex(
                      (label) => getHHMM(label.date) === hhmm
                    );
                    const time =
                      getTimeLength(
                        reservation.startDate,
                        reservation.endDate
                      ) / 10;
                    return (
                      <ScheduleBox
                        key={reservation.id}
                        gridRowStart={index + 1}
                        gridRowEnd={index + 1 + time}
                        hhmm={getHHMM(reservation.startDate)}
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
                      </ScheduleBox>
                    );
                  })} */}
              </div>
            )}
            {listView && (
              <div className="pt-1">
                <div className="mx-auto w-fit rounded-full mt-3 mb-4 border p-1 border-dashed border-gray-500 cursor-pointer hover:bg-zinc-200 shadow">
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
                    getTimeLength(reservation.startDate, reservation.endDate) /
                    10;
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
        </div>
        {/* <div>중간화면</div> */}
      </div>
      {/* <div className="text-medium fixed inset-x-0 bottom-0 z-50 flex h-10 items-center justify-between border-t bg-white px-2">
        <div>오늘</div>
        <div>캘린더</div>
        <div>초대</div>
      </div> */}
    </>
  );
};
