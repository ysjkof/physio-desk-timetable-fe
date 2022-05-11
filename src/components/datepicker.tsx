import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { cls } from "../libs/utils";

export interface DatepickerForm {
  startDateYear: number;
  startDateMonth: number;
  startDateDate: number;
  startDateHours: number;
  startDateMinutes: number;
  endDateYear: number;
  endDateMonth: number;
  endDateDate: number;
  endDateHours: number;
  endDateMinutes: number;
}

interface IDatePicker {
  setValue: UseFormSetValue<DatepickerForm>;
  defaultDate: Date;
  see: "ymd-hm" | "ymd";
  prefix: "startDate" | "endDate";
}

export const Datepicker = ({
  setValue,
  defaultDate,
  see,
  prefix,
}: IDatePicker) => {
  const [open, setOpen] = useState(false);
  const [prevDate, setPrevDate] = useState(defaultDate);
  const [nextDate, setNextDate] = useState(defaultDate);
  const [dateOfMonth, setDateOfMonth] = useState(getWeeksOfMonth(defaultDate));
  const [minutesUnit, setMinutesUnit] = useState(10); // 선택 가능한 분의 최소 단위. 10일 경우 10, 20, 30, 40, 50 분만 선택 가능
  const [selectedHour, setSelectedHour] = useState(defaultDate.getHours());
  const [selectedMinutes, setSelectedMinutes] = useState(
    Number(defaultDate.getMinutes().toString().substring(0, 1) + "0")
  );
  const [tableLength, setTableLength] = useState({
    start: { hours: 9, minutes: 0 },
    end: { hours: 19, minutes: 0 },
  });

  function getHours(start: number, end: number) {
    const hours = [];
    let i = start;
    while (i < end) {
      hours.push(i);
      i++;
    }
    return hours;
  }
  const listOfHours = getHours(tableLength.start.hours, tableLength.end.hours);

  function getMinutes(minutesUnit: number) {
    const minutes = [];
    let i = 0;
    while (i < 60) {
      minutes.push(i);
      i = i + minutesUnit;
    }
    return minutes;
  }
  const listOfMinutes = getMinutes(minutesUnit);

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
      result.push(...week);
    }
    return result;
  }

  useEffect(() => {
    if (nextDate.getMonth() !== prevDate.getMonth()) {
      setPrevDate(nextDate);
      setDateOfMonth(getWeeksOfMonth(nextDate));
    }
    setValue(`${prefix}Year`, nextDate.getFullYear());
    setValue(`${prefix}Month`, nextDate.getMonth() + 1);
    setValue(`${prefix}Date`, nextDate.getDate());
  }, [nextDate]);

  useEffect(() => {
    nextDate.setHours(selectedHour);
    setValue(`${prefix}Hours`, selectedHour);
  }, [selectedHour]);
  useEffect(() => {
    nextDate.setMinutes(selectedMinutes);
    setValue(`${prefix}Minutes`, selectedMinutes);
  }, [selectedMinutes]);

  return (
    <div className="relative">
      <div
        onClick={() => setOpen((current) => !current)}
        className={cls(
          "cursor-pointer",
          open
            ? "text-gray-700  hover:text-gray-500"
            : "text-gray-500 hover:text-gray-700"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      {open && (
        <div className="absolute bottom-0 z-50 w-[440px] text-xs text-gray-600 shadow-cst">
          <div className="absolute flex w-full flex-col rounded-md border bg-white p-3">
            <div className="navigation mb-1 flex justify-between border-b pb-2">
              <div>{`${dateOfMonth[15].getFullYear()}년 ${
                dateOfMonth[15].getMonth() + 1
              }월`}</div>
              <div className="space-x-6">
                <span
                  onClick={() => {
                    const date = new Date(prevDate);
                    date.setMonth(date.getMonth() - 1);
                    setPrevDate(date);
                    setDateOfMonth(getWeeksOfMonth(date));
                  }}
                  className="cursor-pointer"
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </span>
                <span
                  onClick={() => {
                    const date = new Date(prevDate);
                    date.setMonth(date.getMonth() + 1);
                    setPrevDate(date);
                    setDateOfMonth(getWeeksOfMonth(date));
                  }}
                  className="cursor-pointer"
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </span>
                <span
                  className="cursor-pointer"
                  onClick={() => setNextDate(new Date())}
                >
                  오늘
                </span>
                <span className="cursor-pointer" onClick={() => setOpen(false)}>
                  닫기
                </span>
              </div>
            </div>
            <div className="datepicker flex divide-x">
              <div className="datepicker-col left grid w-full grid-cols-7 pr-1.5 text-center">
                {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
                  <div key={i}>{day}</div>
                ))}
                {dateOfMonth.map((day) => (
                  <span
                    key={day.valueOf()}
                    className={cls(
                      "cursor-pointer px-1.5 py-1",
                      day.getMonth() !== dateOfMonth[15].getMonth()
                        ? "opacity-40"
                        : "",
                      day.getDay() === 0 ? "text-red-500" : "",
                      day.getDay() === 6 ? "text-blue-500" : "",
                      day.getDate() === nextDate.getDate() &&
                        day.getMonth() === nextDate.getMonth()
                        ? "rounded-md bg-red-400 text-white"
                        : "",
                      day.getDate() === defaultDate.getDate() &&
                        day.getMonth() === defaultDate.getMonth()
                        ? "rounded-md border border-transparent ring-2 ring-red-500"
                        : ""
                    )}
                    data-date={day}
                    onClick={(e) => {
                      // @ts-ignore
                      setNextDate(new Date(e.currentTarget.dataset.date));
                      if (see === "ymd") setOpen(false);
                    }}
                  >
                    {day.getDate()}
                  </span>
                ))}
              </div>
              {see === "ymd-hm" && (
                <div className="datepicker-col right pl-2">
                  <div className="timepicker flex h-32 space-x-2 text-center">
                    <div className="hours-picker hidden-scrollbar flex flex-col overflow-y-scroll">
                      <span>시</span>
                      {listOfHours.map((hours, i) => (
                        <span
                          key={i}
                          className={cls(
                            "cursor-pointer px-1.5 text-base",
                            selectedHour === hours
                              ? "rounded-md bg-blue-500 text-white"
                              : ""
                          )}
                          onClick={() => setSelectedHour(hours)}
                        >
                          {String(hours).padStart(2, "0")}
                        </span>
                      ))}
                    </div>
                    <div className="minutes-picker hidden-scrollbar flex flex-col overflow-y-scroll">
                      <span>분</span>
                      {listOfMinutes.map((minutes, i) => (
                        <span
                          key={i}
                          className={cls(
                            "cursor-pointer px-1.5 text-base",
                            +selectedMinutes === minutes
                              ? "rounded-md bg-blue-500 text-white"
                              : ""
                          )}
                          onClick={() => {
                            setSelectedMinutes(minutes);
                          }}
                        >
                          {String(minutes).padStart(2, "0")}
                        </span>
                      ))}
                    </div>
                    {/* <div className="flex flex-col whitespace-nowrap">
                    <span className="text-sm">오전</span>
                    <span className="text-sm">오후</span>
                  </div> */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
