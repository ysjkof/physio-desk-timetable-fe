import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { FieldError, UseFormSetValue } from "react-hook-form";
import { compareDateMatch } from "../../libs/timetable-utils";
import { BirthdayInput } from "./create-patient-form";
import { ModalPortal } from "./modal-portal";

export interface DatepickerForm {
  startDateYear?: number;
  startDateMonth?: number;
  startDateDate?: number;
  startDateHours?: number;
  startDateMinutes?: number;
  endDateYear?: number;
  endDateMonth?: number;
  endDateDate?: number;
  endDateHours?: number;
  endDateMinutes?: number;
}

type AddFieldError<T> = {
  [P in keyof T]?: FieldError;
};
export interface IForm extends DatepickerForm, BirthdayInput {}
export interface IFormErrors extends AddFieldError<IForm> {}

interface IDatePicker {
  setValue: UseFormSetValue<IForm>;
  defaultDate: Date;
  see: "ymd-hm" | "ymd";
  prefix: "startDate" | "endDate" | "birthday";
  openState: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export const Datepicker = ({
  setValue,
  defaultDate,
  see,
  prefix,
  openState: { open, setOpen },
}: IDatePicker) => {
  // const [open, setOpen] = useState(false);
  const [prevDate, setPrevDate] = useState(defaultDate);
  const [nextDate, setNextDate] = useState(defaultDate);
  const [dateOfMonth, setDateOfMonth] = useState(getWeeksOfMonth(defaultDate));
  const [minutesUnit, setMinutesUnit] = useState(10); // 선택 가능한 분의 최소 단위. 10일 경우 10, 20, 30, 40, 50 분만 선택 가능
  const [selectedHour, setSelectedHour] = useState(defaultDate.getHours());
  const [selectedMinutes, setSelectedMinutes] = useState(
    defaultDate.getMinutes()
  );
  const [tableLength, setTableLength] = useState({
    start: { hours: 9, minutes: 0 },
    end: { hours: 19, minutes: 0 },
  });

  const modalGap = 2;
  const ref = useRef<HTMLDivElement>(null);
  const height = ref.current?.getBoundingClientRect().height;
  const top = ref.current?.getBoundingClientRect().top! + height! + modalGap;
  const left = ref.current?.getBoundingClientRect().left;

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
    if (prefix !== "birthday") {
      nextDate.setHours(selectedHour);
      setValue(`${prefix}Hours`, selectedHour);
    }
  }, [selectedHour]);
  useEffect(() => {
    if (prefix !== "birthday") {
      nextDate.setMinutes(selectedMinutes);
      setValue(`${prefix}Minutes`, selectedMinutes);
    }
  }, [selectedMinutes]);

  return (
    <div className="datepicker-icon relative">
      <div
        onClick={() => setOpen((current) => !current)}
        className="cursor-pointer"
        ref={ref}
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
        <ModalPortal
          left={left}
          top={top}
          closeAction={setOpen}
          children={
            <div className="absolute bottom-0 z-50 w-[440px]">
              <div className="absolute flex w-full flex-col rounded-md border bg-white p-3">
                <div className="datepicker-navigation mb-1 flex justify-between border-b pb-2">
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
                    <span
                      className="cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      닫기
                    </span>
                  </div>
                </div>
                <div className="datepicker-calendar flex divide-x">
                  <div className="datepicker-calendar-col left grid w-full grid-cols-7 pr-1.5 text-center">
                    {["일", "월", "화", "수", "목", "금", "토"].map(
                      (day, i) => (
                        <div key={i}>{day}</div>
                      )
                    )}
                    {dateOfMonth.map((day) => (
                      <span
                        key={day.valueOf()}
                        className={`cursor-pointer px-1.5 py-1 ${
                          day.getMonth() !== dateOfMonth[15].getMonth()
                            ? "opacity-50"
                            : ""
                        } ${
                          day.getDay() === 0
                            ? "sunday"
                            : day.getDay() === 6
                            ? "saturday"
                            : ""
                        } ${
                          compareDateMatch(day, nextDate, "ymd")
                            ? "rounded-md bg-red-400 text-white"
                            : ""
                        } ${
                          compareDateMatch(day, defaultDate, "ymd")
                            ? "rounded-md border border-transparent ring-2 ring-red-500"
                            : ""
                        }`}
                        data-date={day}
                        onClick={async (e) => {
                          await setNextDate(
                            // @ts-ignore
                            new Date(e.currentTarget.dataset.date)
                          );
                          if (see === "ymd") setOpen(false);
                        }}
                      >
                        {day.getDate()}
                      </span>
                    ))}
                  </div>
                  {see === "ymd-hm" && (
                    <div className="datepicker-calendar-col-time-picker flex h-32 space-x-2 pl-2 text-center">
                      <div className="hours-picker hidden-scrollbar flex flex-col overflow-y-scroll">
                        <span>시</span>
                        {listOfHours.map((hours, i) => (
                          <span
                            key={i}
                            className={`cursor-pointer px-1.5 ${
                              selectedHour === hours
                                ? "rounded-md bg-blue-500 text-white"
                                : ""
                            }`}
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
                            className={`cursor-pointer px-1.5 ${
                              +selectedMinutes === minutes
                                ? "rounded-md bg-blue-500 text-white"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedMinutes(minutes);
                            }}
                          >
                            {String(minutes).padStart(2, "0")}
                          </span>
                        ))}
                      </div>
                      {/* <div className="flex flex-col whitespace-nowrap">
                        <span className="">오전</span>
                        <span className="">오후</span>
                      </div> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};
