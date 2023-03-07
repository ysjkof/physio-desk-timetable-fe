import { PropsWithChildren } from 'react';
import { endOfYesterday } from 'date-fns';
import { getStringFromReservationState } from '../../../../utils/commonUtils';
import {
  getStringOfDateTime,
  getStringYearMonth,
  isBeforeDateB,
} from '../../../../utils/dateUtils';
import { PickReservation } from '../PickReservation';
import { ToggleReservationState } from '../ToggleReservationState';
import { Trash } from '../../../../svgs';
import { useDeleteReservation } from '../../hooks';
import { setConfirm } from '../../../../store';
import type { ReservationOfGetReservationsByInterval } from '../../../../types/processedGeneratedTypes';

interface ReservationDetailProps {
  reservation: ReservationOfGetReservationsByInterval;
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
    id,
  } = reservation;

  const { deleteReservation } = useDeleteReservation();

  const invokeDeleteReservation = () => {
    const targetName = `"${patient?.name}"님의 \ ${getStringOfDateTime(
      new Date(startDate)
    )} 예약`;

    setConfirm({
      buttonText: '지우기',
      messages: ['선택한 예약을 지웁니다'],
      targetName,
      confirmAction() {
        deleteReservation({ reservationId: id });
      },
    });
  };

  const isEnableEdit = !isBeforeDateB(endOfYesterday(), new Date(startDate));

  return (
    <div className="w-[300px] pb-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="my-2 text-xl font-medium text-font-gray">
          예약 자세히 보기
        </h2>
        {/* TODO: SelectReservation가 왼쪽에 가서 클릭을 위한 마우스 이동 최소화 고려 */}
        <PickReservation reservation={reservation} />
      </div>
      <div className="space-y-2 border-t border-navy pt-2">
        <DetailBox title="환자정보">
          <li>등록번호 : {patient?.registrationNumber}</li>
          <li>이름 : {patient?.name}</li>
          <li>성별 : {patient?.gender}</li>
          <li>생일 : {getStringYearMonth(new Date(patient?.birthday))}</li>
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
        <DetailBox title="예약상태">
          {getStringFromReservationState(state)}
          {isEnableEdit && (
            <div className="mt-2 ml-2 flex w-full gap-2">
              <ToggleReservationState reservation={reservation} />
            </div>
          )}
        </DetailBox>
        <DetailBox title="수정정보">
          <li>
            {`${getStringOfDateTime(new Date(lastModifier.updatedAt))} (${
              lastModifier.name
            })`}
          </li>
        </DetailBox>
        {isEnableEdit && (
          <button
            type="button"
            onClick={invokeDeleteReservation}
            className="absolute top-16 right-4"
          >
            <Trash iconSize="LG" />
          </button>
        )}
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
      <div className="text-base font-medium text-navy">{title}</div>
      {isParagraph ? (
        <p className="mx-4 max-h-16 min-h-[1rem] overflow-y-scroll break-words rounded-sm py-1">
          {children}
        </p>
      ) : (
        <ul className="mx-4 text-sm">{children}</ul>
      )}
    </div>
  );
};
