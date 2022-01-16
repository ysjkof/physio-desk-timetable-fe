import { gql, useQuery } from "@apollo/client";
import {
  faFemale,
  faMale,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  getHHMM,
  getTimeLength,
  getYYMMDD,
} from "../../hooks/handleTimeFormat";
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
  reservations: listReservationsQuery_listReservations_results[];
}

export const TimeTable = () => {
  const timearray = [];
  // 시간표에 출력할 시간 설정
  const [timeoption, setTiemoption] = useState(["0900", "1900"]);
  const schedulesContainer: IReservationsContainer[] = [];

  // 쿼리할 때 사용할 날짜로 이 값을 기준으로 날짜를 쿼리 한다.
  const [queryDate, setQueryDate] = useState(new Date("2022-01-09"));

  const onClickPrevDate = () => {
    const prevDate = new Date(queryDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setQueryDate(prevDate);
  };
  const onClickNextDate = () => {
    const nextDate = queryDate;
    nextDate.setDate(nextDate.getDate() + 1);
    setQueryDate(new Date(nextDate));
  };

  const { data: queryResult } = useQuery<
    listReservationsQuery,
    listReservationsQueryVariables
  >(LIST_RESERVATIONS_QUERY, {
    variables: {
      input: {
        date: queryDate,
        viewOption: null,
        groupId: null,
      },
    },
  });

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
      schedulesContainer.push({
        timezone: hhmm,
        reservations: [],
      });

    if (schedulesContainer.length > 200) {
      break;
    }
  }

  const reservations = queryResult?.listReservations.results;
  if (reservations) {
    for (const reservation of reservations) {
      const hhmm = getHHMM(reservation.startDate);
      const scheduleIndex = schedulesContainer.findIndex(
        (schedule) => schedule.timezone === hhmm
      );
      schedulesContainer[scheduleIndex].timezone = hhmm;
      schedulesContainer[scheduleIndex].reservations.push({
        ...reservation,
      });
    }
  }

  return (
    <>
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <div className="container mx-auto  h-full">
        <div className="header h-full flex justify-between px-4">
          <button onClick={onClickPrevDate}>&larr;</button>
          <span>
            {queryDate.getMonth() + 1}월 {queryDate.getDate()}일
          </span>
          <button onClick={onClickNextDate}>&rarr;</button>
        </div>
        <div
          className={`h-full main  grid grid-cols-[4rem,1fr] grid-rows-[repeat(${schedulesContainer.length}, 20px)] `}
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
              <div
                className={`${schedule.timezone} col-start-2 text-center text-xs h-6 border-t border-gray-200`}
                style={{ gridRowStart: `${index + 1}` }}
              ></div>
            </>
          ))}
          {schedulesContainer.map((schedule, row) =>
            schedule.reservations.map((reservation, index) => {
              return (
                <div
                  key={index}
                  className={`col-start-2 bg-blue-100 dark:bg-light-blue-600/50 border border-blue-700/10 dark:border-light-blue-500 rounded-lg m-1 p-1`}
                  style={{
                    // 예약의 시작, 끝 시간을 계산해 분 단위로 얻고 한 칸이 10분이라서 10으로 나눠서 gridRowEnd 길이 적용
                    gridRow: `${row + 1}/span ${
                      getTimeLength(
                        reservation.startDate,
                        reservation.endDate
                      ) / 10
                    }`,
                  }}
                >
                  <div className="grid grid-cols-4 justify-items-center overflow-auto items-baseline">
                    <span className="text-xs text-blue-600 dark:text-light-blue-100">
                      {getHHMM(reservation.startDate, true)}~
                      {getHHMM(reservation.endDate, true)}
                    </span>
                    {reservation.patient.registrationNumber ? (
                      <span className="text-xs text-blue-600 dark:text-light-blue-100">
                        R : {reservation.patient.registrationNumber}
                      </span>
                    ) : (
                      <span className="text-xs text-blue-600 dark:text-light-blue-100">
                        B : {getYYMMDD(reservation.patient.birthday)}
                      </span>
                    )}
                    <div className="flex gap-2">
                      <span>
                        {reservation.patient.gender === "male" ? (
                          <FontAwesomeIcon
                            icon={faMale}
                            className=" text-blue-500 group-hover:text-white "
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faFemale}
                            className="text-pink-500 group-hover:text-white"
                          />
                        )}
                      </span>
                      <span className="text-sm font-medium text-blue-600 dark:text-light-blue-100">
                        {/* <span className="font-bold text-sm group-hover:text-base"> */}
                        {reservation.patient.name}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-sm font-medium text-blue-600 dark:text-light-blue-100">
                        EDIT
                      </span>
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        className="text-red-400"
                      />
                    </div>
                    <span className="col-span-4  break-all text-sm text-blue-600">
                      {reservation.memo}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
