import { gql, useQuery } from "@apollo/client";
import {
  faAngleLeft,
  faAngleRight,
  faFemale,
  faMale,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import {
  listReservationsQuery,
  listReservationsQueryVariables,
  listReservationsQuery_listReservations_results,
} from "../../__generated__/listReservationsQuery";
import { TimezoneLi } from "../patient/components/TimezoneLi";

const LIST_RESERVATIONS_QUERY = gql`
  query listReservationsQuery($input: ListReservationsInput!) {
    listReservations(input: $input) {
      ok
      totalCount
      results {
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

interface ISchedules {
  label?: boolean;
  timezone: string;
  schedules: listReservationsQuery_listReservations_results[];
}

export const TimeTable = () => {
  const timearray = [];
  // 시간표에 출력할 시간 설정
  const [timeoption, setTiemoption] = useState(["0900", "1900"]);
  const scheduleContainer: ISchedules[] = [
    { label: true, timezone: "label", schedules: [] },
  ];

  // 쿼리할 때 사용할 날짜로 이 값을 기준으로 날짜를 쿼리 한다.
  const [queryDate, setQueryDate] = useState(new Date("2022-01-09"));

  function getScheduleHeight(startDate: any, endDate: any) {
    return (
      Math.abs(new Date(startDate).getTime() - new Date(endDate).getTime()) /
      1000 /
      60
    );
  }

  function getHHMM(inputDate: string) {
    const localDate = new Date(inputDate);
    const hh = String(localDate.getHours()).padStart(2, "0");
    const mm = String(localDate.getMinutes()).padStart(2, "0");
    return hh.concat(mm);
  }

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
      scheduleContainer.push({
        timezone: hhmm,
        schedules: [],
      });

    if (scheduleContainer.length > 200) {
      break;
    }
  }

  const reservations = queryResult?.listReservations.results;
  if (reservations) {
    for (const reservation of reservations) {
      const hhmm = getHHMM(reservation.startDate);
      const scheduleIndex = scheduleContainer.findIndex(
        (schedule) => schedule.timezone === hhmm
      );
      // console.log("⚠️ :", scheduleIndex);
      scheduleContainer[scheduleIndex].timezone = hhmm;
      scheduleContainer[scheduleIndex].schedules.push({
        ...reservation,
      });
    }
  }
  // console.log("⚠️ :", scheduleContainer);
  console.log("⚠️ :", reservations);
  console.log("⚠️ :", scheduleContainer[0]);

  return (
    <div className="bg-gray-100">
      <div className="time-grid container mx-auto h-full flex flex-col py-2 space-y-4">
        <h1 className="text-3xl font-bold flex flex-row justify-between px-4 py-1 items-center sm:rounded-md bg-white shadow-cst">
          <button onClick={() => console.log("⚠️ :", "Left Click")}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>

          <span>오늘 예약</span>
          <button onClick={() => console.log("⚠️ :", "Right Click")}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </h1>
        <div className="flex flex-row sm:rounded-md shadow-cst bg-white">
          {/*  */}
          <div className="time-grid-left">
            <div className="timezone-container w-full flex flex-col divide-y divide-solid">
              {scheduleContainer.map((schedule, index) => (
                <TimezoneLi key={index} label={schedule.timezone} />
              ))}
            </div>
          </div>
          {/*  */}
          <div className="time-grid-right relative w-full">
            {/* 오른쪽 가로 줄, 가이드라인 */}
            <div className="time-grid-right-row flex absolute z-20 flex-col divide-y divide-solid w-full ">
              {scheduleContainer.map((schedule, index) => (
                <div key={index} className="guideline flex-auto h-3"></div>
              ))}
            </div>
            {/* 오른쪽 세로 줄 */}
            <div className="time-grid-right-col absolute z-30 h-full w-full">
              {/* 스케쥴 컨테이터.스케쥴블럭.블럭.스케쥴 */}
              <div className="schedule-container flex flex-col border-green-700">
                {scheduleContainer.map((scheduleBlock, index) => (
                  <div
                    key={index}
                    className={`scheduleBlock flex flex-row gap-2 items-center justify-center px-2 hover:ring-1 h-3 ${
                      scheduleBlock.label ? "bg-gray-50 rounded-tr-md" : ""
                    }`}
                    id={scheduleBlock.timezone}
                  >
                    {scheduleBlock.label ? (
                      <div className="scheduleBlock-header text-sm font-extralight text-gray-400">
                        예약
                      </div>
                    ) : null}
                    {scheduleBlock.schedules.map((schedule, index) => (
                      <div
                        key={index}
                        className="scheduleBlock-schedule group text-sm bg-white flex flex-row gap-1 outline outline-1 rounded-sm px-1 cursor-pointer hover:bg-sky-500 hover:outline-sky-500 relative top-[0.420rem]"
                      >
                        {scheduleBlock.label}
                        <div className="schedule-title flex flex-row gap-1 group-hover:text-white">
                          <span>
                            {schedule?.patient?.gender === "male" ? (
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
                          <span className="">{schedule?.patient?.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm  group-hover:text-white">
                            {schedule?.memo}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
