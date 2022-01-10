import { gql, useQuery } from "@apollo/client";
import {
  faAngleLeft,
  faAngleRight,
  faFemale,
  faMale,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { TIMELIST } from "../../constants";
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
    // {
    //   timezone: "0010",
    //   schedules: [],
    // },
    // {
    //   timezone: "0020",
    //   schedules: [],
    // },
    // {
    //   timezone: "0030",
    //   schedules: [],
    // },
    // {
    //   timezone: "0040",
    //   schedules: [],
    // },
    // {
    //   timezone: "0050",
    //   schedules: [],
    // },
    // {
    //   timezone: "0100",
    //   schedules: [],
    // },
    // {
    //   timezone: "0110",
    //   schedules: [],
    // },
    // {
    //   timezone: "0120",
    //   schedules: [],
    // },
    // {
    //   timezone: "0130",
    //   schedules: [],
    // },
    // {
    //   timezone: "0140",
    //   schedules: [],
    // },
    // {
    //   timezone: "0150",
    //   schedules: [],
    // },
    // {
    //   timezone: "0200",
    //   schedules: [],
    // },
    // {
    //   timezone: "0210",
    //   schedules: [],
    // },
    // {
    //   timezone: "0220",
    //   schedules: [],
    // },
    // {
    //   timezone: "0230",
    //   schedules: [],
    // },
    // {
    //   timezone: "0240",
    //   schedules: [],
    // },
    // {
    //   timezone: "0250",
    //   schedules: [],
    // },
    // {
    //   timezone: "0300",
    //   schedules: [],
    // },
    // {
    //   timezone: "0310",
    //   schedules: [],
    // },
    // {
    //   timezone: "0320",
    //   schedules: [],
    // },
    // {
    //   timezone: "0330",
    //   schedules: [],
    // },
    // {
    //   timezone: "0340",
    //   schedules: [],
    // },
    // {
    //   timezone: "0350",
    //   schedules: [],
    // },
    // {
    //   timezone: "0400",
    //   schedules: [],
    // },
    // {
    //   timezone: "0410",
    //   schedules: [],
    // },
    // {
    //   timezone: "0420",
    //   schedules: [],
    // },
    // {
    //   timezone: "0430",
    //   schedules: [],
    // },
    // {
    //   timezone: "0440",
    //   schedules: [],
    // },
    // {
    //   timezone: "0450",
    //   schedules: [],
    // },
    // {
    //   timezone: "0500",
    //   schedules: [],
    // },
    // {
    //   timezone: "0510",
    //   schedules: [],
    // },
    // {
    //   timezone: "0520",
    //   schedules: [],
    // },
    // {
    //   timezone: "0530",
    //   schedules: [],
    // },
    // {
    //   timezone: "0540",
    //   schedules: [],
    // },
    // {
    //   timezone: "0550",
    //   schedules: [],
    // },
    // {
    //   timezone: "0600",
    //   schedules: [],
    // },
    // {
    //   timezone: "0610",
    //   schedules: [],
    // },
    // {
    //   timezone: "0620",
    //   schedules: [],
    // },
    // {
    //   timezone: "0630",
    //   schedules: [],
    // },
    // {
    //   timezone: "0640",
    //   schedules: [],
    // },
    // {
    //   timezone: "0650",
    //   schedules: [],
    // },
    // {
    //   timezone: "0700",
    //   schedules: [],
    // },
    // {
    //   timezone: "0710",
    //   schedules: [],
    // },
    // {
    //   timezone: "0720",
    //   schedules: [],
    // },
    // {
    //   timezone: "0730",
    //   schedules: [],
    // },
    // {
    //   timezone: "0740",
    //   schedules: [],
    // },
    // {
    //   timezone: "0750",
    //   schedules: [],
    // },
    // {
    //   timezone: "0800",
    //   schedules: [],
    // },
    // {
    //   timezone: "0810",
    //   schedules: [],
    // },
    // {
    //   timezone: "0820",
    //   schedules: [],
    // },
    // {
    //   timezone: "0830",
    //   schedules: [],
    // },
    // {
    //   timezone: "0840",
    //   schedules: [],
    // },
    // {
    //   timezone: "0850",
    //   schedules: [],
    // },
    {
      timezone: "0900",
      schedules: [],
    },
    {
      timezone: "0910",
      schedules: [],
    },
    {
      timezone: "0920",
      schedules: [],
    },
    {
      timezone: "0930",
      schedules: [],
    },
    {
      timezone: "0940",
      schedules: [],
    },
    {
      timezone: "0950",
      schedules: [],
    },
    {
      timezone: "1000",
      schedules: [],
    },
    {
      timezone: "1010",
      schedules: [],
    },
    {
      timezone: "1020",
      schedules: [],
    },
    {
      timezone: "1030",
      schedules: [],
    },
    {
      timezone: "1040",
      schedules: [],
    },
    {
      timezone: "1050",
      schedules: [],
    },
    {
      timezone: "1100",
      schedules: [],
    },
    {
      timezone: "1110",
      schedules: [],
    },
    {
      timezone: "1120",
      schedules: [],
    },
    {
      timezone: "1130",
      schedules: [],
    },
    {
      timezone: "1140",
      schedules: [],
    },
    {
      timezone: "1150",
      schedules: [],
    },
    {
      timezone: "1200",
      schedules: [],
    },
    {
      timezone: "1210",
      schedules: [],
    },
    {
      timezone: "1220",
      schedules: [],
    },
    {
      timezone: "1230",
      schedules: [],
    },
    {
      timezone: "1240",
      schedules: [],
    },
    {
      timezone: "1250",
      schedules: [],
    },
    {
      timezone: "1300",
      schedules: [],
    },
    {
      timezone: "1310",
      schedules: [],
    },
    {
      timezone: "1320",
      schedules: [],
    },
    {
      timezone: "1330",
      schedules: [],
    },
    {
      timezone: "1340",
      schedules: [],
    },
    {
      timezone: "1350",
      schedules: [],
    },
    {
      timezone: "1400",
      schedules: [],
    },
    {
      timezone: "1410",
      schedules: [],
    },
    {
      timezone: "1420",
      schedules: [],
    },
    {
      timezone: "1430",
      schedules: [],
    },
    {
      timezone: "1440",
      schedules: [],
    },
    {
      timezone: "1450",
      schedules: [],
    },
    {
      timezone: "1500",
      schedules: [],
    },
    {
      timezone: "1510",
      schedules: [],
    },
    {
      timezone: "1520",
      schedules: [],
    },
    {
      timezone: "1530",
      schedules: [],
    },
    {
      timezone: "1540",
      schedules: [],
    },
    {
      timezone: "1550",
      schedules: [],
    },
    {
      timezone: "1600",
      schedules: [],
    },
    {
      timezone: "1610",
      schedules: [],
    },
    {
      timezone: "1620",
      schedules: [],
    },
    {
      timezone: "1630",
      schedules: [],
    },
    {
      timezone: "1640",
      schedules: [],
    },
    {
      timezone: "1650",
      schedules: [],
    },
    {
      timezone: "1700",
      schedules: [],
    },
    {
      timezone: "1710",
      schedules: [],
    },
    {
      timezone: "1720",
      schedules: [],
    },
    {
      timezone: "1730",
      schedules: [],
    },
    {
      timezone: "1740",
      schedules: [],
    },
    {
      timezone: "1750",
      schedules: [],
    },
    {
      timezone: "1800",
      schedules: [],
    },
    {
      timezone: "1810",
      schedules: [],
    },
    {
      timezone: "1820",
      schedules: [],
    },
    {
      timezone: "1830",
      schedules: [],
    },
    {
      timezone: "1840",
      schedules: [],
    },
    {
      timezone: "1850",
      schedules: [],
    },
    {
      timezone: "1900",
      schedules: [],
    },
    // {
    //   timezone: "1910",
    //   schedules: [],
    // },
    // {
    //   timezone: "1920",
    //   schedules: [],
    // },
    // {
    //   timezone: "1930",
    //   schedules: [],
    // },
    // {
    //   timezone: "1940",
    //   schedules: [],
    // },
    // {
    //   timezone: "1950",
    //   schedules: [],
    // },
    // {
    //   timezone: "2000",
    //   schedules: [],
    // },
    // {
    //   timezone: "2010",
    //   schedules: [],
    // },
    // {
    //   timezone: "2020",
    //   schedules: [],
    // },
    // {
    //   timezone: "2030",
    //   schedules: [],
    // },
    // {
    //   timezone: "2040",
    //   schedules: [],
    // },
    // {
    //   timezone: "2050",
    //   schedules: [],
    // },
    // {
    //   timezone: "2100",
    //   schedules: [],
    // },
    // {
    //   timezone: "2110",
    //   schedules: [],
    // },
    // {
    //   timezone: "2120",
    //   schedules: [],
    // },
    // {
    //   timezone: "2130",
    //   schedules: [],
    // },
    // {
    //   timezone: "2140",
    //   schedules: [],
    // },
    // {
    //   timezone: "2150",
    //   schedules: [],
    // },
    // {
    //   timezone: "2200",
    //   schedules: [],
    // },
    // {
    //   timezone: "2210",
    //   schedules: [],
    // },
    // {
    //   timezone: "2220",
    //   schedules: [],
    // },
    // {
    //   timezone: "2230",
    //   schedules: [],
    // },
    // {
    //   timezone: "2240",
    //   schedules: [],
    // },
    // {
    //   timezone: "2250",
    //   schedules: [],
    // },
    // {
    //   timezone: "2300",
    //   schedules: [],
    // },
    // {
    //   timezone: "2310",
    //   schedules: [],
    // },
    // {
    //   timezone: "2320",
    //   schedules: [],
    // },
    // {
    //   timezone: "2330",
    //   schedules: [],
    // },
    // {
    //   timezone: "2340",
    //   schedules: [],
    // },
    // {
    //   timezone: "2350",
    //   schedules: [],
    // },
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

  // for (
  //   let i = parseInt(timeoption[0]);
  //   i <= parseInt(timeoption[1]);
  //   i = i + 100
  // ) {
  //   let hhmm: string = "";
  //   if (String(i).length === 4) {
  //     hhmm = String(i);
  //   } else if (String(i).length === 3) {
  //     hhmm = String(i).padStart(4, "0");
  //   }
  //   scheduleContainer.push({
  //     timezone: hhmm,
  //     schedules: [],
  //   });
  //   if (scheduleContainer.length > 30) {
  //     break;
  //   }
  // }

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
