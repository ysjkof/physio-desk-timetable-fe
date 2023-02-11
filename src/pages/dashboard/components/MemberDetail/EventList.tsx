import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { startOfWeek, endOfWeek } from 'date-fns';
import { GET_RESERVATIONS_OF_MEMBER_DOCUMENT } from '../../../../graphql';
import {
  getMonthStartEnd,
  getStringOfDateTime,
} from '../../../../utils/date.utils';
import { PersonPlus } from '../../../../svgs';
import { useStore } from '../../../../store';
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
  const clinicId = useStore((state) => state.selectedClinicId);
  const { memberId } = useParams();

  const variables = {
    input: { page, startDate, endDate, clinicId, memberId: Number(memberId) },
  };

  const { fetchMore } = useQuery<
    GetReservationsOfMemberQuery,
    GetReservationsOfMemberQueryVariables
  >(GET_RESERVATIONS_OF_MEMBER_DOCUMENT, {
    variables,
    onCompleted({ getReservationsOfMember: { results, totalPages } }) {
      // 무한 스크롤일 때
      // setEventList((prev) => [...prev, ...(results || [])]);
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
        {eventList.map((a) => (
          <EventListItem
            key={a.id}
            registrationNumber={a.patient?.registrationNumber}
            name={a.patient?.name}
            startDate={a.startDate}
          />
        ))}
      </ul>
      <div className="flex justify-center gap-4 border-t pt-2">
        <PagesButton pages={pages} setPage={setPage} />
      </div>
    </div>
  );
};

interface EventListItemProps {
  registrationNumber: number | undefined;
  name: string | undefined;
  startDate: Date;
}

const EventListItem = ({
  registrationNumber = 0,
  name = '',
  startDate,
}: EventListItemProps) => {
  return (
    <li className="flex rounded-md border bg-white px-4 py-3">
      <EventListItemIcon />
      <div className="flex flex-col">
        <span>
          환자예약(
          {`${registrationNumber} ${name}`})
        </span>
        <span>{getStringOfDateTime(new Date(startDate))}</span>
      </div>
    </li>
  );
};

const EventListItemIcon = () => {
  return (
    <div
      className="mr-2 flex items-center justify-center rounded-md p-1 text-white"
      style={{ backgroundColor: '#6BA6FF' }}
    >
      <PersonPlus className="h-9 w-9" />
    </div>
  );
};

interface PagesButtonProps {
  pages: number[];
  setPage: (page: number) => void;
}

const PagesButton = ({ pages, setPage }: PagesButtonProps) => {
  return (
    <>
      {pages.map((page) => (
        <button key={page} type="button" onClick={() => setPage(page)}>
          {page}
        </button>
      ))}
    </>
  );
};

export default EventList;
