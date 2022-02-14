import React, { useEffect, useRef, useState } from "react";
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

  const weeks = [
    {
      date: new Date(),
      users: [
        {
          name: "치료사A",
          contents: [
            {
              labelDate: "labes의 값을 참조로 연결",
              reservations: [
                {
                  id: 1,
                  patient: { name: "환자요" },
                  startDate: new Date(),
                  endDate: new Date(),
                  program: "program",
                  memo: "string",
                },
              ],
            },
            {
              labelDate: "labes의 값을 참조로 연결",
              reservations: [],
            },
            {
              labelDate: "labes의 값을 참조로 연결",
              reservations: [],
            },
          ],
        },
        {
          name: "치료사B",
          contents: [
            {
              labelDate: "labes의 값을 참조로 연결",
              reservations: [
                {
                  id: 2,
                  patient: { name: "환자요" },
                  startDate: new Date(),
                  endDate: new Date(),
                  program: "program",
                  memo: "string",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const [boxNum, setBoxNum] = useState<number[]>([435729885]);
  const elementRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const observer = new MutationObserver((mutation) => {
    mutation.forEach(function (mutation) {
      console.log(mutation.addedNodes);
      // console.log(mutation.previousSibling);
      console.log(mutation.target.childNodes);
    });
  });
  const config = { attributes: true, childList: true, characterData: true };

  useEffect(() => {
    observer.observe(elementRef.current, config);
  }, []);

  //

  return (
    <>
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <div className="">
        <h1 className="mb-10 border-b py-6 text-5xl font-bold">TEST PAGE</h1>
        <div id="toast-ui-cld" />
        {/*  */}
        <SearchPatient />
        <div id="observe" className="mb-10" ref={elementRef}>
          <button
            className="shadow bg-zinc-50 rounded-lg px-3 py-1"
            onClick={() =>
              setBoxNum((current) => [
                ...current,
                current[0] * (current.length + 1),
              ])
            }
          >
            Add Box
          </button>
          {boxNum.map((box, i) => (
            <div key={i}>{box}</div>
          ))}
        </div>
        {/*  */}
        <div className="bg-slate-300">
          {weeks.map((day) => {
            return (
              <div className="border">
                <div className="border-b mb-2">
                  {day.date.toLocaleDateString()}
                </div>
                <div className="border-r flex space-x-3">
                  {day.users.map((user) => {
                    return (
                      <div className="border-r border-dashed">
                        <div className="border-b border-red-400">
                          {user.name}
                        </div>
                        <div>
                          {user.contents.map((content) => {
                            return (
                              <div className="h-5 space-y-4 hover:bg-red-400">
                                {content.reservations.map((reservation) => {
                                  return <div>{reservation.patient.name}</div>;
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
