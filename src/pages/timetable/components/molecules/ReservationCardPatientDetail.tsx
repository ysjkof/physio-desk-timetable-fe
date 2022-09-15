import { Patient } from '../../../../graphql/generated/graphql';

export default function ReservationCardPatientDetail({
  memo,
}: Partial<Patient>) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">치료횟수</span>
        <span>{2}</span>
      </div>
      <div>
        <span className="">메모</span>
        <p className="pl-4">{memo}</p>
      </div>
    </div>
  );
}
