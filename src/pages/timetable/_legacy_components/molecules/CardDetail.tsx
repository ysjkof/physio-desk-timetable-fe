import type { PropsWithChildren } from 'react';

interface TimeProps {
  totalTime: number;
  startTime: string;
  endTime?: string;
}

interface LastUpdateProps {
  name: string;
  updatedAt: string;
}

function Therapist({ children }: PropsWithChildren) {
  return (
    <div className="relative grid grid-cols-[5rem,1fr] items-center">
      <span>치료사</span>
      <span>{children}</span>
    </div>
  );
}

function Time({ startTime, endTime, totalTime }: TimeProps) {
  return (
    <div className="grid grid-cols-[5rem,1fr] items-center">
      <span>시간</span>
      <span>시작 : {startTime}</span>
      {endTime && <span className="col-start-2">종료 : {endTime}</span>}
      <span className="col-start-2">전부 {totalTime}분</span>
    </div>
  );
}
function Prescription({ children }: PropsWithChildren) {
  return (
    <div className="grid grid-cols-[5rem,1fr] items-center">
      <span className="">처방</span>
      <span className="space-x-4">{children}</span>
    </div>
  );
}
function State({ children }: PropsWithChildren) {
  return (
    <div className="grid grid-cols-[5rem,1fr] items-center">
      <span className="">상태</span>
      <span className="flex justify-between pr-1">{children}</span>
    </div>
  );
}
function LastUpdate({ name, updatedAt }: LastUpdateProps) {
  return (
    <div className="grid grid-cols-[5rem,1fr] items-center">
      <span className="">마지막 수정</span>
      <span>{name}</span>
      <span className="col-start-2">{updatedAt}</span>
    </div>
  );
}
function Memo({ children }: PropsWithChildren) {
  return (
    <div>
      <span className="">메모</span>
      <p className="pl-4">{children}</p>
    </div>
  );
}

function CardDetail({ children }: PropsWithChildren) {
  return <div className="flex flex-col gap-6">{children}</div>;
}

CardDetail.Therapist = Therapist;
CardDetail.Time = Time;
CardDetail.Prescription = Prescription;
CardDetail.State = State;
CardDetail.LastUpdate = LastUpdate;
CardDetail.Memo = Memo;

export default CardDetail;
