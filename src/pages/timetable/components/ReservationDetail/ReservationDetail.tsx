import { PropsWithChildren } from 'react';
import { ReservationInList } from '../../../../types/common.types';
import { getStringFromReservationState } from '../../../../utils/common.utils';
import {
  getStringOfDateTime,
  getStringOfDate,
} from '../../../../utils/date.utils';

interface ReservationDetailProps {
  reservation: ReservationInList;
}

const ReservationDetail = ({ reservation }: ReservationDetailProps) => {
  const {
    patient,
    user,
    lastModifier,
    prescriptions,
    endDate,
    startDate,
    memo,
    state,
  } = reservation;

  return (
    <div className="w-[300px]">
      <h2 className="my-2 text-center text-xl font-medium">예약 자세히 보기</h2>
      <div className="space-y-2 border-t pt-2">
        <DetailBox title="환자정보">
          <li>등록번호 : {patient.registrationNumber}</li>
          <li>이름 : {patient.name}</li>
          <li>성별 : {patient.gender}</li>
          <li>생일 : {getStringOfDate(new Date(patient.birthday))}</li>
        </DetailBox>
        <DetailBox title="담당치료사">
          <li>{user.name}</li>
        </DetailBox>
        <DetailBox title="치료일정">
          <li>시작: {getStringOfDateTime(new Date(startDate))}</li>
          <li>종료: {getStringOfDateTime(new Date(endDate))}</li>
        </DetailBox>
        <DetailBox title="처방">
          {prescriptions?.map((prescription) => (
            <li key={prescription.id}>{prescription.name}</li>
          ))}
        </DetailBox>
        <DetailBox title="메모" isParagraph>
          {memo}
        </DetailBox>
        <DetailBox title="상태">
          {getStringFromReservationState(state)}
        </DetailBox>
        <DetailBox title="수정정보">
          <li>
            {`${getStringOfDateTime(new Date(lastModifier.updatedAt))} (${
              lastModifier.name
            })`}
          </li>
        </DetailBox>
      </div>
    </div>
  );
};

export default ReservationDetail;

interface DetailBoxProps extends PropsWithChildren {
  title: string;
  isParagraph?: boolean;
}

const DetailBox = ({
  title,
  isParagraph = false,
  children,
}: DetailBoxProps) => {
  return (
    <div className="px-4">
      <div className="text-base font-medium">{title}</div>
      {isParagraph ? (
        <p className="mx-4 max-h-16 min-h-[1rem] overflow-y-scroll break-words rounded-sm py-1">
          {children}
        </p>
      ) : (
        <ul className="mx-4">{children}</ul>
      )}
    </div>
  );
};
