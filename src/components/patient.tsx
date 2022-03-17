import { searchPatientByName_searchPatientByName_patients } from "../__generated__/searchPatientByName";

interface IPatient {
  name: string;
  gender: string;
  registrationNumber: string | null;
  birthday: any | null;
}

export const Patient: React.FC<IPatient> = ({
  name,
  gender,
  registrationNumber,
  birthday,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="space-x-4 text-sm">
        <span className="inline-block w-14 text-gray-500">이름</span>
        <span>{name}</span>
      </div>
      <div className="space-x-4 text-sm">
        <span className="inline-block w-14 text-gray-500">성별</span>
        <span>{gender}</span>
      </div>
      <div className="space-x-4 text-sm">
        <span className="inline-block w-14 text-gray-500">생일</span>
        <span>{birthday}</span>
      </div>
      <div className="space-x-4 text-sm">
        <span className="inline-block w-14 text-gray-500">등록번호</span>
        <span>{registrationNumber}</span>
      </div>
      <div className="space-x-4 text-sm">
        <span className="inline-block w-14 text-gray-500">치료횟수</span>
        <span>{2}</span>
      </div>
      <div className="space-x-4 text-sm">
        <span className="inline-block w-14 text-gray-500">병력</span>
        <span>이전병력히스토리기록관리수정입력</span>
      </div>
      <div className="space-x-4 text-sm">
        <span className="inline-block w-14 text-gray-500">메모</span>
        <span>아무거나메모</span>
      </div>
    </div>
  );
};
