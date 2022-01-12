import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { ScheduleBlockContents } from "../../components/schedule-block-contents";
import { TimezoneLi } from "../../components/TimezoneLi";
import { getHHMM } from "../../hooks/getHHMM";
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
    <div className="bg-gray-100">
      <div className="time-grid container mx-auto h-full py-2 space-y-4">
        <h1 className="text-3xl font-bold flex flex-row justify-between px-4 py-1 items-center sm:rounded-md bg-white shadow-cst">
          <button onClick={() => console.log("⚠️ :", "Left Click")}>
            &larr;
          </button>
          <span>
            {`${queryDate.getMonth() + 1}월 ${queryDate.getDate()}일`}
          </span>
          <button onClick={() => console.log("⚠️ :", "Right Click")}>
            &rarr;
          </button>
        </h1>
        <div className="flex flex-row sm:rounded-md shadow-cst bg-white">
          {/*  */}
          <div className="time-grid-left">
            <div className="timezone-container w-full divide-y divide-solid">
              <div className="left-timezone-hour w-full text-xs font-extralight text-gray-400 px-2 h-3 bg-gray-50 rounded-tl-md get-in-line text-center">
                시간
              </div>
              {schedulesContainer.map((schedule, index) => (
                <TimezoneLi key={index} timezone={schedule.timezone} />
              ))}
            </div>
          </div>
          {/*  */}
          <div className="time-grid-right relative w-full">
            {/* 오른쪽 rows */}
            <div className="time-grid-right-row absolute z-20 divide-y divide-solid w-full ">
              <div className="guideline flex-auto h-3 get-in-line"></div>
              {schedulesContainer.map((schedule, index) => (
                <div
                  key={index}
                  className="guideline flex-auto h-4"
                  id={schedule.timezone}
                  style={{
                    borderTop: `${
                      schedule.timezone?.substring(2) !== "00" &&
                      schedule.timezone?.substring(2) !== "30" &&
                      "none"
                    }`,
                  }}
                ></div>
              ))}
            </div>
            {/* 오른쪽 columns */}
            <div className="time-grid-right-col absolute z-30 h-full w-full">
              {/* 스케쥴 컨테이터.스케쥴블럭.블럭.스케쥴 */}
              <div className="scheduleBlock w-full  px-2 hover:ring-1 h-3 bg-gray-50 rounded-tr-md">
                <div className="scheduleBlock-header text-xs font-extralight text-gray-400 text-center get-in-line">
                  예약
                </div>
              </div>
              {schedulesContainer.map((schedule, index) => (
                <div
                  key={index}
                  className="scheduleBlock w-full  px-2 hover:ring-1 h-4"
                >
                  {schedule.reservations.map((reservation) => (
                    <ScheduleBlockContents
                      key={reservation.id}
                      timezone={schedule.timezone}
                      gender={reservation.patient.gender}
                      name={reservation.patient.name}
                      memo={reservation.memo}
                      startDate={reservation.startDate}
                      endDate={reservation.endDate}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
