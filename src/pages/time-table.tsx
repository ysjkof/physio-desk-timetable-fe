import { makeVar, useReactiveVar } from "@apollo/client";
import {
  faCalendarAlt,
  faList,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import { BtnArrow } from "../components/button-arrow";
import { BtnDatecheck } from "../components/button-datecheck";
import { MoveXBtn } from "../components/move-x-btn";
import { NameTag } from "../components/name-tag";
import { ScheduleBox } from "../components/schedule-box";
import { ScheduleListBox } from "../components/schedule-list-box";
import { Switch } from "../components/switch";
import { TableRow } from "../components/table-row";
import {
  ReservationState,
  useListReservationsLazyQuery,
} from "../graphql/generated/graphql";
import { cls, compareDateMatch, getHHMM } from "../libs/utils";
import { listReservationRefetchVar } from "../store";

interface ITableLength {
  start: { hours: number; minutes: number };
  end: { hours: number; minutes: number };
}

const ONE_DAY = 1;
const ONE_WEEK = 7;
// const TWO_WEEKS = 14;
// const THREE_WEEKS = 21;

interface ILabelRow {
  labelDate: Date;
  reservations: {
    __typename?: "Reservation";
    id: number;
    startDate: any;
    endDate: any;
    state: ReservationState;
    memo?: string | null;
    patient: {
      __typename?: "Patient";
      name: string;
      gender: string;
      registrationNumber?: string | null;
      birthday?: any | null;
    };
    lastModifier: {
      __typename?: "User";
      email: string;
    };
  }[];
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
  const [tableLength, setTableLength] = useState<ITableLength>({
    start: { hours: 9, minutes: 0 },
    end: { hours: 19, minutes: 0 },
  });
  const [viewOption, setViewOption] = useState<ViewOption>({
    dayLength: ONE_DAY,
    seeCancel: true,
    seeNoshow: true,
  });
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

  const handleDateNavMovePrev = () => {
    const date = new Date(selectedDate);
    !dateNavExpand
      ? date.setDate(date.getDate() - 7)
      : date.setMonth(date.getMonth() - 1);
    setSelectedDate(date);
  };
  const handleDateNavMoveNext = () => {
    const date = new Date(selectedDate);
    !dateNavExpand
      ? date.setDate(date.getDate() + 7)
      : date.setMonth(date.getMonth() + 1);
    setSelectedDate(date);
  };

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
    const labels = [];
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
      labels.push(labelRow);
      const getMinutes = start.getMinutes();
      start.setMinutes(getMinutes + 10);
      i++;
      if (start.valueOf() > end.valueOf()) i = 150;
    }
    return labels;
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
      users: [new User({ name: "default", labels: getLabels(inputDate) })],
      // users: [getLabels(inputDate)],
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
        users: [new User({ name: "default", labels: getLabels(day) })],
        // users: [getLabels(day)],
      });
      result.push(newDay);
    });
    return result;
  };

  const [queryListReservations, { loading, data: queryResult, refetch }] =
    useListReservationsLazyQuery();
  listReservationRefetchVar(refetch);

  useEffect(() => {
    setDateNavWeek([getWeeks(selectedDate)]);
    setDateNavMonth(getWeeksOfMonth(selectedDate));
    setOneDayData(makeOneDayFrame(selectedDate));
    setOneWeekData(makeOneWeekFrame(selectedDate));
  }, []);

  let queryDate: Date;
  useEffect(() => {
    if (!compareDateMatch(selectedDate, prevSelectedDate, "ymd")) {
      if (viewOption.dayLength === ONE_DAY) {
        setOneDayData(makeOneDayFrame(selectedDate));
        queryDate = selectedDate;
      }
      if (viewOption.dayLength === ONE_WEEK) {
        const sameSunday = compareDateMatch(
          getWeeks(selectedDate, "sunday")[0],
          getWeeks(prevSelectedDate, "sunday")[0],
          "ymd"
        );
        if (!sameSunday) {
          setOneWeekData(makeOneWeekFrame(selectedDate));
        }
        queryDate = getWeeks(selectedDate, "sunday")[0];
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

      queryListReservations({
        variables: {
          input: {
            date: queryDate,
            viewOption: viewOption.dayLength,
            groupId: null,
          },
        },
      });
      setPrevSelectedDate(selectedDate);
    } else {
      queryDate = selectedDate;
      if (viewOption.dayLength === ONE_DAY) {
        setOneDayData(makeOneDayFrame(selectedDate));
        queryListReservations({
          variables: {
            input: {
              date: queryDate,
              viewOption: viewOption.dayLength,
              groupId: null,
            },
          },
        });
      }
      if (viewOption.dayLength === ONE_WEEK && oneWeekData) {
        const sameSunday = compareDateMatch(
          getWeeks(selectedDate, "sunday")[0],
          getWeeks(oneWeekData[0].date, "sunday")[0],
          "ymd"
        );
        if (!sameSunday) {
          setOneWeekData(makeOneWeekFrame(selectedDate));
        }
        queryListReservations({
          variables: {
            input: {
              date: queryDate,
              viewOption: viewOption.dayLength,
              groupId: null,
            },
          },
        });
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
  }, [queryResult]);

  return (
    <>
      <Outlet />
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <div className="container mx-auto h-full">
        <div className="h-full">
          <div className="table-header mb-3 px-2 pb-4 shadow-b">
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-7">
              <div className="flex lg:col-span-1">
                <button
                  className="min-w-[120px] text-sm font-medium text-gray-700 hover:font-bold"
                  onClick={() => setSelectedDate(new Date())}
                >
                  {selectedDate.toLocaleString("ko-KR", {
                    year: "2-digit",
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                  })}
                </button>
              </div>
              <div className="col-span-2 flex w-full items-center justify-between gap-1 lg:col-span-5">
                <BtnArrow direction="prev" onClick={handleDateNavMovePrev} />
                {dateNavWeek?.map((weeks, i) => (
                  <>
                    {weeks.map((week, ii) => (
                      <BtnDatecheck
                        key={ii}
                        text={week.getDate() + ""}
                        day={week.getDay()}
                        thisMonth={selectedDate.getMonth() === week.getMonth()}
                        selected={selectedDate.getDate() === week.getDate()}
                        onClick={() => setSelectedDate(week)}
                      />
                    ))}
                  </>
                ))}
                <BtnArrow direction="after" onClick={handleDateNavMoveNext} />
              </div>
              <div className="flex w-full items-center justify-end space-x-5 lg:col-span-1">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  onClick={handleExpandDateNav}
                  className={cls(
                    dateNavExpand ? "text-gray-700" : "text-gray-400",
                    "w-4 cursor-pointer  hover:text-gray-500"
                  )}
                />
                <FontAwesomeIcon
                  icon={faList}
                  onClick={handleListView}
                  className={cls(
                    listView ? "text-gray-700" : "text-gray-400",
                    "w-4 cursor-pointer  hover:text-gray-500"
                  )}
                />
                {/* 이 버튼을 누르면 그룹원들 예약 동시출력 */}
                <FontAwesomeIcon
                  icon={faUserGroup}
                  className="w-4 cursor-pointer text-gray-400 hover:text-gray-500"
                />
              </div>
              <div className="col-span-2 row-start-2 flex space-x-3">
                <Switch
                  enabled={viewOption.seeCancel}
                  label={"취소표시"}
                  onClick={() =>
                    setViewOption((state) => ({
                      ...state,
                      seeCancel: !state.seeCancel,
                    }))
                  }
                />
                <Switch
                  enabled={viewOption.seeNoshow}
                  label={"부도표시"}
                  onClick={() =>
                    setViewOption((state) => ({
                      ...state,
                      seeNoshow: !state.seeNoshow,
                    }))
                  }
                />
                <Switch
                  enabled={viewOption.dayLength === ONE_DAY ? false : true}
                  label={"1주표시"}
                  onClick={handleViewOption}
                />
              </div>
            </div>
            {dateNavExpand &&
              dateNavMonth && {
                ...(
                  <div className="mx-4 mt-4 flex items-center justify-between">
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
                    // const time =
                    //   getTimeLength(
                    //     reservation.startDate,
                    //     reservation.endDate
                    //   ) / 10;
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
    </>
  );
};
