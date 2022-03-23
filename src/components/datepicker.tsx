import React, { useEffect, useState } from "react";
import { cls } from "../libs/utils";

export const Datepicker: React.FC = () => {
  const nowDate = new Date();
  const [prevDate, setPrevDate] = useState(nowDate);
  const [nextDate, setNextDate] = useState(nowDate);
  const [dateOfMonth, setDateOfMonth] = useState(getWeeksOfMonth(nowDate));

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

  useEffect(() => {
    console.log(1);
    if (nextDate.getMonth() !== prevDate.getMonth()) {
      console.log(2);
      setPrevDate(nextDate);
      setDateOfMonth(getWeeksOfMonth(nextDate));
    }
  }, [nextDate]);

  return (
    <>
      <div className="relative text-xs text-gray-600">
        <div className="absolute top-10 flex flex-col rounded-md border p-3">
          <div className="navigation mb-2 flex justify-between">
            <div>{`${dateOfMonth[2][0].getFullYear()}년 ${
              dateOfMonth[2][0].getMonth() + 1
            }월`}</div>
            <div className="space-x-6">
              <button
                onClick={() => {
                  const date = new Date(prevDate);
                  date.setMonth(date.getMonth() - 1);
                  setPrevDate(date);
                  setDateOfMonth(getWeeksOfMonth(date));
                }}
              >
                위
              </button>
              <button
                onClick={() => {
                  const date = new Date(prevDate);
                  date.setMonth(date.getMonth() + 1);
                  setPrevDate(date);
                  setDateOfMonth(getWeeksOfMonth(date));
                }}
              >
                아래
              </button>
            </div>
          </div>
          <div className="datepicker grid grid-cols-7 text-center">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div>{day}</div>
            ))}
            {dateOfMonth.map((week) =>
              week.map((day) => (
                <div
                  className={cls(
                    "px-1.5 py-1",
                    day.getMonth() !== dateOfMonth[2][0].getMonth()
                      ? "opacity-40"
                      : "",
                    day.getDay() === 0 ? "text-red-500" : "",
                    day.getDay() === 6 ? "text-blue-500" : "",
                    day.getDate() === nextDate.getDate() &&
                      day.getMonth() === nextDate.getMonth()
                      ? "rounded-md bg-red-400 text-white"
                      : "",
                    day.getDate() === nowDate.getDate() &&
                      day.getMonth() === nowDate.getMonth()
                      ? "rounded-md border border-transparent ring-2 ring-red-500"
                      : ""
                  )}
                  data-date={day}
                  onClick={(e) =>
                    // @ts-ignore
                    setNextDate(new Date(e.currentTarget.dataset.date))
                  }
                >
                  {day.getDate()}
                </div>
              ))
            )}
          </div>
          <div className="timepicker"></div>
        </div>
      </div>
    </>
  );
};
