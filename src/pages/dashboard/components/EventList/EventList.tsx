import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { startOfWeek, endOfWeek } from 'date-fns';
import { GET_RESERVATIONS_OF_MEMBER_DOCUMENT } from '../../../../graphql';
import { ClinicsOfClient } from '../../../../models';
import {
  getMonthStartEnd,
  getStringOfDateTime,
} from '../../../../utils/date.utils';
import type {
  GetReservationsOfMemberQuery,
  GetReservationsOfMemberQueryVariables,
} from '../../../../types/generated.types';
import { Person } from '../../../../svgs';

type EventItem = NonNullable<
  GetReservationsOfMemberQuery['getReservationsOfMember']['results']
>[0];

const EventList = ({ date }: { date: Date }) => {
  const [page, setPage] = useState(1);
  const [maximumPage, setMaximumPage] = useState(1);
  const [eventList, setEventList] = useState<EventItem[]>([]);

  const pages = Array.from({ length: maximumPage }).map(
    (_, index) => index + 1
  );

  const clinicId = ClinicsOfClient.getSelectedClinic().id;
  const { memberId } = useParams();

  const [startOfMonth, endOfMonth] = getMonthStartEnd(date);
  const startDate = startOfWeek(startOfMonth);
  const endDate = endOfWeek(endOfMonth);

  const variables = {
    input: { startDate, endDate, clinicId, memberId: Number(memberId), page },
  };

  const { fetchMore } = useQuery<
    GetReservationsOfMemberQuery,
    GetReservationsOfMemberQueryVariables
  >(GET_RESERVATIONS_OF_MEMBER_DOCUMENT, {
    variables,
    fetchPolicy: 'network-only',
    onCompleted({ getReservationsOfMember: { results, totalPages } }) {
      // 무한 스크롤일 때
      // setEventList((prev) => [...prev, ...(results || [])]);
      setEventList(results || []);
      if (totalPages && totalPages !== maximumPage) setMaximumPage(totalPages);
    },
  });

  useEffect(() => {
    if (page === 1 || page === maximumPage) return;
    fetchMore({ variables });
  }, [page, maximumPage, date]);

  return (
    <div className="flex basis-full flex-col justify-between">
      <ul className="flex flex-col gap-4 overflow-y-scroll">
        {eventList.map((a) => {
          return (
            <li
              key={a.id}
              className="flex w-[440px] rounded-md border bg-white px-4 py-3"
            >
              <div
                className="mr-2 flex items-center justify-center rounded-md p-1 text-white"
                style={{ backgroundColor: '#6BA6FF' }}
              >
                <Person className="h-9 w-9" />
              </div>
              <div className="flex flex-col">
                <span>
                  환자예약(
                  {`${a.patient?.registrationNumber} ${a.patient?.name}`})
                </span>
                <span>{getStringOfDateTime(new Date(a.startDate))}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex justify-center gap-4 border-t pt-2">
        {pages.map((page) => (
          <button key={page} type="button" onClick={() => setPage(page)}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventList;
