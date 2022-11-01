import { GENDER_KOR } from '../../../../constants/constants';
import { getYMD } from '../../../../services/dateServices';
import { cls } from '../../../../utils/utils';

interface ReservationCardNameProps {
  gender: keyof typeof GENDER_KOR;
  name: string;
  registrationNumber: number | null | undefined;
  birthday: Date;
}

export default function ReservationNameCard({
  gender,
  name,
  registrationNumber,
  birthday,
}: ReservationCardNameProps) {
  return (
    <div className="relative grid w-full grid-cols-5 items-center border-b text-center shadow-md">
      <span className="border-b py-1 text-center text-gray-500">등록번호</span>
      <span className="col-span-2 border-b py-1 text-gray-500">이름</span>
      <div className="col-span-2 flex flex-row items-center justify-between space-x-2 border-b py-1 pr-4 text-gray-500">
        <span>성별</span>
        <span>생년월일</span>
      </div>
      <span
        className={cls(
          'py-2',
          registrationNumber ? 'text-right' : 'text-center'
        )}
      >
        {registrationNumber ? registrationNumber : '-'}
      </span>
      <span className="col-span-2 py-2 text-center">{name}</span>
      <div className="col-span-2 flex flex-row items-center justify-between space-x-2 py-2 pr-4">
        <span
          className={cls(
            'whitespace-nowrap',
            gender === 'male' ? 'text-blue-500' : 'text-red-400'
          )}
        >
          {GENDER_KOR[gender]}
        </span>
        <span>{getYMD(birthday, 'yyyymmdd', '-')}</span>
      </div>
    </div>
  );
}
