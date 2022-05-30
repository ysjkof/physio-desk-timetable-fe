import { Patient } from "../../../graphql/generated/graphql";

export const ReservationCardPatientDetail = ({
  name,
  gender,
  registrationNumber,
  birthday,
  memo,
}: Partial<Patient>) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">이름</span>
        <span>{name}</span>
      </div>
      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">성별</span>
        <span
          className={`
      ${gender === "male" ? "text-blue-500" : "text-red-400"}
      `}
        >
          {gender === "male" ? "남성" : "여성"}
        </span>
      </div>
      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">생일</span>
        <span>{new Date(birthday).toLocaleDateString()}</span>
      </div>
      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">등록번호</span>
        <span>{registrationNumber}</span>
      </div>
      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">치료횟수</span>
        <span>{2}</span>
      </div>
      <div>
        <span className="">병력</span>
        <p className="pl-4">
          일반사면을 명하려면 국회의 동의를 얻어야 한다. 근로자는 근로조건의
          향상을 위하여 자주적인 단결권·단체교섭권 및 단체행동권을 가진다.
          대통령은 취임에 즈음하여 다음의 선서를 한다.
        </p>
      </div>
      <div>
        <span className="">메모</span>
        <p className="pl-4">{memo}</p>
      </div>
    </div>
  );
};
