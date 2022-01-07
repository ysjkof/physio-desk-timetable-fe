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

export const TimeTable = () => {
  const [timeoption, setTiemoption] = useState(["0900", "1900"]);
  let timeArr = [];
  const scheduleContainer = [];
  for (
    let i = parseInt(timeoption[0]);
    i <= parseInt(timeoption[1]);
    i = i + 100
  ) {
    let hhmm;
    if (String(i).length === 4) {
      hhmm = i;
    } else if (String(i).length === 3) {
      hhmm = String(i).padStart(4, "0");
    }
    timeArr.push(hhmm);
    scheduleContainer.push({
      timezone: i,
      reserve: "",
      name: "",
      gender: "",
    });
    if (timeArr.length > 30) {
      break;
    }
  }
  const [timezoneOption, setTimezoneOption] = useState(timeArr);
  const reserves = [
    {
      id: 1,
      name: "홍길동",
      gender: "남",
      startDate: "2022-01-06T10:00:00+0900",
      endDate: "2022-01-06T10:30:00+0900",
    },
    {
      id: 2,
      name: "이영희",
      gender: "여",
      startDate: "2022-01-06T17:00:00+0900",
      endDate: "2022-01-06T18:00:00+0900",
    },
  ];
  function getScheduleLength(startDate: any, endDate: any) {
    return (
      Math.abs(new Date(startDate).getTime() - new Date(endDate).getTime()) /
      1000 /
      60
    );
  }

  function getHHMM(inputDate: string) {
    const fristSplit = inputDate.split("T", 2);
    const secondSplit = fristSplit[1].split(":", 2);
    return parseInt(secondSplit[0].concat(secondSplit[1]));
  }
  for (const reserve of reserves) {
    const hhmm = getHHMM(reserve.startDate);
    const findItem = scheduleContainer.find(
      (schedule) => schedule.timezone === hhmm
    );
    if (findItem) {
      findItem.name = reserve.name;
      findItem.gender = reserve.gender;
    }
  }
  const temporaryForm = {
    date: new Date(),
    viewOption: null,
    groupId: null,
  };

  const { data: queryResult } = useQuery<
    listReservationsQuery,
    listReservationsQueryVariables
  >(LIST_RESERVATIONS_QUERY, {
    variables: {
      input: {
        date: temporaryForm.date,
        viewOption: temporaryForm.viewOption,
        groupId: temporaryForm.groupId,
      },
    },
  });

  console.log("⚠️ :", queryResult?.listReservations);
  return (
    <div className="time-grid container mx-auto bg-blue-500 h-full flex divide-x divide-solid">
      {/*  */}
      <div className="time-grid-left bg-indigo-400 w-10">
        <div className="timezone-container  bg-violet-700 flex flex-col divide-y divide-solid">
          {timezoneOption.map((timezone, index) => (
            <TimezoneLi key={index} label={timezone} />
          ))}
        </div>
      </div>
      {/*  */}
      <div className="time-grid-right relative bg-red-300 w-full">
        {/* --- */}
        <div className="time-grid-right-row flex absolute   flex-col divide-y divide-solid w-full">
          {timezoneOption.map((timezone, index) => (
            <div key={index} className="guideline flex-auto h-7"></div>
          ))}
        </div>
        {/* \\\ */}
        <div className="time-grid-right-col absolute  h-full w-full">
          <div className="schedule-container flex flex-col items-center w-full h-full  border-green-700">
            {scheduleContainer.map((rr, index) => (
              <div
                key={index}
                className="schedule h-full"
                id={String(rr.timezone)}
              >
                <div className="relative">
                  {rr.name}
                  {rr.gender}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
