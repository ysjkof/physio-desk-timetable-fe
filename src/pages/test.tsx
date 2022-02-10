import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SearchPatient } from "../components/search-patient";
import { ONE_WEEK } from "../libs/variables";

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

  return (
    <>
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <div className="">
        <h1 className="mb-10 border-b py-6 text-5xl font-bold">TEST PAGE</h1>
        <SearchPatient />
      </div>
    </>
  );
};
