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
  const 치료목록 = [
    {
      종류: "string",
      치료시간: 10 | 20 | 30 | 40 | 50 | 60,
      비용: 1,
    },
    {
      종류: "도수치료",
      치료시간: 30,
      비용: 70000,
    },
    {
      종류: "충격파",
      자세한: "포커스",
      타수: 1000,
      치료시간: 10,
      비용: 70000,
    },
    {
      종류: "충격파",
      자세한: "포커스",
      타수: 1000,
      치료시간: 10,
      비용: 70000,
    },
  ];
  const 치료 = {
    이름: "묶음치료1",
    치료: [
      {
        종류: "도수치료",
        치료시간: 30,
        비용: 70000,
      },
      {
        종류: "충격파",
        자세한: "포커스",
        타수: 1000,
        치료시간: 10,
        비용: 70000,
      },
    ],
    비용: 120000,
  };
  // 그룹은 그룹의 가격표를 갖는다
  // 유저는 유저의 가격표를 갖는다.
  // 기보

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
