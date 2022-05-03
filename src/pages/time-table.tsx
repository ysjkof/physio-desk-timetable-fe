import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Timetable } from "../components/timetable";
import { useListReservationsQuery } from "../graphql/generated/graphql";
import { useReactiveVar } from "@apollo/client";
import { todayVar } from "../store";
import { useMe } from "../hooks/useMe";

export const TimeTable = () => {
  const today = useReactiveVar(todayVar);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const { data: meData } = useMe();

  const { data } = useListReservationsQuery({
    variables: {
      input: {
        date: selectedDate,
        viewOption: 7,
        groupIds:
          meData?.me.groups && meData.me.groups.length >= 1
            ? meData.me.groups.map((group) => group.group.id)
            : null,
      },
    },
  });

  if (!meData) {
    return <></>;
  }
  return (
    <>
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <div className="container mx-auto h-full">
        <div className="relative h-[700px]">
          <Timetable
            tableTime={{
              start: { hours: 9, minutes: 0 },
              end: { hours: 19, minutes: 0 },
            }}
            eventsData={data}
            selectedDateState={{ selectedDate, setSelectedDate }}
            loginUser={meData}
          />
        </div>
      </div>
    </>
  );
};
