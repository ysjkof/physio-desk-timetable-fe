import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
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
    <>
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <div className="container mx-auto bg-red-50 h-full">
        <div className="header bg-blue-200 h-full"></div>
        <div
          className={`h-full main bg-yellow-100 grid grid-cols-[4rem,1fr] grid-rows-[repeat(${schedulesContainer.length}, 20px)]`}
        >
          {schedulesContainer.map((schedule, index) => (
            <div
              key={index}
              className={`${schedule.timezone} bg-green-100 col-start-1 row-start-auto text-center text-xs h-6`}
            >
              {schedule.timezone?.substring(2) === "00" ||
              schedule.timezone?.substring(2) === "30"
                ? schedule.timezone
                : ""}
            </div>
          ))}
          {schedulesContainer.map((schedule, row) =>
            schedule.reservations.map((reservation, index) => {
              return (
                <div
                  key={index}
                  className="col-start-2"
                  style={{ gridRowStart: `${row + 1}` }}
                >
                  {reservation.patient.name}
                  {getHHMM(reservation.startDate, true)}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
