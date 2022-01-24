import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ONE_WEEK } from "../constants";

interface IReservation {
  id: number;
  start: Date;
  end: Date;
  memeo: string;
}

interface IDay {
  date: Date;
  reservations: IReservation[];
}

class Day {
  date: Date;
  reservations: [];
  constructor(date: Date, reservations: []) {
    this.date = date;
    this.reservations = reservations;
  }
}

export const Test = () => {
  // 칸 그리는 배열과 데이터 넣는 배열을 따로 작성
  const weeks: IDay[] = [];
  const timeoption = ["0900", "1000"];
  const queryDate = new Date("2022-01-10T00:00:00.000Z");

  const reservations = [];

  for (let i = 0; i < 7; i++) {
    weeks.push(new Day(new Date(`2022-01-1${i}`), []));
  }

  console.log("⚠️ :", weeks);

  return (
    <>
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <div>test</div>
    </>
  );
};
