import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  listReservationsQuery,
  listReservationsQueryVariables,
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
        }
        lastModifier {
          email
        }
      }
    }
  }
`;

interface ISchedule {
  timezone: string;
  reserve?: string;
  name?: string;
  gender?: string;
  memo?: string | null;
  patient?: { name?: string; gender?: string };
  startDate?: Date;
  endDate?: Date;
}

export const TimeTable = () => {
  const [timeoption, setTiemoption] = useState(["0900", "1900"]);
  const scheduleContainer: ISchedule[] = [];

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
        date: new Date("2022-1-7"),
        viewOption: null,
        groupId: null,
      },
    },
  });

  for (
    let i = parseInt(timeoption[0]);
    i <= parseInt(timeoption[1]);
    i = i + 100
  ) {
    let hhmm: string = "";
    if (String(i).length === 4) {
      hhmm = String(i);
    } else if (String(i).length === 3) {
      hhmm = String(i).padStart(4, "0");
    }
    scheduleContainer.push({
      timezone: hhmm,
    });
    if (scheduleContainer.length > 30) {
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
      scheduleContainer[scheduleIndex] = { timezone: hhmm, ...reservation };
    }
  }
  console.log("⚠️ :", scheduleContainer);

  return (
    <div className="time-grid container mx-auto bg-blue-500 h-full flex divide-x divide-solid">
      {/*  */}
      <div className="time-grid-left bg-indigo-400 w-10">
        <div className="timezone-container  bg-violet-700 flex flex-col divide-y divide-solid">
          {scheduleContainer.map((schedule, index) => (
            <TimezoneLi key={index} label={schedule.timezone} />
          ))}
        </div>
      </div>
      {/*  */}
      <div className="time-grid-right relative bg-red-300 w-full">
        {/* --- */}
        <div className="time-grid-right-row flex absolute   flex-col divide-y divide-solid w-full">
          {scheduleContainer.map((schedule, index) => (
            <div key={index} className="guideline flex-auto h-7"></div>
          ))}
        </div>
        {/* \\\ */}
        <div className="time-grid-right-col absolute h-full w-full">
          <div className="schedule-container flex flex-col border-green-700">
            {scheduleContainer.map((schedule, index) => (
              <div
                key={index}
                className="schedule flex items-center justify-center"
                id={schedule.timezone}
                style={{ height: "28px" }}
              >
                <span>{schedule.patient?.name}</span>
                <span>{schedule.patient?.gender}</span>
                <span>{schedule.memo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
