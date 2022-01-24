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

interface ILabel {
  label: string;
}

export interface IDays {
  date: Date;
  reservations: any[];
}

export class Day {
  date: Date;
  reservations: any[];
  constructor(date: Date, reservations: any[]) {
    this.date = date;
    this.reservations = reservations;
  }
}

export const TimeTable = () => {
  // 시간표에 출력할 시간 설정
  const [tableStartAndEndTime, setTableStartAndEndTime] = useState([
    "0900",
    "1900",
  ]);
  // 칸을 그리기 위한 배열. 10분 단위로 모든 칸을 그림
  const labels: ILabel[] = [];
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

  // 아래 for는 tableStartAndEndTime에 따른 ReservationsContainer를 만든다.
  // 수의 증가를 위해 tableStartAndEndTime을 숫자로 바꿈
  for (
    let i = parseInt(tableStartAndEndTime[0]);
    i <= parseInt(tableStartAndEndTime[1]);
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
      labels.push({
        label: hhmm,
      });

    if (labels.length > 200) {
      break;
    }
  }

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
        days.push(new Day(queryDate, []));
        days[ONE_DAY - 1].reservations = reservations;
      }
      if (viewOption === ONE_WEEK && reservations) {
        console.log("⚠️ :ONE_DAY TRUE");
        days = getWeeksDate(queryDate);
        for (const day of days) {
          day.reservations = reservations.filter(
            (reservation) =>
              reservation.startDate.substring(0, 11) ===
              day.date.toISOString().substring(0, 11)
          );
        }
      }
      setSchedules(days);
      // console.log("⚠️ : END FOR LOOP", days);
    }
  }, [queryDate, loading, queryResult]);

  console.log("⚠️ :", schedules);
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
            viewOption === ONE_DAY
              ? "grid grid-cols-[4rem,1fr]"
              : viewOption === ONE_WEEK
              ? "grid grid-cols-[4rem,repeat(7,1fr)]"
              : ""
          }`}
          // style={{ gridTemplateRows: `repeat(${schedules.length}, 20px)` }}
        >
          {labels.map((label, index) => (
            <>
              <div
                key={index}
                className={`${label.label} col-start-1  text-center text-xs h-6 border-t border-gray-200`}
                style={{ gridRowStart: `${index + 1}` }}
              >
                {label.label?.substring(2) === "00" ||
                label.label?.substring(2) === "30"
                  ? label.label
                  : ""}
              </div>
            </>
          ))}
          {schedules.map((day, dayIndex) => {
            return labels.map((label, labelIndex) => (
              <div
                key={labelIndex}
                className={`${day.date.getDay()}-${
                  label.label
                }-${labelIndex} h-6 border-t border-gray-200 border-r`}
                style={{
                  gridColumnStart: `${dayIndex + 2}`,
                  gridRowStart: `${labelIndex}`,
                }}
              />
            ));
          })}
        </div>
      </div>
    </>
  );
};
