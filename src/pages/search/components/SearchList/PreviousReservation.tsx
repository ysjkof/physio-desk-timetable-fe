import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { RESERVATION_STATE_KOR } from '../../../../constants/constants';
import { getDateAndDifference } from '../../../../utils/dateUtils';
import { createArrayFromLength } from '../../../../utils/commonUtils';
import { ButtonOfPages, ListCell } from '../../../../components';
import { GET_RESERVATIONS_BY_PATIENT_DOCUMENT } from '../../../../graphql';
import type { GetReservationsByPatientQuery } from '../../../../types/generatedTypes';
import type { ReservationInPatient } from '../../../../types/processedGeneratedTypes';

interface PreviousReservationProps {
  userId: number;
}

interface TitleProps {
  subject: string[];
}

interface ReservationsProps {
  reservations: ReservationInPatient[] | undefined | null;
}

interface NumberOfPagesProps {
  totalPages: number;
  page: number;
  changePage: (page: number) => void;
}

export function PreviousReservation({ userId }: PreviousReservationProps) {
  const [page, setPage] = useState(1);

  const [callQuery, { data }] = useLazyQuery<GetReservationsByPatientQuery>(
    GET_RESERVATIONS_BY_PATIENT_DOCUMENT,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const changePage = (pageNumber: number) => {
    if (page === pageNumber) return;
    setPage(pageNumber);
  };

  useEffect(() => {
    callQuery({
      variables: { input: { page, id: userId } },
    });
  }, [page, userId]);

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
          page={page}
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

function NumberOfPages({ totalPages, page, changePage }: NumberOfPagesProps) {
  const numberOfPages = createArrayFromLength(totalPages || 1);

  return (
    <div className="flex w-full items-center justify-center border-t">
      {numberOfPages.map((pageNumber) => (
        <ButtonOfPages
          key={pageNumber}
          page={pageNumber}
          changePage={changePage}
          isActive={pageNumber === page}
        />
      ))}
    </div>
  );
}
