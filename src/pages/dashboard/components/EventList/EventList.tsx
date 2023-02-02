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
import { Person } from '../../../../svgs';
import type {
  GetReservationsOfMemberQuery,
  GetReservationsOfMemberQueryVariables,
} from '../../../../types/generated.types';

type EventItem = NonNullable<
  GetReservationsOfMemberQuery['getReservationsOfMember']['results']
>[0];

const EventList = ({ date }: { date: Date }) => {
  const [eventList, setEventList] = useState<EventItem[]>([]);
  const [pages, setPages] = useState([1]);

  const [page, setPage] = useState(1);
  const [startOfMonth, endOfMonth] = getMonthStartEnd(date);
  const startDate = startOfWeek(startOfMonth);
  const endDate = endOfWeek(endOfMonth);
  const clinicId = ClinicsOfClient.getSelectedClinic().id;
  const { memberId } = useParams();

  const variables = {
    input: { page, startDate, endDate, clinicId, memberId: Number(memberId) },
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
      const CategorizationByDate = () => {
        const category: { [key: string]: EventItem[] } = {};
        results?.forEach((event) => {
          const date = event.startDate.substring(0, 10);
          if (category[date]) return category[date].push(event);
          category[date] = [event];
        });
        console.log(category);
        return category;
      };

      CategorizationByDate();
      setEventList(results || []);
      setPages((prevPages) => {
        if (!totalPages) return [1];
        if (totalPages === pages.length) return prevPages;
        return Array.from({ length: totalPages }).map((_, index) => index + 1);
      });
    },
  });

  useEffect(() => {
    if (page === pages.length) return;
    fetchMore({ variables });
  }, [page, pages]);

  return (
    <div className="flex w-[440px] basis-full flex-col justify-between">
      <ul className="flex flex-col gap-4 overflow-y-scroll ">
        {eventList.map((a) => {
          return (
            <li
              key={a.id}
              className="flex rounded-md border bg-white px-4 py-3"
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
