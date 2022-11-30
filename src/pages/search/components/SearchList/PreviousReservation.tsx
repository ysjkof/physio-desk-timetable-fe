import { RESERVATION_STATE_KOR } from '../../../../constants/constants';
import { getDateAndDifference } from '../../../../utils/date.utils';
import { createArrayFromLength } from '../../../../utils/utils';
import { ButtonOfPages, ListCell } from '../../../../components';
import type { GetReservationsByPatientQuery } from '../../../../types/generated.types';
import type { ReservationInPatient } from '../../../../types/common.types';

interface PreviousReservationProps {
  data: GetReservationsByPatientQuery | undefined;
  changePage: (page: number) => void;
}

interface TitleProps {
  subject: string[];
}

interface ReservationsProps {
  reservations: ReservationInPatient[] | undefined | null;
}

interface NumberOfPagesProps {
  totalPages: number;
  changePage: (page: number) => void;
}

export function PreviousReservation({
  changePage,
  data,
}: PreviousReservationProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 p-6 pb-2">
      <div className="w-full rounded-md bg-white">
        <div className="flex w-full px-4 pt-4">
          총 예약 수 : {data?.getReservationsByPatient.totalCount}
        </div>
        <Title subject={['시간', '상태', '치료한사람', '예약한사람']} />
        <Reservations reservations={data?.getReservationsByPatient.results} />
        <NumberOfPages
          totalPages={data?.getReservationsByPatient.totalPages || 1}
          changePage={changePage}
        />
      </div>
    </div>
  );
}

function Title({ subject }: TitleProps) {
  return (
    <div className="flex w-full border-b px-2">
      {subject.map((title) => (
        <ListCell key={title}>{title}</ListCell>
      ))}
    </div>
  );
}

function Reservations({ reservations }: ReservationsProps) {
  return (
    <div className="sm:min-h-[320px]">
      {reservations?.map((reservation) => (
        <div key={reservation.id} className="flex w-full px-2">
          <ListCell>
            {getDateAndDifference(reservation.startDate, reservation.endDate)}
          </ListCell>
          <ListCell>
            {RESERVATION_STATE_KOR[reservation.state]}
            {reservation.isFirst && '신환'}
          </ListCell>
          <ListCell>{reservation.user.name}</ListCell>
          <ListCell>{reservation.lastModifier.name}</ListCell>
        </div>
      ))}
    </div>
  );
}

function NumberOfPages({ totalPages, changePage }: NumberOfPagesProps) {
  const numberOfPages = createArrayFromLength(totalPages || 1);

  return (
    <div className="flex w-full items-center justify-center border-t">
      {numberOfPages.map((page) => (
        <ButtonOfPages page={page} changePage={changePage} />
      ))}
    </div>
  );
}
