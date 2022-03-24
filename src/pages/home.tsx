import { useReactiveVar } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { isLoggedInVar } from "../apollo";

export function Home() {
  console.time("시작");
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  console.timeEnd("시작");
  return (
    <div className="px-4 text-gray-700">
      {console.time("렌더")}
      <h1 className="text-3xl font-bold">무울 Muool</h1>
      <h2 className="mt-4 text-xl font-medium">무울에 오신 걸 환영합니다</h2>
      <p className="mt-2">
        무울은 물리치료사의 예약 관리 시스템입니다. 점점 용량이 커지고,
        느려지고, 못생긴 스프레드 시트. 마찬가지로 느리고 통계를 보기 어려운
        전자차트 프로그램. 일정한 틀이 없고, 통계 확인이 불가능한 환자 차트. 이
        문제점을 해결하려고 만듭니다.
      </p>
      <p className="mt-2 text-sm text-gray-500">
        여기에 랜딩페이지가 만들어질 것입니다.
      </p>
      {isLoggedIn && (
        <div className="mt-2 space-x-4">
          <Link
            className="rounded-lg border px-2 py-1 text-sky-400"
            to="/list-patient"
          >
            List Patient
          </Link>
        </div>
      )}
      {console.timeEnd("렌더")}
    </div>
  );
}
